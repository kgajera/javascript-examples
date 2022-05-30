import { Component } from '@angular/core';

@Component({
  selector: 'app-card',
  standalone: true,
  template: `
    <div class="m-3 p-3 border rounded-lg shadow-lg">
      <h2 class="mb-4 text-2xl">Card Component</h2>
      <ng-content></ng-content>
    </div>
  `
})
export class CardComponent { }
