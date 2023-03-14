import { EventEmitter } from '@angular/core';
import { Client } from './api';
import { SocketsService } from './sockets';
import { SessionFactory } from './session';
import { MindsTitle } from './ux/title';

export class NotificationService {
  session = SessionFactory.build();
  socketSubscriptions: any = {
    notification: null
  };
  onReceive: EventEmitter<any> = new EventEmitter();

  static _(client: Client, sockets: SocketsService, title: MindsTitle) {
    return new NotificationService(client, sockets, title);
  }

  constructor(public client: Client, public sockets: SocketsService, public title: MindsTitle) {
    if (!window.Afs.notifications_count)
      window.Afs.notifications_count = 0;

    this.listen();
  }

  /**
   * Listen to socket events
   */
  listen() {
    this.socketSubscriptions.notification = this.sockets.subscribe('notification', (guid) => {
      this.increment();

      this.client.get(`api/v1/notifications/single/${guid}`)
        .then((response: any) => {
          if (response.notification) {
            this.onReceive.next(response.notification);
          }
        });
    });
  }

  /**
   * Increment the notifications counter
   */
  increment(notifications: number = 1) {
    window.Afs.notifications_count = window.Afs.notifications_count + notifications;
    this.sync();
  }

  /**
   * Clear the notifications. For notification controller
   */
  clear() {
    window.Afs.notifications_count = 0;
    this.sync();
  }

  /**
   * Return the notifications
   */
  getNotifications() {
    var self = this;
    setInterval(function () {
      console.log('getting notifications');

      if (!self.session.isLoggedIn())
        return;

      if (!window.Afs.notifications_count)
        window.Afs.notifications_count = 0;

      self.client.get('api/v1/notifications/count', {})
        .then((response: any) => {
          window.Afs.notifications_count = response.count;
          self.sync();
        });
    }, 60000);
  }

  /**
   * Sync Notifications to the topbar Counter
   */
  sync() {
    for (var i in window.Afs.navigation.topbar) {
      if (window.Afs.navigation.topbar[i].name === 'Notifications') {
        window.Afs.navigation.topbar[i].extras.counter = window.Afs.notifications_count;
      }
    }
    this.title.setCounter(window.Afs.notifications_count);

  }

}
