import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FeatureOneRoutingModule } from './feature-one-routing.module';
import { FeatureOneComponent } from './feature-one.component';


@NgModule({
  declarations: [
    FeatureOneComponent
  ],
  imports: [
    CommonModule,
    FeatureOneRoutingModule
  ]
})
export class FeatureOneModule { }
