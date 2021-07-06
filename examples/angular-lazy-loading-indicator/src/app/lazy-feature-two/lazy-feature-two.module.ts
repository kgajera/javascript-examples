import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LazyFeatureTwoRoutingModule } from './lazy-feature-two-routing.module';
import { LazyFeatureTwoComponent } from './lazy-feature-two.component';


@NgModule({
  declarations: [
    LazyFeatureTwoComponent
  ],
  imports: [
    CommonModule,
    LazyFeatureTwoRoutingModule
  ]
})
export class LazyFeatureTwoModule { }
