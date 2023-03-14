import { Component, Inject } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";

import { Subscription } from 'rxjs/Rx';

import { Client, Upload } from '../../../services/api';
import { SessionFactory } from '../../../services/session';
import { CONTETNT_CATEGORY, ACCESS } from '../../../services/list-options';

@Component({
  moduleId: module.id,
  selector: 'afs-archive-edit',
  templateUrl: 'edit.html'
})

export class ArchiveEdit {

  minds;
  session = SessionFactory.build();
  guid : string;
  entity : any  = {
    title: "",
    description: "",
    subtype: "",
    category: 12,
    mature: false
  };
  inProgress : boolean;
  error : string;

  categories = CONTETNT_CATEGORY;
  access = ACCESS;

  constructor(public client: Client, public upload: Upload, public router: Router, public route: ActivatedRoute){
  }

  paramsSubscription: Subscription;
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

  load(){
    this.inProgress = true;
    this.client.get('api/v1/entities/entity/' + this.guid, { children: false })
      .then((response : any) => {
        this.inProgress = false;
        console.log(response);
        if(response.entity){
          if (!response.entity.description)
            response.entity.description = "";

          if(!response.entity.category)
            response.entity.category =12;

          response.entity.mature = response.entity.flags && response.entity.flags.mature ? 1 : 0;

          this.entity = response.entity;
        }
      })
      .catch((e) => {

      });
  }

  save(){
    this.client.post('api/v1/archive/' + this.guid, this.entity)
      .then((response : any) => {
        console.log(response);
        this.router.navigate(['/archive/view', this.guid]);
      })
      .catch((e) => {
        this.error ="There was an error while trying to update";
      });
  }

  setThumbnail(file){
    console.log(file);
    this.entity.file = file[0];
    this.entity.thumbnail = file[1];
  }

}
