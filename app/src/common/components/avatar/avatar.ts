import { Component, EventEmitter } from '@angular/core';

import { Client } from '../../../services/api';

@Component({
  selector: 'afs-avatar',
  inputs: ['_object: object', '_src: src', '_editMode: editMode', 'waitForDoneSignal'],
  outputs: ['added'],
  template: `
  <div class="afs-avatar" [style.background-image]="'url(' + src + ')'">
    <img *ngIf="!src" src="/assets/avatars/blue/default-large.jpg" class="mdl-shadow--4dp" />
    <div *ngIf="editing" class="overlay">
      <i class="material-icons">camera</i>
      <span *ngIf="src" i18n>آواتار خود را تغییر دهید</span>
      <span *ngIf="!src" i18n>آواتار خود ار آپلود کنید</span>
    </div>
    <input *ngIf="editing" type="file" #file (change)="add($event)"/>
  </div>
  `
})

export class MindsAvatar {

  minds: Minds = window.Afs;
  object;
  editing: boolean = false;
  waitForDoneSignal: boolean = true;
  src: string = '';
  index: number = 0;

  file: any;
  added: EventEmitter<any> = new EventEmitter();

  set _object(value: any) {
    if (!value)
      return;
    this.object = value;
    this.src = '/fs/v1/avatars/' + this.object.guid + '/large/' + this.object.icontime;
    if (this.object.type === 'user')
      this.src = '/icon/' + this.object.guid + '/large/' + this.object.icontime;
  }

  set _src(value: any) {
    this.src = value;
  }

  set _editMode(value: boolean) {
    this.editing = value;
    if (!this.editing && this.file)
      this.done();
  }

  add(e) {
    if (!this.editing)
      return;

    var element: any = e.target ? e.target : e.srcElement;
    this.file = element ? element.files[0] : null;

    /**
     * Set a live preview
     */
    var reader = new FileReader();
    reader.onloadend = () => {
      this.src = reader.result;
    };
    reader.readAsDataURL(this.file);

    element.value = '';

    console.log(this.waitForDoneSignal);
    if (this.waitForDoneSignal !== true)
      this.done();
  }

  done() {
    console.log('sending done');
    this.added.next(this.file);
    this.file = null;
  }

}
