import { Component } from '@angular/core';
import { ButtonDirective } from './button.directive';
import { CardComponent } from './card.component';
import { UppercasePipe } from './uppercase.pipe';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    ButtonDirective,
    CardComponent,
    UppercasePipe,
  ],
  template: `
    <h1 class="m-4 text-3xl">Angular Standalone</h1>
    <app-card>
      <button appButton type="button">{{'Button Directive' | uppercase}}</button>
    </app-card>
  `,
})
export class AppComponent {
  title = 'angular-standalone';
}
