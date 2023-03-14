import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {Subscription} from 'rxjs/Rx';

import {MindsTitle} from '../../services/ux/title';
import {Client} from '../../services/api';
import {SessionFactory} from '../../services/session';
import {MindsServiceListResponse} from '../../interfaces/responses';
import {ContextService} from '../../services/context.service';
declare var $:JQueryStatic;

@Component({
    moduleId: module.id,
    selector: 'afs-service',
    templateUrl: 'list.html'
})

export class Service {

    minds;
    categories: { id, label,slag, selected }[];
    offset: string = '';
    moreData: boolean = true;
    inProgress: boolean = false;
    services: Array<any> = [];
    session = SessionFactory.build();
    _filter: string = 'featured';
    navigateion:string = '';


    _category: number = 0;

    _categoryTitle: string = '';

    paramsSubscription: Subscription;

    constructor(public client: Client, public route: ActivatedRoute, public title: MindsTitle, private context: ContextService) {
        this.getCategories();
    }

    ngOnInit() {
        this.title.setTitle('کسب و کارها');
        this.minds = window.Afs;

        this.paramsSubscription = this.route.params.subscribe(params => {
            this._filter = params['filter'];

            let filterTitle = "" ;

            switch (this._filter) {
                case 'trending':
                    filterTitle= 'در حال رشد' ;

                    
                    break;
                case 'featured':
                    filterTitle='برگزیده' ;
                    break;
                case 'owner':
                    filterTitle='کسب من' ;
                    break;
                case 'all':
                default:
                    this._filter = 'all';
                    filterTitle = 'همه دسته ها' ;
            }

            this.navigateion ='<li  class="breadcrumb-item"><a href="'+window.Afs.site_url+
                            'service/'+this._filter+'">'+
                            filterTitle
                            +'</a></li>' ; 

            if (params['category']) {
                let foundLevel2 =false ; 
                for (let cat in window.Afs.categories) {
                   
                    if (params['category'] == window.Afs.categories[cat].slag )
                    {
                        this._category = window.Afs.categories[cat].code;
                        this._categoryTitle = window.Afs.categories[cat].title;

                        
                        let code = window.Afs.categories[cat].code;


                        for (let catIn in window.Afs.categories) {
                            let catCode = window.Afs.categories[catIn].code; 
                            if (Number(catCode) == Math.floor(code/100)*100  )
                            {
                                this.navigateion =this.navigateion   +
                                     '<li  class="breadcrumb-item"><a href="'+window.Afs.site_url+
                                    'service/'+window.Afs.categories[catIn].slag+'">'+
                                    window.Afs.categories[catIn].title
                                    +'</a></li>' ; 

                            }

                            if (window.Afs.categories[cat].parent == window.Afs.categories[catIn].code && foundLevel2 == false )
                            {
                                this.navigateion =this.navigateion  +
                                     '<li  class="breadcrumb-item"><a href="'+window.Afs.site_url+
                                    'service/'+window.Afs.categories[catIn].slag+'">'+
                                    window.Afs.categories[catIn].title
                                    +'</a></li>' ; 
                                    foundLevel2 = true ; 

                            }
                        }

                        this.navigateion =this.navigateion   +
                                ' <li class="breadcrumb-item active" aria-current="page">'+
                                this._categoryTitle +
                                '</li>';
                    }
                }
            }
            else 
            {    
                this._category = 1;
                this._categoryTitle = 'همه دسته ها';
                 
            }
            this.title.setTitle(filterTitle + " | " + this._categoryTitle)

            this.inProgress = false;
            this.offset = '';
            this.moreData = true;
            this.services = [];
            this.load();
        });

        this.context.set('object:service');
    }

     getCategories() {
        this.categories = [];

        for (let id in window.Afs.categories) {
            this.categories.push({
                id: window.Afs.categories[id].code,
                label: window.Afs.categories[id].title,
                slag:window.Afs.categories[id].slag,
                selected: false
            });
        }
        //this.categories.sort((a, b) => a.label > b.label ? 1: -1);
    }
    ngOnDestroy() {
        this.paramsSubscription.unsubscribe();
    }

    load(refresh: boolean = false) {
        if (this.inProgress)
            return false;
        var self = this;
        this.inProgress = true;
        this.client.get('api/v1/service/' + this._filter + '/' + this._category, {limit: 12, offset: this.offset})
            .then((response: MindsServiceListResponse) => {

                if (!response.services) {
                    self.moreData = false;
                    self.inProgress = false;
                    return false;
                }

                if (refresh) {
                    self.services = response.services;
                } else {
                    if (self.offset)
                        response.services.shift();
                    for (let service of response.services)
                        self.services.push(service);
                }

                self.offset = response['load-next'];
                self.inProgress = false;
            })
            .catch((e) => {
                self.inProgress = false;
            });
    }
}

export {ServiceView} from './view/view';
export {ServiceViewInfinite} from './view/infinite';
export {ServiceEdit} from './edit/edit';
