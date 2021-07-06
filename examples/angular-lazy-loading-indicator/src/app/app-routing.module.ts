import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FeatureOneComponent } from './feature-one/feature-one.component';

const routes: Routes = [
  { path: 'feature-one', component: FeatureOneComponent },
  { path: 'lazy-feature-two', loadChildren: () => import('./lazy-feature-two/lazy-feature-two.module').then(m => m.LazyFeatureTwoModule) },
  { path: 'lazy-feature-three', loadChildren: () => import('./lazy-feature-three/lazy-feature-three.module').then(m => m.LazyFeatureThreeModule) },
  {
    path: '**', redirectTo: '/feature-one'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
