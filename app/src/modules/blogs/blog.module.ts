import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CommonModule } from '../../common/common.module';
import { ModalsModule } from '../modals/modals.module';
import { AdsModule } from '../ads/ads.module';
import { LegacyModule } from '../legacy/legacy.module';
import { PostMenuModule } from '../../common/components/post-menu/post-menu.module';


import { Blog, BlogEdit, BlogViewInfinite } from './blog';
import { BlogCard } from './card/card';
import { BlogView } from './view/view';
import { WireModule } from '../wire/wire.module';

const routes: Routes = [
  { path: 'blog/view/:guid/:title', component: BlogViewInfinite },
  { path: 'blog/view/:guid', component: BlogViewInfinite },
  { path: 'blog/edit/:guid', component: BlogEdit },
  { path: 'blog/:filter', component: Blog },
  { path: ':username/blog/:slugid', component: BlogViewInfinite },
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
    BlogView,
    BlogCard,
    BlogViewInfinite,
    BlogEdit,
    Blog,
  ],
  exports: [
    BlogView,
    BlogCard,
    BlogViewInfinite,
    BlogEdit,
    Blog,
  ],
  entryComponents: [
    BlogCard
  ]
})
export class BlogModule {
}
