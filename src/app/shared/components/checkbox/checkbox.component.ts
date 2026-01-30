import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-checkbox',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div 
      class="w-5 h-5 border border-[#262626] bg-white rounded flex items-center justify-center cursor-pointer transition-colors"
      (click)="toggle($event)"
    >
      <svg *ngIf="checked" width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1 5L4.5 8.5L11 1.5" stroke="#007A91" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>
  `
})
export class CheckboxComponent {
  @Input() checked: boolean = false;
  @Output() checkedChange = new EventEmitter<boolean>();

  toggle(event: Event) {
    event.stopPropagation();
    this.checked = !this.checked;
    this.checkedChange.emit(this.checked);
  }
}
