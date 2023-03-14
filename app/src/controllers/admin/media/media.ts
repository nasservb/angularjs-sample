import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs/Rx';
import { Client } from '../../../services/api';

@Component({
  moduleId: module.id,
  selector: 'afs-admin-media',
  templateUrl: 'media.html',
})

export class AdminMedia {


  requests: any[] = [];

  inProgress: boolean = false;
  moreData: boolean = true;
  offset: string = '';
  entities: Array<Object> = [];
  _filter: string = '';
  _owner: string = '';
  _type: string = 'all';
  
  paramsSubscription: Subscription;


  constructor(public client: Client, public route: ActivatedRoute) {
  }

  ngOnInit() {
      this.paramsSubscription = this.route.params.subscribe((params) => {
      if (params['type']) {
        this._type = params['type'];

        switch (this._type) {
          case '':
          case 'all':
			this._type = 'all';   
            break;
          case 'images':
            this._type = 'images';           
            break;
          case 'albums':
            this._type = 'albums';           
            break;
          case 'activities':
            this._type = 'activities';
            break;
          case 'channels':
            this._type = 'channels';
            break;
          case 'videos':
            this._type = 'videos';
            break;
          case 'group':
            this._type = 'group';
            break;

          case 'blog':
            this._type = 'blog';
            break;
          
          case 'service':
            this._type = 'service';
            break;    
          default:
            this._type = 'all';
        }
      }
 
      this.inProgress = false;
      this.entities = [];
      this.load(true);
    });
    this.load();
  }

  load(refresh: boolean = false) {
    if (this.inProgress) {
      return;
    }

    if (refresh)
      this.offset = '';

    this.inProgress = true;

    var filter = this._filter;
    if (this._owner)
      filter = 'owner';

    this.client.get(`api/v1/admin/media`+ '/' + this._type + '/' + this._owner, {
      limit: 24, 
      offset:this.offset ,
      skip: 0 
   })
      .then((response: any) => {
        if (!response.entities) {
          this.inProgress = false;
          this.moreData = false;
          return;
        }

        if (refresh) {
          this.entities = response.entities;
        } else {
          if (this.offset)
            response.entities.shift();
          this.entities = this.entities.concat(response.entities);
        }

		this.inProgress = false;
		
        if (response['load-next']) {
          this.offset = response['load-next'];
        } else {
          this.moreData = false;
        }
      })
      .catch(e => {
        this.inProgress = false;
      });
  }

  

  
}
