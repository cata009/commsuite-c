import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessagesService } from '@/app/core/services/messages.service';
import { Message } from '@/app/core/models';

@Component({
    selector: 'app-messages',
    template: `
    <div class="flex-1 flex flex-col h-full bg-white">
      <!-- Header -->
      <div class="flex items-center justify-between border-b border-[#e6e6e6] bg-white min-h-[73px] px-3 py-4 pr-[calc(100%-390px+12px)]">
        <h2 class="text-[26px] font-bold text-[#262626]" style="font-family: 'UniCredit'; line-height: normal; font-feature-settings: 'liga' off, 'clig' off;">Messages</h2>
        <button
          (click)="onNewMessage()"
          class="flex items-center justify-center gap-1.5 px-4 py-1.5 bg-unicredit-primary hover:bg-unicredit-primary-hover text-white rounded transition-colors text-sm font-bold uppercase outline-none cursor-pointer"
          style="font-family: 'UniCredit', sans-serif;"
        >
          <app-icon name="new" size="16" class="flex items-center justify-center"></app-icon>
          <span>NEW</span>
        </button>
      </div>

      <!-- Main Content -->
      <div class="flex-1 relative z-0">
        <div class="absolute inset-0 flex overflow-hidden">
            
            <!-- Message List -->
            <app-message-list
                [messages]="messages"
                [isLoading]="isLoading"
                [selectedMessageId]="selectedMessageId"
                [searchQuery]="searchQuery"
                [isCollapsed]="isMessageListCollapsed"
                (selectMessage)="onSelectMessage($event)"
                (toggleCollapse)="isMessageListCollapsed = !isMessageListCollapsed"
                (searchChange)="searchQuery = $event"
                (markAsRead)="onMarkAsRead($event)"
                (markAsUnread)="onMarkAsUnread($event)"
                (deleteMessages)="onDeleteBulk($event)"
                (restoreMessages)="onRestoreBulk($event)"
            ></app-message-list>

            <!-- Conversation Detail -->
            <app-conversation-detail
                *ngIf="!isForwardMode"
                class="flex-1 min-w-0 relative z-20 bg-white"
                [messageId]="selectedMessageId"
                [searchQuery]="searchQuery"
                (todoStatusChange)="onTodoStatusChange($event)"
                (wasReadUntilEnd)="onReadUntilEnd($event)"
                (markUnread)="onMarkAsUnread([$event])"
                (deleteConversation)="onDeleteConversation($event)"
                (restoreConversation)="onRestoreBulk([$event])"
                [folder]="getSelectedMessageFolder()"
            ></app-conversation-detail>

            <!-- Forward Conversation -->
            <app-forward-conversation
                *ngIf="isForwardMode"
                class="flex-1 min-w-0 relative z-20 bg-white"
                [messageId]="selectedMessageId"
            ></app-forward-conversation>

            <!-- Vertical Divider -->
            <div *ngIf="isMessageListCollapsed" class="absolute left-0 top-0 bottom-0 w-px bg-[#e6e6e6] z-0 pointer-events-none"></div>
        </div>

        <!-- Expand Button -->
        <button
          *ngIf="isMessageListCollapsed"
          (click)="isMessageListCollapsed = false"
          class="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-[30px] h-[30px] bg-[#007a91] shadow-[2px_2px_7px_0_rgba(0,0,0,0.25)] hover:bg-[#006577] flex items-center justify-center transition-colors z-[100]"
          style="border-radius: 8px;"
          title="Expand messages list"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>
    </div>
  `
})
export class MessagesComponent implements OnInit {
    messages: Message[] = [];
    isLoading = true;
    searchQuery = '';
    selectedMessageId: string | null = null;
    isMessageListCollapsed = false;
    isForwardMode = false;

