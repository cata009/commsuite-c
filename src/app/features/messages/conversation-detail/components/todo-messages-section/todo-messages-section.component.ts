import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodoMessageCardComponent } from '../todo-message-card/todo-message-card.component';
import { ConversationMessage } from '@/app/core/models';

@Component({
    selector: 'app-todo-messages-section',
    standalone: true,
    imports: [CommonModule, TodoMessageCardComponent],
    template: `
    <div *ngIf="todoMessages.length > 0" class="flex flex-col gap-2 w-full">
      <!-- Container for the first message and the expand button -->
      <div class="flex items-center gap-2 w-full">
        <div class="flex-1 min-w-0">
          <app-todo-message-card
            [message]="todoMessages[0]"
            (onViewInChat)="onViewInChat.emit($event)"
            (onUnmarkTodo)="onUnmarkTodo.emit($event)"
          ></app-todo-message-card>
        </div>

        <!-- Expand/Collapse Button with Counter - on the right -->
        <button *ngIf="todoMessages.length > 1"
          class="flex items-center gap-1 text-[#007A91] hover:opacity-80 transition-opacity shrink-0 outline-none"
          (click)="isExpanded = !isExpanded"
        >
          <span
            class="font-bold uppercase"
            style="font-family: 'UniCredit', sans-serif; font-size: 14px; font-weight: 700; font-feature-settings: 'liga' off, 'clig' off;"
          >
            {{ todoMessages.length }}
          </span>
          
          <svg *ngIf="isExpanded" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-[#007A91]"><path d="m18 15-6-6-6 6"/></svg>
          <svg *ngIf="!isExpanded" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-[#007A91]"><path d="m6 9 6 6 6-6"/></svg>
        </button>
      </div>

      <!-- Expanded Messages -->
      <div *ngIf="isExpanded && todoMessages.length > 1" class="flex flex-col gap-2 w-full">
         <div *ngFor="let message of todoMessages.slice(1)" class="pr-[36px] w-full">
            <app-todo-message-card
                [message]="message"
                (onViewInChat)="onViewInChat.emit($event)"
                (onUnmarkTodo)="onUnmarkTodo.emit($event)"
            ></app-todo-message-card>
         </div>
      </div>
    </div>
  `
})
export class TodoMessagesSectionComponent {
    @Input() todoMessages: ConversationMessage[] = [];
    @Output() onViewInChat = new EventEmitter<string>();
    @Output() onUnmarkTodo = new EventEmitter<string>();

    isExpanded = false;
}
