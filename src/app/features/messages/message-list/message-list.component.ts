import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, ViewChild, OnInit } from '@angular/core';
import { Message, ConversationData, FilterOptions } from '@/app/core/models';
import { FilterService } from '@/app/core/services/filter.service';
import { highlightText } from '@/app/core/utils/search.utils';
import { conversationsData } from '@/app/core/data/conversations.mock';
import { members as mockMembers } from '@/app/core/data/filter.mock';
import { parseISO, isWithinInterval, startOfDay, endOfDay } from 'date-fns';

@Component({
    selector: 'app-message-list',
    template: `
    <div 
      class="shrink-0 relative h-full flex flex-col transition-all duration-500 ease-[cubic-bezier(0.25,0.8,0.25,1)] overflow-visible"
      [class.w-[390px]]="!isCollapsed"
      [class.w-0]="isCollapsed"
    >
      <!-- Inner Content -->
      <div class="w-[390px] h-full flex flex-col bg-white border-r border-unicredit-gray">
      

      <!-- Search & Filters Header -->
      <app-list-header
          [searchQuery]="searchQuery"
          (searchQueryChange)="searchChange.emit($event)"
          [placeholder]="'Search'"
          [showFilterButton]="true"
          [isFilterOpen]="isFilterOpen"
          [activeFilterCount]="filterService.activeFilterCount"
          (filterToggle)="isFilterOpen = !isFilterOpen"
          (clearFilters)="clearFilters()"
          [folders]="['All Folders', 'Inbox', 'Drafts', 'Deleted Items']"
          [selectedFolder]="selectedFolder"
          (folderChange)="selectFolder($event)"
          [folderUnreadCount]="folderUnreadCount"
          [folderTotalCount]="folderTotalCount"
      ></app-list-header>

      <!-- Content Area -->
      <div *ngIf="isFilterOpen" class="flex-1 h-full overflow-hidden bg-white">
          <app-filter-panel
             [initialFilters]="(filterService.activeFilters$ | async)!"
             (onApply)="applyDetailFilters($event)"
             (onCancel)="isFilterOpen = false"
          ></app-filter-panel>
      </div>
      
      <div *ngIf="!isFilterOpen && isLoading" class="flex-1 overflow-hidden">
        <app-message-list-skeleton></app-message-list-skeleton>
      </div>

      <div *ngIf="!isFilterOpen && !isLoading" class="flex-1 flex flex-col h-full overflow-hidden">
         
          <!-- Selection Header -->
          <div *ngIf="selectedFolder !== 'All Folders'" class="px-3 h-[46px] bg-white border-b border-unicredit-gray-divider flex items-center shrink-0">
               <div class="flex items-center justify-between w-full">
                 <div class="flex items-center gap-2">
                    <app-checkbox [checked]="selectAll" (checkedChange)="handleSelectAll()"></app-checkbox>
                    <span class="text-unicredit-text font-bold text-sm uppercase">
                       {{ selectedItems.size > 0 ? selectedItems.size + ' SELECTED' : 'ALL' }}
                    </span>
                 </div>
                 
                 <div *ngIf="selectedItems.size > 0">
                     <app-dropdown-menu>
                          <button trigger class="flex items-center gap-1 outline-none group uppercase text-unicredit-primary font-bold text-sm">
                              ACTIONS
                              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none" class="transition-transform group-data-[state=open]:-rotate-180"><path fill-rule="evenodd" clip-rule="evenodd" d="M1.5 4.98881C2.10103 4.33706 3.07641 4.33706 3.678 4.98881L6 7.34884L8.322 4.98881C8.92359 4.33706 9.89841 4.33706 10.5 4.98881L6 9.5625L1.5 4.98881Z" fill="currentColor" /></svg>
                          </button>
                           <div items class="flex flex-col min-w-[200px] py-1">
                                <!-- Conditional Actions based on Folder -->
                                <ng-container [ngSwitch]="selectedFolder">
                                    <ng-container *ngSwitchCase="'Deleted Items'">
                                         <button (click)="handleBulkAction('restore')" class="text-left px-4 py-3 hover:bg-unicredit-primary-light text-sm text-unicredit-text font-bold uppercase transition-colors outline-none h-11 flex items-center gap-2">
                                             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                               <path fill-rule="evenodd" clip-rule="evenodd" d="M14.6764 8.0543L12.9485 8.06282C13.0515 9.48135 12.5475 10.883 11.5632 11.9102C9.64429 13.913 6.45648 13.9834 4.45714 12.0672C2.45812 10.1506 2.39287 6.96286 4.31182 4.96004C6.23082 2.95793 9.41826 2.88726 11.4176 4.80347C11.4946 4.877 11.5638 4.9571 11.6362 5.03521L10.4605 5.05603C9.7844 5.05923 9.28536 5.94909 9.30525 6.41623L12.9358 6.39815L14.2536 6.391L14.1942 4.98851L14.0457 1.50317C13.5806 1.50561 12.7578 2.00473 12.7864 2.6848L12.8311 3.78305C12.759 3.70706 12.6911 3.62686 12.6149 3.55398C9.92796 0.97845 5.64366 1.07217 3.0645 3.76446C0.484914 6.45572 0.572221 10.7412 3.25985 13.3166C5.94715 15.8925 10.2314 15.7981 12.8102 13.1062C14.1063 11.7544 14.7777 9.91989 14.6764 8.0543" fill="currentColor"/>
                                             </svg>
                                             Restore Conversation
                                         </button>
                                    </ng-container>

                                   <ng-container *ngSwitchCase="'Drafts'">
                                        <button (click)="handleBulkAction('delete')" class="text-left px-4 py-3 hover:bg-unicredit-primary-light text-sm text-unicredit-text font-bold uppercase transition-colors outline-none flex items-center gap-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                              <path fill-rule="evenodd" clip-rule="evenodd" d="M9.5 1H12.523C13.508 1 14 2 14 2.5V3H2V2.5C2 2 2.492 1 3.477 1H6.5L7 0H9L9.5 1ZM4.84017 16C4.32017 16 3.88667 15.6015 3.84367 15.083L2.92017 4H12.9202L11.9962 15.083C11.9532 15.6015 11.5202 16 11.0002 16H4.84017Z" fill="currentColor"/>
                                            </svg>
                                            Delete
                                        </button>
                                   </ng-container>

                                   <ng-container *ngSwitchDefault>
                                        <button (click)="handleBulkAction('markRead')" *ngIf="hasUnreadInSelection" class="text-left px-4 py-3 hover:text-unicredit-primary text-sm text-unicredit-text font-bold uppercase transition-colors outline-none flex items-center gap-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                              <path d="M16 12.4385C16 13.9296 15.0058 14.9238 13.5146 14.9238H0V8.07422L7.95312 13.542L16 8.07422V12.4385ZM15.2598 7.02051L7.95312 12.04L0.646484 7.02051L7.95312 2L15.2598 7.02051Z" fill="currentColor"/>
                                            </svg>
                                            Mark as read
                                        </button>
                                        <button (click)="handleBulkAction('markUnread')" *ngIf="hasReadInSelection" class="text-left px-4 py-3 hover:text-[#007a91] text-sm text-[#262626] font-bold uppercase transition-colors outline-none flex items-center gap-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                              <path d="M16 12.4385C16 13.9296 15.0058 14.9238 13.5146 14.9238H0V8.07422L7.95312 13.542L16 8.07422V12.4385ZM15.2598 7.02051L7.95312 12.04L0.646484 7.02051L7.95312 2L15.2598 7.02051Z" fill="currentColor"/>
                                            </svg>
                                            Mark as unread
                                        </button>
                                        
                                        <button (click)="handleBulkAction('delete')" class="text-left px-4 py-3 hover:text-[#007a91] text-sm text-[#262626] font-bold uppercase transition-colors outline-none flex items-center gap-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                              <path fill-rule="evenodd" clip-rule="evenodd" d="M9.5 1H12.523C13.508 1 14 2 14 2.5V3H2V2.5C2 2 2.492 1 3.477 1H6.5L7 0H9L9.5 1ZM4.84017 16C4.32017 16 3.88667 15.6015 3.84367 15.083L2.92017 4H12.9202L11.9962 15.083C11.9532 15.6015 11.5202 16 11.0002 16H4.84017Z" fill="currentColor"/>
                                            </svg>
                                            Delete
                                        </button>
                                   </ng-container>
                                </ng-container>
                            </div>
                     </app-dropdown-menu>
                 </div>
               </div>
          </div>

          <!-- Messages Loop -->
          <div class="flex-1 overflow-y-auto message-list-scrollbar">
             <div 
                 *ngFor="let message of filteredMessages"
                 (click)="selectMessage.emit(message.id)"
                 class="px-3 py-3 border-b border-[#ccc] cursor-pointer transition-colors"
                 [ngClass]="{
                     'bg-[#e7f8fb]': selectedMessageId === message.id,
                     'hover:bg-gray-50': selectedMessageId !== message.id
                 }"
             >
                 <div class="flex items-center gap-2">
                     <!-- Checkbox -->
                     <div *ngIf="selectedFolder !== 'All Folders'" (click)="$event.stopPropagation()">
                          <app-checkbox [checked]="selectedItems.has(message.id)" (checkedChange)="handleSelectItem(message.id)"></app-checkbox>
                     </div>

                     <div class="flex-1 min-w-0">
                         <div class="flex items-center justify-between mb-2">
                             <app-company-display
                                 [companies]="message.companies"
                                 [isBold]="message.unreadCount > 0 && !message.isEntered"
                                 maxWidth="max-w-[200px]"
                             ></app-company-display>
                             <span class="text-xs text-[#262626] font-normal shrink-0">{{ message.time }}</span>
                         </div>

                         <div class="flex items-center justify-between mb-2">
                             <span class="text-base truncate" [class.font-bold]="message.unreadCount > 0 && !message.isEntered">
                                 {{ getSenderDisplay(message) }}
                             </span>
                             <div class="flex items-center gap-1">
                                 <app-icon *ngIf="message.isTodo" name="todo" size="14"></app-icon>
                                 <app-icon *ngIf="message.hasAttachment" name="attachment" size="14"></app-icon>
                             </div>
                         </div>

                         <div class="flex items-center justify-between">
                             <span class="text-sm text-[#262626] truncate flex-1" [class.font-bold]="message.unreadCount > 0 && !message.isEntered" [title]="message.subject">
                                 <span [innerHTML]="highlightSubject(message.subject)"></span>
                             </span>
                             <div *ngIf="message.unreadCount > 0" class="ml-2 px-1.5 py-0.5 rounded text-xs font-bold text-white shrink-0" [class.bg-[#666]]="message.isEntered" [class.bg-[#e2001a]]="!message.isEntered">
                                 {{ message.unreadCount }}
                             </div>
                         </div>
                     </div>
                 </div>
             </div>
          </div>
       </div>

       </div>
       
       <!-- Collapse Button -->
      <button
        *ngIf="!isCollapsed"
        (click)="toggleCollapse.emit()"
        class="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-[30px] h-[30px] bg-white shadow-[2px_2px_7px_0_rgba(0,0,0,0.25)] hover:bg-gray-50 active:bg-gray-100 flex items-center justify-center transition-colors z-50"
        style="border-radius: 8px;"
        title="Collapse messages list"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#262626" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </button>

    </div>
  `
})
export class MessageListComponent implements OnChanges, OnInit {
    @Input() messages: Message[] = [];
    @Input() isLoading = false;
    @Input() selectedMessageId: string | null = null;
    @Input() searchQuery = '';
    @Input() isCollapsed = false;

