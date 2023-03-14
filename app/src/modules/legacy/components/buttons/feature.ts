import { Component } from '@angular/core';
import { SessionFactory } from '../../../../services/session';
import { Client } from '../../../../services/api';

@Component({
  selector: 'afs-button-feature',
  inputs: ['_object: object'],
  template: `
    <button class="" [ngClass]="{'selected': isFeatured }" (click)="isFeatured ? feature() : (open = true)">
      <i class="material-icons">star</i>
    </button>
    <m-modal [open]="open" (closed)="onModalClose($event)">
      <div class="m-button-feature-modal">
        <select [(ngModel)]="category" class="forFeaturedSelect">
          <option value="not-selected">-- یک دسته بندی را انتخاب نمایید --</option>
          <option *ngFor="let category of categories" [value]="category.code">{{category.title}}</option>
        </select>

        <button class="mdl-button mdl-button--colored forFeaturedButton" (click)="feature()">ویژه</button>
      </div>
    </m-modal>
  `
})

export class FeatureButton {

  object;
  session = SessionFactory.build();
  isFeatured: boolean = false;

  open: boolean = false;
  category: string = 'not-selected';
  categories: Array<any> = [];

  constructor(public client: Client) {
  }

  ngOnInit() {
    this.initCategories();
  }

  initCategories() {
    this.categories = Object.keys(window.Afs.categories).map(function (key) {
      return {
        code: window.Afs.categories[key].code,
        title: window.Afs.categories[key].title
      };
    });
  }

  set _object(value: any) {
    if (!value)
      return;
    this.object = value;
    this.isFeatured = value.featured_id || (value.featured === true);
  }

  feature() {
    var self = this;

    if (this.isFeatured)
      return this.unFeature();

    this.isFeatured = true;

    this.client.put('api/v1/admin/feature/' + this.object.guid + '/' + this.category, {})
      .then((response: any) => {
        this.open = false;
      })
      .catch((e) => {
        this.isFeatured = false;
      });
  }

  unFeature() {
    var self = this;
    this.isFeatured = false;
    this.object.featured = false;
    this.client.delete('api/v1/admin/feature/' + this.object.guid, {})
      .then((response: any) => {
        this.open = false;
      })
      .catch((e) => {
        this.isFeatured = true;
      });
  }

  onModalClose(e) {
    this.open = false;
  }

}
