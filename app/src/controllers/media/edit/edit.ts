import { Component, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs/Rx';

import { Client, Upload } from '../../../services/api';
import { SessionFactory } from '../../../services/session';
import { CONTETNT_CATEGORY, ACCESS } from '../../../services/list-options';

@Component({
  moduleId: module.id,
  selector: 'afs-media-edit',
  templateUrl: 'edit.html'
})

export class MediaEdit {

  minds;
  session = SessionFactory.build();
  guid: string;
  entity: any = {
    title: '',
    description: '',
    subtype: '',
    category: 12,
    mature: false
  };
  inProgress: boolean;
  error: string;

  //form: FormGroup;
  selectedCategory: number;

  categories = CONTETNT_CATEGORY;
  access = ACCESS;

  paramsSubscription: Subscription;

  constructor(
    public client: Client,
    public upload: Upload,
    public router: Router,
    public route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.minds = window.Afs;

    this.paramsSubscription = this.route.params.subscribe(params => {
      if (params['guid']) {
        this.guid = params['guid'];
        this.load();
      }
    });
  }

  ngOnDestroy() {
    this.paramsSubscription.unsubscribe();
  }

  load() {
    this.inProgress = true;
    this.client.get('api/v1/entities/entity/' + this.guid, { children: false })
      .then((response: any) => {
        this.inProgress = false;
        console.log(response);
        if (response.entity) {
          if (!response.entity.description)
            response.entity.description = '';

          if (!response.entity.category)
            response.entity.category =12;

          response.entity.mature = response.entity.flags && response.entity.flags.mature ? 1 : 0;
          this.selectedCategory = response.entity.category;
          this.entity = response.entity;
        }
      });
  }

  save() {
    this.entity.category =  this.selectedCategory;
    this.client.post('api/v1/media/' + this.guid, this.entity)
      .then((response: any) => {
        console.log(response);
        this.router.navigate(['/media', this.guid]);
      })
      .catch((e) => {
        this.error = 'خطا در بروزرسانی ';
      });
  }

  setThumbnail(file) {
    console.log(file);
    this.entity.file = file[0];
    this.entity.thumbnail = file[1];
  }

}