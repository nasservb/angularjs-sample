import { ApplicationRef, ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Subscription } from 'rxjs/Rx';

import { Client } from '../../../services/api';
import { SessionFactory } from '../../../services/session';
import { MindsTitle } from '../../../services/ux/title';
/*
import { AnalyticsService } from '../../../services/analytics';
*/

import { MindsServiceResponse,MindsServiceViewResponse } from '../../../interfaces/responses';
import { MindsServiceEntity } from '../../../interfaces/entities';


@Component({
    moduleId: module.id,
    selector: 'm-service-view-infinite',
    templateUrl: 'infinite.html'
})

export class ServiceViewInfinite {

    minds;
    guid: string;
    services: Array<Object> = [];
    session = SessionFactory.build();
    sharetoggle: boolean = false;

    inProgress: boolean = false;
    moreData: boolean = true;

    error: string = '';

    paramsSubscription: Subscription;

    constructor(public client: Client, public route: ActivatedRoute, public router: Router, public title: MindsTitle,
                private applicationRef: ApplicationRef, private cd: ChangeDetectorRef) {
    }

    ngOnInit() {
        this.minds = window.Afs;

        this.paramsSubscription = this.route.params.subscribe(params => {
            let load = false;

            if (params['guid']) {
                this.guid = params['guid'];

                load = true;
            } else if (params['slugid']) {
                const slugParts = params['slugid'].split('-');

                this.guid = slugParts[slugParts.length - 1];

                if (this.guid) {
                    load = true;
                }
            }

            if (load) {
                this.load();
            }
        });
    }

    ngOnDestroy() {
        this.paramsSubscription.unsubscribe();
    }

    ngAfterViewInit() {
        if (this.guid) {
            this.load();
        }
    }

    load(refresh: boolean = false) {
        if (this.inProgress) {
            return false;
        }
        this.inProgress = true;
        /*this.analytics.preventDefault();*/

        this.client.get('api/v1/service/' + this.guid, {})
            .then((response: MindsServiceViewResponse) => {
                this.moreData = false;

                if (response.service) {
                    this.services = [response];
                    this.title.setTitle(response.service.title);

                } else if (this.services.length === 0) {
                    this.error = 'با عرض پوزش ، متااسفانه کسب و کار قابل بارگزاری نیست . ';
                }
                //hack: ios rerun on low memory
                this.cd.markForCheck();
                this.applicationRef.tick();
                this.inProgress = false;
            })
            .catch((e) => {
                if (this.services.length === 0) {
                    this.error = 'با عرض پوزش ، متاسفانه مشکلی در بارگزاری کسب و کار بوجود آمده است .';
                }
                this.inProgress = false;
            });
    }

    loadNextService() {
        if (this.inProgress) {
            return false;
        }
        this.inProgress = true;

        this.client.get('api/v1/service/next/' + this.guid)
            .then((response: any) => {
                if (!response.service) {
                    this.inProgress = false;
                    this.moreData = false;
                    return false;
                }
                this.services.push(response.service);
                this.guid = response.service.guid;
                this.inProgress = false;
            })
            .catch((e) => {
                this.inProgress = false;
            });



    }

}
