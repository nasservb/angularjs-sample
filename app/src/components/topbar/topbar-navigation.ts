import { Component, EventEmitter, AfterViewInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs/Rx';

import { Navigation as NavigationService } from '../../services/navigation';

import { SessionFactory } from '../../services/session';
import { Storage } from '../../services/storage';

import { animations } from '../../animations';

@Component({
  selector: 'afs-topbar-navigation',
  templateUrl: 'topbar-navigation.component.html',
  animations: animations
})

export class TopbarNavigation implements AfterViewInit, OnDestroy {

  user;
  session = SessionFactory.build();

  walletPopContent: string = '';
  walletPopState: any;



  constructor(public navigation: NavigationService, public storage: Storage) { }

  ngAfterViewInit() {
  }

  ngOnDestroy() {
  }

  setCounter(name, value) {
    this.navigation.getItems('topbar').forEach((item) => {
      if (item.name !== name) {
        return;
      }

      item.extras.counter = value;
    });
  }
}