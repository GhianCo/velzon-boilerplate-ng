import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appIntegerOnly]',
  standalone: true,
})
export class IntegerOnlyDirective {

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    const forbidden = ['.', ',', 'e', 'E', '+', '-'];
    if (forbidden.includes(event.key)) {
      event.preventDefault();
    }
  }

  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const cleaned = input.value.replace(/[^0-9]/g, '');
    if (input.value !== cleaned) {
      input.value = cleaned;
      input.dispatchEvent(new Event('input'));
    }
  }
}
