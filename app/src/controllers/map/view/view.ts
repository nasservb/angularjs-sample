import { Component,ChangeDetectorRef  } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs/Rx';

import { Client } from '../../../services/api';
import { SessionFactory } from '../../../services/session';

import { AttachmentService } from '../../../services/attachment';
import { CONTETNT_CATEGORY } from '../../../services/list-options';
import { ContextService } from '../../../services/context.service';

@Component({
    moduleId: module.id,
    selector: 'm-media-view',
    templateUrl: 'view.html'
})

export class MediaView {

    minds;
    guid: string;
    entity: any = {};
    session = SessionFactory.build();
    inProgress: boolean = true;
    error: string = '';
    deleteToggle: boolean = false;

    theaterMode: boolean = false;

    categories = CONTETNT_CATEGORY;
    selectedCategory:any;

    menuOptions: Array<string> = ['edit', 'mute', 'feature', 'delete', 'report'];

    paramsSubscription: Subscription;

    constructor(
        public client: Client,
        public router: Router,
        public route: ActivatedRoute,
        public attachment: AttachmentService,
        public context: ContextService,
        private cd: ChangeDetectorRef
    ) { }

    ngOnInit() {
        this.minds = window.Afs;
        let node = document.createElement('script');
        node.src = "/js/tinymce.min.js";
        document.getElementsByTagName('head')[0].appendChild(node);

        this.paramsSubscription = this.route.params.subscribe(params => {
            if (params['guid']) {
                this.guid = params['guid'];
                this.load(true);
            }
        });
    }

    ngOnDestroy() {
        this.paramsSubscription.unsubscribe();
    }

    load(refresh: boolean = false) {
        if (refresh) {
            this.entity = {};
            this.detectChanges();
        }
        this.inProgress = true;
        this.client.get('api/v1/media/' + this.guid, { children: false })
            .then((response: any) => {
                this.inProgress = false;
                if (response.entity.type !== 'object') {
                    return;
                }
                if (response.entity)
                {
                    this.entity = response.entity;
                    switch (this.entity.subtype) {
                        case 'video':
                            this.context.set('object:video');
                            break;

                        case 'image':
                            this.context.set('object:image');
                            break;

                        default:
                            this.context.reset();
                    }
                    this.selectedCategory  = this.categories.find(item => item.value == this.entity.category);
                }
                this.detectChanges();
            })
            .catch((e) => {
                this.inProgress = false;
                this.error = 'خطا در خواندن اطلاعات';
            });
    }

    delete() {
        this.client.delete('api/v1/media/' + this.guid)
            .then((response: any) => {
                this.router.navigate(['/discovery/owner']);
            })
            .catch(e => {
                alert((e && e.message) || 'خطا در خواندن سرور');
            });
    }

    getNext() {
        if (this.entity.container_guid === this.entity.owner_guid
            || !this.entity.album_children_guids
            || this.entity.album_children_guids.length <= 1) {
            return;
        }

        let pos = this.entity['album_children_guids'].indexOf(this.entity.guid);
        //bump up if less than 0
        if (pos <= 0)
            pos = 1;
        //bump one up if we are in the same position as ourself
        if (this.entity['album_children_guids'][pos] === this.entity.guid)
            pos++;
        //reset back to 0 if we are are the end
        if (pos >= this.entity['album_children_guids'].length)
            pos = 0;

        return this.entity['album_children_guids'][pos];
    }

    menuOptionSelected(option: string) {
        switch (option) {
            case 'edit':
                this.router.navigate(['/media/edit', this.entity.guid]);
                break;
            case 'delete':
                this.delete();
        }
    }

    private detectChanges() {
        this.cd.markForCheck();
        this.cd.detectChanges();
    }

}