    constructor(
        private messagesService: MessagesService,
        private route: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit() {
        this.messagesService.getAllMessages().subscribe({
            next: (data) => {
                this.messages = data;
                this.isLoading = false;
            },
            error: (err) => {
                console.error(err);
                this.isLoading = false;
            }
        });

        this.route.data.subscribe(data => {
            this.isForwardMode = data['mode'] === 'forward';
        });

        this.route.paramMap.subscribe(params => {
            const id = params.get('id');
            if (id) {
                this.selectedMessageId = id;
                this.messagesService.setLastSelectedMessageId(id);

                if (!this.isForwardMode) {
                    // Mark as entered locally
                    const msg = this.messages.find(m => m.id === id);
                    if (msg) {
                        msg.isEntered = true;
                        this.messagesService.updateMessageEntered([id], true);
                    }
                    this.markAsRead([id]);
                }
            } else if (!this.isForwardMode) {
                const lastId = this.messagesService.getLastSelectedMessageId();
                if (lastId) {
                    this.router.navigate(['/messages', lastId], { replaceUrl: true });
                }
            }
        });
    }

    onSelectMessage(id: string) {
        this.selectedMessageId = id;
        this.messagesService.setLastSelectedMessageId(id);

        // Mark as entered locally
        const msg = this.messages.find(m => m.id === id);
        if (msg) {
            msg.isEntered = true;
            this.messagesService.updateMessageEntered([id], true);
        }

        this.router.navigate(['/messages', id]);
    }

    onNewMessage() {
        this.router.navigate(['/messages/new']);
    }

    onMarkAsRead(ids: string[]) {
        this.messagesService.updateMessageUnreadStatus(ids, 0, true);
        this.messages = this.messages.map(m =>
            ids.includes(m.id) ? { ...m, unreadCount: 0, isEntered: true } : m
        );
    }

    onMarkAsUnread(ids: string[]) {
        this.messagesService.updateMessageUnreadStatus(ids, 1, false);
        this.messages = this.messages.map(m =>
            ids.includes(m.id) ? { ...m, unreadCount: 1, isEntered: false } : m
        );
    }

    onTodoStatusChange(event: { id: string, hasTodo: boolean }) {
        this.messages = this.messages.map(m =>
            m.id === event.id ? { ...m, isTodo: event.hasTodo } : m
        );
    }

    onReadUntilEnd(id: string) {
        this.messagesService.updateMessageUnreadStatus([id], 0);
        this.messages = this.messages.map(m =>
            m.id === id ? { ...m, unreadCount: 0 } : m
        );
    }

    onDeleteConversation(id: string) {
        this.onDeleteBulk([id]);
        this.selectedMessageId = null;
        this.messagesService.setLastSelectedMessageId(null);
        this.router.navigate(['/messages']);
    }

    onDeleteBulk(ids: string[]) {
        this.messagesService.updateMessageFolder(ids, 'Deleted Items');
        this.messages = this.messages.map(m =>
            ids.includes(m.id) ? { ...m, folder: 'Deleted Items' } : m
        );
        // If current selection is deleted, clear it
        if (this.selectedMessageId && ids.includes(this.selectedMessageId)) {
            this.selectedMessageId = null;
            this.messagesService.setLastSelectedMessageId(null);
            this.router.navigate(['/messages']);
        }
    }

    onRestoreBulk(ids: string[]) {
        this.messagesService.updateMessageFolder(ids, 'Inbox');
        this.messages = this.messages.map(m =>
            ids.includes(m.id) ? { ...m, folder: 'Inbox' } : m
        );
        // If current selection is restored, it might disappear from current view, so clear it
        if (this.selectedMessageId && ids.includes(this.selectedMessageId)) {
            this.selectedMessageId = null;
            this.messagesService.setLastSelectedMessageId(null);
            this.router.navigate(['/messages']);
        }
    }

    getSelectedMessageFolder(): string | undefined {
        return this.messages.find(m => m.id === this.selectedMessageId)?.folder;
    }

    private markAsRead(ids: string[]) {
        this.messagesService.updateMessageEntered(ids, true);
        this.messages = this.messages.map(m =>
            ids.includes(m.id) ? { ...m, isEntered: true } : m
        );
    }
}
