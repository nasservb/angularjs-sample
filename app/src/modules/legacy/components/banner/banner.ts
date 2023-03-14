import { Component, EventEmitter } from '@angular/core';

import { Client } from '../../../../services/api';

@Component({
  selector: 'afs-banner',
  inputs: ['_object: object', '_src: src', '_top: top', 'overlay', '_editMode: editMode', '_done: done'],
  outputs: ['added'],
  template: `
  <div class="afs-banner" *ngIf="!editing">
    <div class="afs-banner-img mdl-color--blue-grey"
      [ngStyle]="{'background-position': '0 ' + top + 'px', 'background-image': 'url(' + src + ')'}">
    </div>
    <div class="afs-banner-overlay"></div>
  </div>
  <div *ngIf="editing" class="afs-banner afs-banner-editing">
    <img class="mdl-color--blue-grey"
      src="{{src}}"
      [ngStyle]="{'top': top}"
      (dragstart)="dragstart($event)"
      (dragover)="drag($event)"
      (dragend)="dragend($event)"
    />
    <div class="overlay" [hidden]="file">
      <i class="material-icons">camera</i>
      <span>
        <!-- i18n -->برای افزودن یک بنر جدید اینجا را کلیک کنید<br>
        <em>اندازه مناسب بنر: 360&times;1920</em><!-- /i18n -->
      </span>
    </div>
    <div class="afs-banner-overlay"></div>

    <button class="add-button mdl-button mdl-button--raised mdl-button--colored material-icons" (click)="onClick($event)">
      <i class="material-icons">file_upload</i>
    </button>

    <div class="save-bar" [hidden]="!file">
      <div class="mdl-layout-spacer"></div>
      <p i18n>بنر را به طور عمودی بکشید تا موقعیت آن را تغییر دهید</p>
      <span class="afs-button-edit cancel-button" (click)="cancel()">
        <button i18n>انصراف</button>
      </span>
      <span class="afs-button-edit save-button" (click)="done()">
        <button i18n>ذخیره</button>
      </span>
    </div>
    <input type="file" id="file" (change)="add($event)" [hidden]="file" />
  </div>
  `
})

export class MindsBanner {

  minds: Minds = window.Afs;
  object;
  editing: boolean = false;
  src: string = '';
  index: number = 0;

  file: any;
  startY: number = 0;
  offsetY: any = 0;
  top: number = 0;
  dragging: boolean = false;
  dragTimeout;
  added: EventEmitter<any> = new EventEmitter();
  overlay: any; // @todo: ??

  set _object(value: any) {
    if (!value)
      return;
    this.object = value;
    this.src = '/fs/v1/banners/' + this.object.guid + '/' + this.top + '/' + this.object.banner;
  }

  set _src(value: any) {
    this.src = value;
  }

  set _top(value: number) {
    if (!value)
      return;
    this.top = value;
  }

  set _editMode(value: boolean) {
    this.editing = value;
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
  }

  cancel() {
    this.file = null;
  }

  /**
   * An upstream done event, which triggers the export process. Usually called from carousels
   */
  set _done(value: boolean) {
    if (value)
      this.done();
  }

  done() {
    this.added.next({
      index: this.index,
      file: this.file,
      top: this.top
    });
    this.file = null;
    //this.editing = false;
  }

  dragstart(e) {
    this.startY = e.target.style.top ? parseInt(e.target.style.top) : 0;
    this.offsetY = e.clientY;
    this.dragging = true;
    e.dataTransfer.effectAllowed = 'none';
  }

  drag(e) {
    e.preventDefault();
    if (!this.dragging)
      return false;

    var target = e.target;
    var top = this.startY + e.clientY - this.offsetY;
    target.style.top = top + 'px';

    this.top = top;
    return false;
  }

  dragend(e) {
    this.dragging = false;
    console.log('stopped dragging');
  }

  onClick(e) {
    e.target.parentNode.parentNode.getElementsByTagName('input')[0].click();
  }

}
