import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FeatureOneComponent } from './feature-one.component';

const routes: Routes = [{ path: '', component: FeatureOneComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FeatureOneRoutingModule { }
