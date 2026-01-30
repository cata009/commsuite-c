import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@/app/shared/shared.module';
import { ConversationMessage } from '@/app/core/models';

@Component({
  selector: 'app-todo-message-card',
  standalone: true,
  imports: [CommonModule, SharedModule],
  template: `
    <div
      class="flex items-center gap-3 px-3 py-2 rounded border border-[#007A91] bg-[#E7F8FB] cursor-pointer hover:bg-[#d4f1f6] transition-colors min-w-0"
      style="border-radius: 4px;"
      (click)="onViewInChat.emit(message.id)"
    >
      <!-- Todo Icon -->
      <div class="shrink-0 text-[#262626]">
        <app-icon name="todo" size="14"></app-icon>
      </div>

      <!-- Sender Name -->
      <span
        class="shrink-0 text-[#262626] uppercase font-bold"
        style="font-family: 'UniCredit', sans-serif; font-size: 14px; font-weight: 700; line-height: 16px;"
      >
        {{ message.sender }}
      </span>

      <!-- Message Content - truncated -->
      <!-- Tooltip logic to be added later or via standard title for now -->
      <span
        class="flex-1 truncate text-[#262626]"
        style="font-family: 'UniCredit', sans-serif; font-size: 14px; font-weight: 400; line-height: 16px;"
        [title]="getTextContent(message.content)"
      >
        {{ getTextContent(message.content) }}
      </span>

      <!-- Timestamp -->
      <span
        class="shrink-0 text-[#262626]"
        style="font-family: 'UniCredit', sans-serif; font-size: 14px; font-weight: 400; line-height: 16px;"
      >
        {{ message.timestamp }}
      </span>

      <!-- More Options -->
      <app-dropdown-menu>
         <button trigger
            class="shrink-0 p-1 transition-colors flex items-center justify-center hover:text-[#007a91] text-[#262626]"
            (click)="$event.stopPropagation()"
         >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="3" cy="8" r="1.5" fill="currentColor" />
              <circle cx="8" cy="8" r="1.5" fill="currentColor" />
              <circle cx="13" cy="8" r="1.5" fill="currentColor" />
            </svg>
         </button>

         <div items class="flex flex-col">
            <!-- View in Chat -->
            <button
               class="flex items-center gap-2 px-3 py-3 cursor-pointer outline-none hover:bg-gray-50 text-left w-full"
               (click)="onViewInChat.emit(message.id)"
            >
               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                 <path d="M8 3C4.36364 3 1.25818 5.28 0 8.5C1.25818 11.72 4.36364 14 8 14C11.6364 14 14.7418 11.72 16 8.5C14.7418 5.28 11.6364 3 8 3ZM8 12.1667C5.98182 12.1667 4.36364 10.5233 4.36364 8.5C4.36364 6.47667 5.98182 4.83333 8 4.83333C10.0182 4.83333 11.6364 6.47667 11.6364 8.5C11.6364 10.5233 10.0182 12.1667 8 12.1667ZM8 6.3C6.78545 6.3 5.81818 7.28 5.81818 8.5C5.81818 9.72 6.78545 10.7 8 10.7C9.21455 10.7 10.1818 9.72 10.1818 8.5C10.1818 7.28 9.21455 6.3 8 6.3Z" fill="#262626" />
               </svg>
               <span
                 class="uppercase font-bold text-[#262626]"
                 style="font-family: 'UniCredit', sans-serif; font-size: 14px; font-weight: 700;"
               >
                 View in Chat
               </span>
            </button>

            <!-- Unmark as To-Do -->
            <button
               class="flex items-center gap-2 px-3 py-3 cursor-pointer outline-none hover:bg-gray-50 text-left w-full"
               (click)="onUnmarkTodo.emit(message.id)"
            >
               <div class="text-[#262626]">
                 <app-icon name="todo" size="14"></app-icon>
               </div>
               <span
                 class="uppercase font-bold text-[#262626]"
                 style="font-family: 'UniCredit', sans-serif; font-size: 14px; font-weight: 700;"
               >
                 Unmark as To-Do
               </span>
            </button>
         </div>
      </app-dropdown-menu>
    </div>
  `
})
export class TodoMessageCardComponent {
  @Input() message!: ConversationMessage;
  @Output() onViewInChat = new EventEmitter<string>();
  @Output() onUnmarkTodo = new EventEmitter<string>();

  getTextContent(html: string): string {
    return html.replace(/<[^>]*>/g, '');
  }
}
