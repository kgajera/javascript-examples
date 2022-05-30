import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: '[appButton]',
  standalone: true,
})
export class ButtonDirective {
  @HostBinding('class')
  elementClass = 'text-base font-medium rounded-lg p-3 bg-sky-500 text-white';
}
