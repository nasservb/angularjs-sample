import { Component, EventEmitter, Output } from '@angular/core';

import { Client, Upload } from '../../../../../services/api';
import { SessionFactory } from '../../../../../services/session';

import { OverlayModalService } from '../../../../../services/ux/overlay-modal';

import { ReportCreatorComponent } from '../../../../report/creator/creator.component';

@Component({
  moduleId: module.id,
  selector: 'afs-card-rate',
  inputs: ['object', 'parent'],
  outputs: ['_delete: delete', '_saved: saved'],
  host: {
    '(keydown.esc)': 'editing = false'
  },
  templateUrl: 'rate.html'
  
})

export class RateCard {

  rate: any;
  editing: boolean = false;
  minds = window.Afs;
  session = SessionFactory.build();

  canPost: boolean = true;
  triedToPost: boolean = false;
  inProgress: boolean = false;

  _delete: EventEmitter<any> = new EventEmitter();
  _saved: EventEmitter<any> = new EventEmitter();

  reportToggle: boolean = false;
  parent: any;

  constructor(
    public client: Client,
    private overlayModal: OverlayModalService) {
  }

  set object(value: any) {
    if (!value)
      return;
    this.rate = value;

  }

  set _editing(value: boolean) {
    this.editing = value;
  }

  saveEnabled() {
    return !this.inProgress && this.canPost ;
  }

  changeRate() {
	
	 
	(document.getElementById("rate-edit-1")as HTMLInputElement).innerHTML="("+(document.getElementById("rate-e-1")as HTMLInputElement).value+")" ;
	(document.getElementById("rate-edit-2")as HTMLInputElement).innerHTML="("+(document.getElementById("rate-e-2")as HTMLInputElement).value+")" ;
	(document.getElementById("rate-edit-3")as HTMLInputElement).innerHTML="("+(document.getElementById("rate-e-3")as HTMLInputElement).value+")" ;
	(document.getElementById("rate-edit-4")as HTMLInputElement).innerHTML="("+(document.getElementById("rate-e-4")as HTMLInputElement).value+")" ;
	(document.getElementById("rate-edit-5")as HTMLInputElement).innerHTML="("+(document.getElementById("rate-e-5")as HTMLInputElement).value+")" ;
	   
  }
  
  save() {    
	 
	
    let data ={ rate1: (document.getElementById("rate-e-1")as HTMLInputElement).value,
				rate2: (document.getElementById("rate-e-2")as HTMLInputElement).value,
				rate3: (document.getElementById("rate-e-3")as HTMLInputElement).value,
				rate4: (document.getElementById("rate-e-4")as HTMLInputElement).value,
				rate5: (document.getElementById("rate-e-5")as HTMLInputElement).value
				};

    this.editing = false;
    this.inProgress = true;
    this.client.post('api/v1/rates/update/' + this.rate.guid, data)
      .then((response: any) => {
        this.inProgress = false;
        if (response.rate) {
          this._saved.next({
            rate: response.rate
          });
        }
        this.rate.edited = true;
      })
      .catch(e => {
        this.inProgress = false;
      });
  }

  applyAndSave(control: any, e) {
    e.preventDefault();

    if (this.inProgress || !this.canPost) {
      this.triedToPost = true;
      return;
    }

    this.rate.rate1 = control.value;
    this.save();
  }
 

  delete() {
    if (!confirm('آیا مایل به حذف این نظر هستید ؟')) {
      return;
    }

    this.client.delete('api/v1/rates/' + this.rate.guid);
    this._delete.next(true);
  }


  
}
