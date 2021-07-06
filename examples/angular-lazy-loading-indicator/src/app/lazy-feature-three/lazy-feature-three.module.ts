import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LazyFeatureThreeRoutingModule } from './lazy-feature-three-routing.module';
import { LazyFeatureThreeComponent } from './lazy-feature-three.component';


@NgModule({
  declarations: [
    LazyFeatureThreeComponent
  ],
  imports: [
    CommonModule,
    LazyFeatureThreeRoutingModule
  ]
})
export class LazyFeatureThreeModule { }