    @Output() selectMessage = new EventEmitter<string>();
    @Output() toggleCollapse = new EventEmitter<void>();
    @Output() searchChange = new EventEmitter<string>();
    @Output() markAsRead = new EventEmitter<string[]>();
    @Output() markAsUnread = new EventEmitter<string[]>();
    @Output() deleteMessages = new EventEmitter<string[]>();
    @Output() restoreMessages = new EventEmitter<string[]>();

    selectedFolder = 'Inbox';
    filteredMessages: Message[] = [];
    isFilterOpen = false;

    selectedItems = new Set<string>();
    selectAll = false;

    constructor(public filterService: FilterService) { }

    ngOnInit() {
        this.filterService.activeFilters$.subscribe(() => {
            this.filterMessages();
        });
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['messages'] || changes['searchQuery'] || changes['selectedFolder']) {
            this.filterMessages();
            // Reset selection when list changes significantly?
            // If just updating messages (e.g. read status), keep selection
            // If changing folder, clear selection
        }
    }

    selectFolder(folder: string) {
        this.selectedFolder = folder;
        this.selectedItems.clear();
        this.selectAll = false;
        this.filterMessages();
    }

    clearFilters(event?: Event) {
        if (event) {
            event.stopPropagation();
        }
        this.filterService.clearFilters();
    }

    applyDetailFilters(filters: FilterOptions) {
        this.filterService.updateFilters(filters);
        this.isFilterOpen = false;
    }

    filterMessages() {
        let result = this.messages;
        const activeFilters = this.filterService.activeFilters;

        // Folder Filter
        if (this.selectedFolder !== 'All Folders') {
            result = result.filter(m => m.folder === this.selectedFolder);
        }

        // Search Filter
        if (this.searchQuery && this.searchQuery.trim()) {
            const query = this.searchQuery.toLowerCase();
            result = result.filter(m => {
                if ((m.sender || '').toLowerCase().includes(query)) return true;
                if ((m.subject || '').toLowerCase().includes(query)) return true;
                const conv = conversationsData[m.id];
                if (conv) {
                    if ((conv.title || '').toLowerCase().includes(query)) return true;
                    if (conv.messages.some((msg: any) => (msg.content || '').toLowerCase().includes(query))) return true;
                }
                return false;
            });
        }

        // Advanced Filters
        if (activeFilters.companies && activeFilters.companies.length > 0) {
            // Check if ANY of the message companies matches selected companies
            result = result.filter(m => m.companies.some(c => activeFilters.companies.includes(c)));
        }

        if (activeFilters.members && activeFilters.members.length > 0) {
            const selectedMemberNames = mockMembers
                .filter(m => activeFilters.members.includes(m.id))
                .map(m => m.name.toLowerCase());

            result = result.filter(m => {
                const conv = conversationsData[m.id];
                if (conv && conv.participantsList) {
                    return conv.participantsList.some(p => selectedMemberNames.some(selected => p.toLowerCase().includes(selected)));
                }
                if (selectedMemberNames.some(selected => m.sender.toLowerCase().includes(selected))) return true;
                return false;
            });
        }

        if (activeFilters.unread) {
            result = result.filter(m => m.unreadCount > 0);
        }
        if (activeFilters.todo) {
            result = result.filter(m => m.isTodo);
        }
        if (activeFilters.attachments) {
            result = result.filter(m => m.hasAttachment);
        }
        if (activeFilters.dateRange.from && activeFilters.dateRange.to) {
            result = result.filter(m => {
                if (!m.timestamp) return true;
                const msgDate = parseISO(m.timestamp);
                return isWithinInterval(msgDate, {
                    start: startOfDay(activeFilters.dateRange.from!),
                    end: endOfDay(activeFilters.dateRange.to!)
                });
            });
        }

        this.filteredMessages = result;
    }


    handleSelectAll() {
        if (this.selectAll) {
            this.selectedItems.clear();
        } else {
            this.filteredMessages.forEach(m => this.selectedItems.add(m.id));
        }
        this.selectAll = !this.selectAll;
    }

    handleSelectItem(id: string) {
        if (this.selectedItems.has(id)) {
            this.selectedItems.delete(id);
        } else {
            this.selectedItems.add(id);
        }
        this.selectAll = this.selectedItems.size === this.filteredMessages.length;
    }

    handleBulkAction(action: string) {
        const ids = Array.from(this.selectedItems);
        if (ids.length === 0) return;

        switch (action) {
            case 'markRead':
                this.markAsRead.emit(ids);
                break;
            case 'markUnread':
                this.markAsUnread.emit(ids);
                break;
            case 'delete':
                this.deleteMessages.emit(ids);
                break;
            case 'restore':
                this.restoreMessages.emit(ids);
                break;
        }

        this.selectedItems.clear();
        this.selectAll = false;
    }

    get hasUnreadInSelection(): boolean {
        return Array.from(this.selectedItems).some(id => {
            const msg = this.messages.find(m => m.id === id);
            return msg && msg.unreadCount > 0 && !msg.isEntered;
        });
    }

    get hasReadInSelection(): boolean {
        return Array.from(this.selectedItems).some(id => {
            const msg = this.messages.find(m => m.id === id);
            return msg && (msg.unreadCount === 0 || msg.isEntered);
        });
    }

    get folderUnreadCount() {
        return this.filteredMessages.filter(m => m.unreadCount > 0 && !m.isEntered).length;
    }

    get folderTotalCount() {
        return this.filteredMessages.length;
    }


    highlightSubject(subject: string): string {
        return highlightText(subject, this.searchQuery);
    }

    getSenderDisplay(message: Message): string {
        const conversation = conversationsData[message.id];
        if (conversation && conversation.participantsList) {
            const participants = conversation.participantsList;
            const otherParticipants = participants.filter(p => !p.toLowerCase().includes('(you)') && p !== 'You');
            otherParticipants.sort((a, b) => a.localeCompare(b));

            if (otherParticipants.length > 0) {
                const primaryName = otherParticipants[0];
                const count = participants.length - 1;
                return count > 0 ? `${primaryName} +${count}` : primaryName;
            }
        }
        return message.sender;
    }
}

