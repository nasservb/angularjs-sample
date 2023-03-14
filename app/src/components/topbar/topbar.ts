import { Component } from '@angular/core';

import { Storage } from '../../services/storage';
import { Sidebar } from '../../services/ui/sidebar';
import { NotificationService } from '../../services/notification';
import { SessionFactory } from '../../services/session';

@Component({
  moduleId: module.id,
  selector: 'afs-topbar',
  templateUrl: 'topbar.html'
})

export class Topbar {

  session = SessionFactory.build();
  notifications: any[] = [];

  currentURL: string;
  showSearch: boolean;
  menu:string = "" ;

  constructor(public storage: Storage, public sidebar: Sidebar, public notification: NotificationService) {
    this.buildMenu() ; 
  }

  ngOnInit() {
    this.listenForNotifications();

    //Add for hidden search in homepage.
    this.currentURL=window.location.href;
    let split = this.currentURL.split(".");
    let hostName = split[split.length-1];
    if(hostName == '195/' || hostName == '196/' || hostName == '/com' || hostName == '/ir' || hostName == '195' || hostName == '196' || hostName == 'com' || hostName == 'ir')
    {
        this.showSearch = false;
    } 
    else
    {
        this.showSearch = true;
    }
    //End it.

  }

  buildMenu()
  {
      
  let considered = [];
  let m =""; 

  window.Afs.categories.sort((a, b) => a.code > b.code ? 1: -1);

  for (let l1 in window.Afs.categories) 
  {
      if (window.Afs.categories[l1].level != 1 || considered.indexOf(window.Afs.categories[l1].code ) > -1 )
      continue;
 

      m =m+ "<li class='dropdown'><a href='/service/all/" +
                  window.Afs.categories[l1].slag + 
                  "'><i class='material-icons'>"+
                  window.Afs.categories[l1].icon + 
                  "</i> &nbsp;"+
                  window.Afs.categories[l1].title + 
                   "</a><div class='fulldrop'>" ; 

      for (let l2 in window.Afs.categories) 
      {


        if (window.Afs.categories[l2].parent !=window.Afs.categories[l1].code )
          continue;

        m =m+ "<div class='column'><a  href='/service/all/"+
            window.Afs.categories[l2].slag + 
            "' ><h3>"+
            window.Afs.categories[l2].title + 
           "</h3></a> <ul>";

        for (let l3 in window.Afs.categories) 
        {
          if (window.Afs.categories[l3].parent != window.Afs.categories[l2].code )
              continue; 

          m =m + " <li><a href='/service/all/" + 
                  window.Afs.categories[l3].slag + 
                  "' >"+
                  window.Afs.categories[l3].title + 
                 "</a> <li>";
             
        } 

        m =m+" </ul></div>";
        

      }

      m =m + "</div></li>" 

    }

    this.menu = m ;  
  
   
   
  }
        
   

  /**
   * Open the navigation
   */
  openNav() {
    this.sidebar.open();
  }

  /**
   * Notifications
   */

  listenForNotifications() {
    this.notification.onReceive.subscribe((notification: any) => {
      this.notifications.unshift(notification);

      setTimeout(() => {
        this.closeNotification(notification);
      }, 6000);
    });
  }

  closeNotification(notification: any) {
    let i: any;
    for (i in this.notifications) {
      if (this.notifications[i] === notification) {
        this.notifications.splice(i, 1);
      }
    }
  }

}
