import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LazyFeatureThreeComponent } from './lazy-feature-three.component';

const routes: Routes = [{ path: '', component: LazyFeatureThreeComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LazyFeatureThreeRoutingModule { }
