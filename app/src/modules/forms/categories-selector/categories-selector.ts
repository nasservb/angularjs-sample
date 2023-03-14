import { Component, EventEmitter } from '@angular/core';

import { Client } from '../../../services/api';

@Component({
  moduleId: module.id,
  selector: 'afs-onboarding-categories-selector',
  outputs: ['done'],
  templateUrl: 'categories-selector.html',
})

export class OnboardingCategoriesSelector {

  minds = window.Afs;

  categories: Array<any> = [];

  inProgress: boolean = false;
  done: EventEmitter<any> = new EventEmitter();

  constructor(public client: Client) {

  }

  ngOnInit() {
    this.initCategories();
  }

  initCategories() {
    delete window.Afs.categories.other;
    this.categories = Object.keys(window.Afs.categories).map(function (key) {
      return {
        id: key,
        label: window.Afs.categories[key],
        selected: false
      };
    });
  }

  saveCategories() {
    this.inProgress = true;
    const filteredCategories: any[] = this.categories.filter(category => category.selected).map(category => category.code);
    this.client.post('api/v1/settings', {
      categories: filteredCategories
    })
      .then((response: any) => {
        this.inProgress = false;
        this.done.next(true);
      })
      .catch(() => {
        this.inProgress = false;
      });
  }

}
