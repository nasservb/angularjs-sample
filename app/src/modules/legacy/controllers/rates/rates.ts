import { Component, EventEmitter, Renderer, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';

import { Client, Upload } from '../../../../services/api';
import { SessionFactory } from '../../../../services/session';
import { SignupModalService } from '../../../../modules/modals/signup/service';
 
import { SocketsService } from '../../../../services/sockets';
 

@Component({
  moduleId: module.id,
  selector: 'afs-rates',
  inputs: ['_object : object', '_keys : keys' ,'_reversed : reversed', 'limit', 'focusOnInit'],
  templateUrl: 'list.html' 
   
})

export class Rates {

  minds;
  object;
  guid: string = '';
  parent: any;

  rates: Array<any> = [];

  rate1 : number = 75;
  rate2 : number = 75;
  rate3 : number = 75;
  rate4 : number = 75;
  rate5 : number = 75;

  rateChange : boolean = false ; 

  keys:Array<any>=[];


  reversed: boolean = false;
  session = SessionFactory.build();

  focusOnInit: boolean = false;
   
  @ViewChild('scrollArea') scrollView: ElementRef;

  editing: boolean = false;

  showModal: boolean = false;

  limit: number = 5;
  offset: string = '';
  inProgress: boolean = false;
  canPost: boolean = true;
  triedToPost: boolean = false;
  moreData: boolean = false;
  loaded: boolean = false;

  socketRoomName: string;
  socketSubscriptions: any = {
    rate: null
  };

  ratesScrollEmitter: EventEmitter<any> = new EventEmitter();

  private autoloadBlocked = false;

  private overscrollTimer;
  private overscrollAmount = 0;

  constructor(
    public client: Client,
    private modal: SignupModalService,
    public sockets: SocketsService,
    private renderer: Renderer,
    private cd: ChangeDetectorRef
  ) {
    this.minds = window.Afs;
  }

  set _object(value: any) {
    this.object = value;
    this.guid = this.object.guid;
    if (this.object.entity_guid)
      this.guid = this.object.entity_guid;
    this.parent = this.object;
    this.load(true);
    this.listen();
  }

  set _reversed(value: boolean) {
    if (value)
      this.reversed = true;
    else
      this.reversed = false;
  }

  load(refresh = false) {
    if (refresh) {
      this.offset = '';
      this.moreData = true;
      this.rates = [];

      if (this.socketRoomName) {
        this.sockets.leave(this.socketRoomName);
      }
      this.socketRoomName = void 0;
    }

    if (this.inProgress) {
      return;
    }

    this.inProgress = true;

    this.client.get('api/v1/rates/' + this.guid, { limit: this.limit, offset: this.offset, reversed: true })
      .then((response: any) => {

        if (!this.socketRoomName && response.socketRoomName) {
          this.socketRoomName = response.socketRoomName;
          this.joinSocketRoom();
        }

        this.loaded = true;
        this.inProgress = false;
        this.moreData = true;

        if (!response.rates) {
          this.moreData = false;
          return false;
        }

        this.rates = response.rates.concat(this.rates);

        if (refresh) {
          this.ratesScrollEmitter.emit('bottom');
        }

        if (this.offset && this.scrollView) {
          let el = this.scrollView.nativeElement;
          let scrollTop = el.scrollTop;
          let scrollHeight = el.scrollHeight;

          this.cd.detectChanges();
          el.scrollTop = scrollTop + el.scrollHeight - scrollHeight;
        }

        this.offset = response['load-previous'];

        if (
          !this.offset ||
          this.offset === null ||
          response.rates.length < (this.limit - 1)
        ) {
          this.moreData = false;
        }
      })
      .catch((e) => {
        this.inProgress = false;
      });
  }

  autoloadPrevious() {
    if (!this.moreData || this.autoloadBlocked) {
      return;
    }

    this.cancelOverscroll();

    this.autoloadBlocked = true;
    setTimeout(() => {
      this.autoloadBlocked = false;
    }, 1000);

    this.load();
  }

  overscrollHandler({ deltaY }) {
    this.cancelOverscroll();

    if (this.autoloadBlocked) {
      this.overscrollAmount = 0;
      return;
    }

    this.overscrollAmount += deltaY;

    this.overscrollTimer = setTimeout(() => {
      if (this.overscrollAmount < -75) { //75px
        this.autoloadPrevious();
      }

      this.overscrollAmount = 0;
    }, 250); // in 250ms
  }

  cancelOverscroll() {
    if (this.overscrollTimer) {
      clearTimeout(this.overscrollTimer);
    }
  }

  joinSocketRoom() {
    if (this.socketRoomName) {
      this.sockets.join(this.socketRoomName);
    }
  }

 

  ngOnDestroy() {
    this.cancelOverscroll();

    if (this.socketRoomName) {
      this.sockets.leave(this.socketRoomName);
    }

    for (let sub in this.socketSubscriptions) {
      if (this.socketSubscriptions[sub]) {
        this.socketSubscriptions[sub].unsubscribe();
      }
    }
  }

  listen() {
    this.socketSubscriptions.rate = this.sockets.subscribe('rate', (parent_guid, owner_guid, guid) => {
      if (parent_guid !== this.guid) {
        return;
      }

      if (this.session.isLoggedIn() && owner_guid === this.session.getLoggedInUser().guid) {
        return;
      }

      this.client.get('api/v1/rates/' + this.guid, { limit: 1, offset: guid, reversed: false })
        .then((response: any) => {
          if (!response.rates || response.rates.length === 0) {
            return;
          }

          this.rates.push(response.rates[0]);
          this.ratesScrollEmitter.emit('bottom');
        });
    });
  }

  postEnabled() {
    
    return !this.inProgress && this.canPost && (this.rateChange == false);
  }

  changeRate() {
	 
	
	(document.getElementById("rate-insert-1")as HTMLInputElement).innerHTML="("+(document.getElementById("rate-i-1")as HTMLInputElement).value+")" ;
	(document.getElementById("rate-insert-2")as HTMLInputElement).innerHTML="("+(document.getElementById("rate-i-2")as HTMLInputElement).value+")" ;
	(document.getElementById("rate-insert-3")as HTMLInputElement).innerHTML="("+(document.getElementById("rate-i-3")as HTMLInputElement).value+")" ;
	(document.getElementById("rate-insert-4")as HTMLInputElement).innerHTML="("+(document.getElementById("rate-i-4")as HTMLInputElement).value+")" ;
	(document.getElementById("rate-insert-5")as HTMLInputElement).innerHTML="("+(document.getElementById("rate-i-5")as HTMLInputElement).value+")" ;
  }
  
  
  post(e) {
    e.preventDefault();





    //if (!this.rateChange  ) {
   //  return;
    //}



 
    if (this.inProgress || !this.canPost)
    {
      this.triedToPost = true;
      return;
    }

    let data ={ rate1: (document.getElementById("rate-i-1")as HTMLInputElement).value,
				rate2: (document.getElementById("rate-i-2")as HTMLInputElement).value,
				rate3: (document.getElementById("rate-i-3")as HTMLInputElement).value,
				rate4: (document.getElementById("rate-i-4")as HTMLInputElement).value,
				rate5: (document.getElementById("rate-i-5")as HTMLInputElement).value
				};
 
 
    this.inProgress = true; 
    this.client.post('api/v1/rates/' + this.guid, data)
      .then((response: any) => {
        
        (document.getElementById("rate-i-1")as HTMLInputElement).value = "75";
        (document.getElementById("rate-i-2")as HTMLInputElement).value = "75";
        (document.getElementById("rate-i-3")as HTMLInputElement).value = "75";
        (document.getElementById("rate-i-4")as HTMLInputElement).value = "75";   
        (document.getElementById("rate-i-5")as HTMLInputElement).value = "75";

        this.rates.push(response.rate);
        this.ratesScrollEmitter.emit('bottom');
        this.inProgress = false;
      })
      .catch((e) => {
        this.inProgress = false;
        alert(e.message);
      });
  }

  isLoggedIn() {
    if (!this.session.isLoggedIn()) {
      this.modal.setSubtitle("برای ثبت امتیاز باید وارد پروفایل خود شوید ." ).open();
    }
  }


  delete(index: number) {
    this.rates.splice(index, 1);
  }

  edited(index: number, $event) {
    this.rates[index] = $event.rate;
  }


  

}
