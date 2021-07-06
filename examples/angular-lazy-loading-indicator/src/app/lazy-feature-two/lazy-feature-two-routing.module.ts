import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LazyFeatureTwoComponent } from './lazy-feature-two.component';

const routes: Routes = [{ path: '', component: LazyFeatureTwoComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LazyFeatureTwoRoutingModule { }
