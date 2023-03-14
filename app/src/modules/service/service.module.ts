import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CommonModule } from '../../common/common.module';
import { ModalsModule } from '../modals/modals.module';
import { AdsModule } from '../ads/ads.module';
import { LegacyModule } from '../legacy/legacy.module';
import { PostMenuModule } from '../../common/components/post-menu/post-menu.module';


import { Service, ServiceEdit, ServiceViewInfinite } from './service';
import { ServiceCard } from './card/card';
import { ServiceView } from './view/view';
import { WireModule } from '../wire/wire.module';



const routes: Routes = [
  { path: 'service/view/:guid/:title', component: ServiceViewInfinite },
  { path: 'service/view/:guid', component: ServiceViewInfinite },
  { path: 'service/edit/:guid', component: ServiceEdit },
  { path: 'service/:filter', component: Service },

  { path: 'service/:filter/:category', component: Service },

  { path: ':username/service/:slugid', component: ServiceViewInfinite },
];

@NgModule({
  imports: [
    NgCommonModule,
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    ModalsModule,
    AdsModule,
    LegacyModule,
    PostMenuModule,
    WireModule
  ],
  declarations: [
    ServiceView,
    ServiceCard,
    ServiceViewInfinite,
    ServiceEdit,
    Service,
  ],
  exports: [
    ServiceView,
    ServiceCard,
    ServiceViewInfinite,
    ServiceEdit,
    Service,
  ],
  entryComponents: [
    ServiceCard
  ]
})
export class ServiceModule {
}
