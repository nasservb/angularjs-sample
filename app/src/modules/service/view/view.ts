import { Component, ElementRef, HostListener, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { Client } from '../../../services/api';
import { SessionFactory } from '../../../services/session';
import { MindsTitle } from '../../../services/ux/title';
import { ScrollService } from '../../../services/ux/scroll';
/*
import { AnalyticsService } from '../../../services/analytics';
*/
import { MindsServiceEntity,  MindsActivityObject  } from '../../../interfaces/entities';

import { MindsServiceViewResponse } from '../../../interfaces/responses';

import { AttachmentService } from '../../../services/attachment';
import { ContextService } from '../../../services/context.service';
import { optimizedResize } from '../../../utils/optimized-resize';
import { WireService } from '../../wire/wire.service';

@Component({
    moduleId: module.id,
    selector: 'm-service-view',
    inputs: ['_service: service', '_index: index'],
    host: {
        'class': 'm-service'
    },
    templateUrl: 'view.html'
})

export class ServiceView {

    minds;
    guid: string;
    service: MindsServiceEntity;
    session = SessionFactory.build();
    sharetoggle: boolean = false;
    deleteToggle: boolean = false;
    element;

    inProgress: boolean = false;
    moreData: boolean = true;
    activeService: number = 0;

    visible: boolean = false;
    index: number = 0;

    similarServices:Array<MindsServiceEntity> = [];
    hasSimilarServices:boolean=false;


    posts:Array<Object> = [];
    hasPost:boolean=false;


    videos:Array<Object> = [];
    hasVideos:boolean=false;

    images:Array<Object> = [];
    hasImages:boolean=false;


    pictures: Array<Object> = [];

    rateCount:number = 0 ; 

    rate1:number = 0 ; 
    rate2:number = 0 ; 
    rate3:number = 0 ; 
    rate4:number = 0 ; 
    rate5:number = 0 ; 

    scroll_listener;

    menuOptions: Array<string> = ['edit', 'mute', 'feature', 'delete', 'report', 'subscribe'];

    @ViewChild('lockScreen', { read: ElementRef }) lockScreen;


    constructor(
        public client: Client,
        public router: Router,
        _element: ElementRef,
        public scroll: ScrollService,
        public title: MindsTitle,
        public attachment: AttachmentService,
        private context: ContextService,
        /*
            public analytics: AnalyticsService,
        */
        public wireService: WireService
    ) {
        this.minds = window.Afs;
        this.element = _element.nativeElement;
        optimizedResize.add(this.onResize.bind(this));
    }


    ngOnInit() {
        // this.isVisible();

        this.context.set('object:service');
		this.showTab(1);
    }

    isVisible() {
        //listens every 0.6 seconds
        /*
      this.scroll_listener = this.scroll.listen((e) => {
        const bounds = this.element.getBoundingClientRect();
        if (bounds.top < this.scroll.view.clientHeight && bounds.top + bounds.height > this.scroll.view.clientHeight) {
          let url = `${this.minds.site_url}service/view/${this.service.guid}`;

          if (this.service.route) {
            url = `${this.minds.site_url}${this.service.route}`;
          }

          if (!this.visible) {
            window.history.pushState(null, this.service.title, url);
            this.title.setTitle(this.service.title);

          }
          this.visible = true;
        } else {
          this.visible = false;
        }
      }, 0, 300);*/
    }

    set _service(value: MindsServiceViewResponse) {
        this.service = value.service;

        this.title.setTitle(this.service.title);

        this.pictures = value.pictures;

        this.posts = value.posts;

        this.similarServices = value.similarService;

        this.videos = value.videos;

        this.images = value.images;

        this.rateCount = value.rateCount;

        this.rate1 =(value.rate1 == -1 ? 0 : value.rate1)  ; 
        this.rate2 =(value.rate2 == -1 ? 0 : value.rate2)  ; 
        this.rate3 =(value.rate3 == -1 ? 0 : value.rate3)  ; 
        this.rate4 =(value.rate4 == -1 ? 0 : value.rate4)  ; 
        this.rate5 =(value.rate5 == -1 ? 0 : value.rate5)  ; 

        if (value.similarService.length > 0 )
            this.hasSimilarServices=false;

        if (value.posts.length > 0 )
            this.hasPost=false;

        if (value.videos.length > 0 )
            this.hasVideos=false;

        if (value.images.length > 0 )
            this.hasImages=false;


        



        setTimeout(() => {
            this.calculateLockScreenHeight();
        });
    }

    set _index(value: number) {
        this.index = value;
        if (this.index === 0) {
            this.visible = true;
        }
    }

 

    showTab(tabid:number) {
	
        (document.getElementById("tab-1")as HTMLDivElement).style.display  = "none";
        (document.getElementById("tab-2")as HTMLDivElement).style.display  = "none";
        (document.getElementById("tab-3")as HTMLDivElement).style.display  = "none";
 
        (document.getElementById("tab-"+tabid)as HTMLDivElement).style.display  = "block";
		
		document.getElementById("tlink-1").classList.remove("is-active");
		document.getElementById("tlink-2").classList.remove("is-active");
		document.getElementById("tlink-3").classList.remove("is-active");
		
		document.getElementById("tlink-"+tabid).classList.add("is-active");
		
		

    }
 
    delete() {
        this.client.delete('api/v1/service/' + this.service.guid)
            .then((response: any) => {
                this.router.navigate(['/service/owner']);
            });
    }

    ngOnDestroy() {
        if (this.scroll_listener)
            this.scroll.unListen(this.scroll_listener);
    }

    menuOptionSelected(option: string) {
        switch (option) {
            case 'edit':
                this.router.navigate(['/service/edit', this.service.guid]);
                break;
            case 'delete':
                this.delete();
                break;
        }
    }

    setExplicit(value: boolean) {
        this.service.mature = value;

        this.client.post(`api/v1/entities/explicit/${this.service.guid}`, { value: value ? '1' : '0' })
            .catch(e => {
                this.service.mature = this.service.mature;
            });
    }

    calculateLockScreenHeight() {
        if (!this.lockScreen)
            return;
        const lockScreenOverlay = this.lockScreen.nativeElement.querySelector('.m-wire--lock-screen');
        if (lockScreenOverlay) {
            const rect = lockScreenOverlay.getBoundingClientRect();

            lockScreenOverlay.style.height = `calc(100vh - ${rect.top}px)`;
        }
    }

    /**
     * called when the window resizes
     * @param {Event} event
     */
    onResize(event: Event) {
        this.calculateLockScreenHeight();
    }
}
