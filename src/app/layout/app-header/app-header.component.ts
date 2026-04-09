import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-header',
  template: `
    <div class="bg-unicredit-gray-lighter px-5 py-1 flex items-center justify-between border-b border-unicredit-gray">
      <div class="flex items-center gap-2.5">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M12 16.1513L0 7.90576V19.5H20.0002C22.209 19.5 24 17.709 24 15.5003V7.90651L12 16.1513Z" fill="#666666"/>
          <path fill-rule="evenodd" clip-rule="evenodd" d="M0 4.5V5.904L12 14.1495L24 5.904V4.5H0Z" fill="#e2001a"/>
        </svg>
        <h1 class="text-lg font-bold text-unicredit-text">Communication Suite</h1>
      </div>
      
      <div class="flex items-center gap-2">
        <button class="w-10 h-10 flex items-center justify-center hover:bg-gray-200 rounded transition-colors" (click)="onNewMessage.emit()">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M0 9.25H16V6.75H0V9.25" fill="#262626"/>
          </svg>
        </button>
        <button class="w-10 h-10 flex items-center justify-center hover:bg-gray-200 rounded transition-colors">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
             <path fill-rule="evenodd" clip-rule="evenodd" d="M14.5145 0L8 6.5145L1.485 0L0 1.4855L6.5145 8L0 14.5145L1.485 16L8 9.4855L14.5145 16L16 14.5145L9.4855 8L16 1.4855L14.5145 0Z" fill="#262626"/>
          </svg>
        </button>
      </div>
    </div>
  `
})
export class AppHeaderComponent {
  @Input() title: string = 'Communication Suite';
  @Output() onNewMessage = new EventEmitter<void>();
}
