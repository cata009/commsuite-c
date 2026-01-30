import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, ViewChild, OnInit } from '@angular/core';
import { Message, ConversationData, FilterOptions } from '@/app/core/models';
import { FilterService } from '@/app/core/services/filter.service';
import { highlightText } from '@/app/core/utils/search.utils';
import { conversationsData } from '@/app/core/mock/conversations.data';
import { members as mockMembers } from '@/app/core/mock/filter.data';
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
      <div class="w-[390px] h-full flex flex-col bg-white border-r border-[#e6e6e6]">
      

      <!-- Search & Filters Header -->
      <div class="p-3 border-b border-[#e6e6e6]">
        <div class="flex gap-3 items-center mb-3">
          <!-- Search Input -->
          <div class="flex-1 relative">
            <div class="absolute left-3 top-1/2 -translate-y-1/2 text-[#262626]">
              <app-icon name="search" size="18"></app-icon>
            </div>
            <input
              type="text"
              placeholder="Search"
              [ngModel]="searchQuery"
              (ngModelChange)="searchChange.emit($event)"
              class="w-full pl-10 pr-9 py-1.5 text-sm border border-[#ccc] rounded bg-white focus:outline-none focus:border-[#007a91]"
            />
            <button
                *ngIf="searchQuery"
                (click)="searchChange.emit('')"
                class="absolute right-3 top-1/2 -translate-y-1/2 hover:opacity-80 transition-opacity text-[#262626]"
            >
                <app-icon name="search-close" size="14"></app-icon>
            </button>
          </div>

          <!-- Filter Button Area -->
          <div class="flex items-center gap-2">
              <button 
                  (click)="isFilterOpen = !isFilterOpen"
                  class="flex items-center justify-center p-2 rounded transition-colors outline-none border-0 bg-transparent hover:bg-transparent shadow-none focus:ring-0"
                  [class.text-[#007a91]]="isFilterOpen || filterService.activeFilterCount > 0"
                  [class.text-[#262626]]="!isFilterOpen && filterService.activeFilterCount === 0"
              >
                <app-icon name="filter" size="18"></app-icon>
              </button>
              
              <!-- Filter Badge -->
              <div *ngIf="filterService.activeFilterCount > 0"
                   class="flex h-[24px] px-[8px] justify-center items-center gap-[4px] rounded-[42px] bg-[#007A91] cursor-pointer hover:bg-[#006577] transition-colors"
                   (click)="clearFilters($event)"
                   title="Clear filters"
              >
                  <span class="text-white text-center text-[16px] font-[700] uppercase" style="font-family: 'UniCredit'; line-height: normal;">{{ filterService.activeFilterCount }}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path fill-rule="evenodd" clip-rule="evenodd" d="M11.6314 1.3125L7 5.9439L2.36824 1.3125L1.3125 2.3686L5.9439 7L1.3125 11.6314L2.36824 12.6875L7 8.0561L11.6314 12.6875L12.6875 11.6314L8.0561 7L12.6875 2.3686L11.6314 1.3125Z" fill="white"/>
                  </svg>
              </div>
          </div>
        </div>

        <!-- Folder Selection -->
        <div class="relative flex items-center justify-between pb-1" [ngClass]="isFolderDropdownOpen ? '' : 'border-b border-[#ccc]'" clickOutside (clickOutside)="isFolderDropdownOpen = false">
          <div class="flex items-center gap-2 cursor-pointer group outline-none" (click)="isFolderDropdownOpen = !isFolderDropdownOpen">
              <span class="text-xl font-bold text-[#262626] group-hover:text-[#007a91] transition-colors" [class.text-[#007a91]]="isFolderDropdownOpen">
                  {{ selectedFolder }}
              </span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" class="transition-transform duration-200" [class.rotate-180]="isFolderDropdownOpen" [attr.stroke]="(isFolderDropdownOpen ? '#007a91' : '#262626')">
                  <path d="M6 9l6 6 6-6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
          </div>

          <div class="text-sm">
            <span class="font-bold">{{ folderUnreadCount }}</span>
            <span class="text-[#666]">/{{ folderTotalCount }} unread</span>
          </div>

          <!-- Folder Dropdown Content -->
          <div *ngIf="isFolderDropdownOpen" class="absolute top-full left-0 right-0 mt-1 bg-white rounded-[4px] shadow-lg border border-[#262626] z-50 flex flex-col">
              <div class="flex flex-col py-2">
                  <div 
                      *ngFor="let folder of ['All Folders', 'Inbox', 'Drafts', 'Deleted Items']" 
                      (click)="tempSelectedFolder = folder"
                      class="flex items-center px-4 py-3 cursor-pointer hover:bg-gray-50 self-stretch gap-2 transition-colors"
                  >
                      <div class="flex items-start justify-center w-6 h-6 shrink-0">
                          <svg *ngIf="tempSelectedFolder !== folder" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10.5" fill="white" stroke="#262626" /></svg>
                          <svg *ngIf="tempSelectedFolder === folder" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10.5" fill="white" stroke="#262626" /><circle cx="12" cy="12" r="6" fill="#007a91" /></svg>
                      </div>
                      <span class="text-[#262626] font-bold text-base capitalize">{{ folder }}</span>
                  </div>
              </div>
              
              <!-- Buttons -->
              <div class="flex items-center justify-between w-full px-4 pb-4 pt-2">
                  <button (click)="isFolderDropdownOpen = false" class="px-6 py-2 border border-[#262626] rounded bg-white hover:bg-gray-50 text-[#262626] font-bold uppercase transition-colors outline-none cursor-pointer" style="font-family: 'UniCredit', sans-serif; font-size: 14px;">Cancel</button>
                  <button (click)="selectFolder(tempSelectedFolder); isFolderDropdownOpen = false" class="px-6 py-2 bg-[#007a91] text-white rounded font-bold uppercase hover:bg-[#006577] transition-colors outline-none cursor-pointer" style="font-family: 'UniCredit', sans-serif; font-size: 14px;">Apply</button>
              </div>
          </div>
        </div>
      </div>

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
          <div *ngIf="selectedFolder !== 'All Folders'" class="px-3 h-[46px] bg-white border-b border-[#ccc] flex items-center shrink-0">
               <div class="flex items-center justify-between w-full">
                 <div class="flex items-center gap-2">
                    <app-checkbox [checked]="selectAll" (checkedChange)="handleSelectAll()"></app-checkbox>
                    <span style="
                        color: #262626;
                        font-family: 'UniCredit', sans-serif;
                        font-size: 14px;
                        font-style: normal;
                        font-weight: 700;
                        line-height: normal;
                        text-transform: uppercase;
                        font-feature-settings: 'liga' off, 'clig' off;
                    ">
                       {{ selectedItems.size > 0 ? selectedItems.size + ' SELECTED' : 'ALL' }}
                    </span>
                 </div>
                 
                 <div *ngIf="selectedItems.size > 0">
                     <app-dropdown-menu>
                          <button trigger class="flex items-center gap-1 outline-none group uppercase text-[#007a91] font-bold text-sm">
                              ACTIONS
                              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none" class="transition-transform group-data-[state=open]:-rotate-180"><path fill-rule="evenodd" clip-rule="evenodd" d="M1.5 4.98881C2.10103 4.33706 3.07641 4.33706 3.678 4.98881L6 7.34884L8.322 4.98881C8.92359 4.33706 9.89841 4.33706 10.5 4.98881L6 9.5625L1.5 4.98881Z" fill="#007A91" /></svg>
                          </button>
                           <div items class="flex flex-col min-w-[200px] py-1">
                                <!-- Conditional Actions based on Folder -->
                                <ng-container [ngSwitch]="selectedFolder">
                                    <ng-container *ngSwitchCase="'Deleted Items'">
                                         <button (click)="handleBulkAction('restore')" class="text-left px-4 py-3 hover:bg-[#e7f8fb] text-sm text-[#262626] font-bold uppercase transition-colors outline-none h-11 flex items-center gap-2">
                                             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                               <path fill-rule="evenodd" clip-rule="evenodd" d="M14.6764 8.0543L12.9485 8.06282C13.0515 9.48135 12.5475 10.883 11.5632 11.9102C9.64429 13.913 6.45648 13.9834 4.45714 12.0672C2.45812 10.1506 2.39287 6.96286 4.31182 4.96004C6.23082 2.95793 9.41826 2.88726 11.4176 4.80347C11.4946 4.877 11.5638 4.9571 11.6362 5.03521L10.4605 5.05603C9.7844 5.05923 9.28536 5.94909 9.30525 6.41623L12.9358 6.39815L14.2536 6.391L14.1942 4.98851L14.0457 1.50317C13.5806 1.50561 12.7578 2.00473 12.7864 2.6848L12.8311 3.78305C12.759 3.70706 12.6911 3.62686 12.6149 3.55398C9.92796 0.97845 5.64366 1.07217 3.0645 3.76446C0.484914 6.45572 0.572221 10.7412 3.25985 13.3166C5.94715 15.8925 10.2314 15.7981 12.8102 13.1062C14.1063 11.7544 14.7777 9.91989 14.6764 8.0543" fill="currentColor"/>
                                             </svg>
                                             Restore Conversation
                                         </button>
                                    </ng-container>

                                   <ng-container *ngSwitchCase="'Drafts'">
                                        <button (click)="handleBulkAction('delete')" class="text-left px-4 py-3 hover:bg-[#e7f8fb] text-sm text-[#262626] font-bold uppercase transition-colors outline-none flex items-center gap-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                              <path fill-rule="evenodd" clip-rule="evenodd" d="M9.5 1H12.523C13.508 1 14 2 14 2.5V3H2V2.5C2 2 2.492 1 3.477 1H6.5L7 0H9L9.5 1ZM4.84017 16C4.32017 16 3.88667 15.6015 3.84367 15.083L2.92017 4H12.9202L11.9962 15.083C11.9532 15.6015 11.5202 16 11.0002 16H4.84017Z" fill="currentColor"/>
                                            </svg>
                                            Delete
                                        </button>
                                   </ng-container>

                                   <ng-container *ngSwitchDefault>
                                        <button (click)="handleBulkAction('markRead')" *ngIf="hasUnreadInSelection" class="text-left px-4 py-3 hover:text-[#007a91] text-sm text-[#262626] font-bold uppercase transition-colors outline-none flex items-center gap-2">
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
    tempSelectedFolder = 'Inbox';
    filteredMessages: Message[] = [];
    isFolderDropdownOpen = false;
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

