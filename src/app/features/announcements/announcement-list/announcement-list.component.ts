import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { Announcement, FilterOptions } from '@/app/core/models';
import { FilterService } from '@/app/core/services/filter.service';
import { highlightText } from '@/app/core/utils/search.utils';
import { parseISO, isWithinInterval, startOfDay, endOfDay } from 'date-fns';

@Component({
    selector: 'app-announcement-list',
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
          [folders]="['Inbox', 'Deleted']"
          [selectedFolder]="selectedFolder"
          (folderChange)="selectFolder($event)"
          [folderUnreadCount]="folderUnreadCount"
          [folderTotalCount]="folderTotalCount"
      ></app-list-header>

       <!-- Content -->
       <!-- Filter Panel -->
       <div *ngIf="isFilterOpen" class="flex-1 h-full overflow-hidden bg-white">
           <app-filter-panel
              [initialFilters]="(filterService.activeFilters$ | async)!"
              (onApply)="applyDetailFilters($event)"
              (onCancel)="isFilterOpen = false"
           ></app-filter-panel>
       </div>

       <!-- Content -->
       <div *ngIf="isLoading && !isFilterOpen" class="flex-1 overflow-hidden">
          <app-announcement-list-skeleton></app-announcement-list-skeleton>
       </div>

       <div *ngIf="!isLoading && !isFilterOpen" class="flex-1 flex flex-col h-full overflow-hidden">
           
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
                           <button trigger class="flex items-center gap-1 outline-none group uppercase text-[#007a91] font-bold text-sm">
                               ACTIONS
                               <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none" class="transition-transform group-data-[state=open]:-rotate-180"><path fill-rule="evenodd" clip-rule="evenodd" d="M1.5 4.98881C2.10103 4.33706 3.07641 4.33706 3.678 4.98881L6 7.34884L8.322 4.98881C8.92359 4.33706 9.89841 4.33706 10.5 4.98881L6 9.5625L1.5 4.98881Z" fill="#007A91" /></svg>
                           </button>
                           <div items class="flex flex-col min-w-[200px] py-1">
                                <ng-container [ngSwitch]="selectedFolder">
                                    <!-- Deleted Items -->
                                    <ng-container *ngSwitchCase="'Deleted'">
                                         <button (click)="handleBulkAction('restore')" class="text-left px-4 py-2 hover:bg-[#e7f8fb] text-sm text-[#262626] font-bold uppercase transition-colors outline-none h-11 flex items-center">Restore Announcement</button>
                                    </ng-container>

                                    <!-- Standard (Inbox) -->
                                    <ng-container *ngSwitchDefault>
                                         <button (click)="handleBulkAction('markRead')" class="text-left px-4 py-3 hover:text-[#007a91] text-sm text-[#262626] font-bold uppercase transition-colors outline-none flex items-center gap-2">
                                             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                               <path d="M16 12.4385C16 13.9296 15.0058 14.9238 13.5146 14.9238H0V8.07422L7.95312 13.542L16 8.07422V12.4385ZM15.2598 7.02051L7.95312 12.04L0.646484 7.02051L7.95312 2L15.2598 7.02051Z" fill="currentColor"/>
                                             </svg>
                                             Mark as read
                                         </button>
                                         <button (click)="handleBulkAction('markUnread')" class="text-left px-4 py-3 hover:text-[#007a91] text-sm text-[#262626] font-bold uppercase transition-colors outline-none flex items-center gap-2">
                                             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                               <path d="M16 12.4385C16 13.9296 15.0058 14.9238 13.5146 14.9238H0V8.07422L7.95312 13.542L16 8.07422V12.4385ZM15.2598 7.02051L7.95312 12.04L0.646484 7.02051L7.95312 2L15.2598 7.02051Z" fill="currentColor"/>
                                             </svg>
                                             Mark as unread
                                         </button>
                                         
                                         <div class="h-px bg-[#e6e6e6] my-1"></div>
                                         <button (click)="handleBulkAction('delete')" class="text-left px-4 py-3 hover:text-[#e2001a] text-sm text-[#262626] font-bold uppercase transition-colors outline-none flex items-center gap-2">
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

           <!-- Announcements Loop -->
           <div class="flex-1 overflow-y-auto message-list-scrollbar">
            <div 
              *ngFor="let item of filteredAnnouncements"
              (click)="selectAnnouncement.emit(item.id)"
              class="border-b border-[#ccc] px-3 py-4 cursor-pointer transition-colors"
              [ngClass]="{
                  'bg-[#e7f8fb]': selectedAnnouncementId === item.id,
                  'hover:bg-gray-50': selectedAnnouncementId !== item.id
              }"
            >
               <div class="flex items-center gap-2">
                  <!-- Checkbox -->
                  <div *ngIf="selectedFolder !== 'All Folders'" (click)="$event.stopPropagation()">
                       <app-checkbox [checked]="selectedItems.has(item.id)" (checkedChange)="handleSelectItem(item.id)"></app-checkbox>
                  </div>

                  <!-- Content -->
                 <div class="flex-1 min-w-0">
                    
                    <!-- Row 1: Companies & Date -->
                    <div class="flex items-center justify-between mb-2">
                        <app-company-display
                            [companies]="item.companies"
                            [isBold]="!item.isRead"
                            maxWidth="max-w-[200px]"
                        ></app-company-display>
                        <span class="text-xs text-[#262626] font-normal shrink-0">{{ item.publishedDate.split(' ')[0] }}</span>
                    </div>

                    <!-- Row 2: Title & Icons -->
                    <div class="flex items-center justify-between mb-2">
                        <div class="text-base truncate text-[#262626] pr-2" [class.font-bold]="!item.isRead">
                            <span [innerHTML]="highlight(item.title)"></span>
                        </div>
                        <div class="flex gap-1.5 shrink-0 min-h-[14px]">
                            <app-icon *ngIf="item.hasAttachment" name="attachment" size="14"></app-icon>
                            <app-icon *ngIf="item.hasTodo" name="todo" size="14"></app-icon>
                        </div>
                    </div>

                    <!-- Row 3: Preview & Status -->
                    <div class="flex items-center justify-between">
                        <div class="text-sm text-[#262626] truncate flex-1 pr-2">
                             <span [innerHTML]="highlight(item.preview)"></span>
                        </div>
                        <div 
                             class="px-2 py-0.5 text-xs font-bold text-white rounded"
                             [ngClass]="getStatusBadgeClass(item.status)"
                             style="font-size: 10px; line-height: 14px;"
                        >
                            {{ item.status | uppercase }}
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
        title="Collapse announcements list"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#262626" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </button>

    </div>
  `
})
export class AnnouncementListComponent implements OnChanges, OnInit {
    @Input() announcements: Announcement[] = [];
    @Input() isLoading = false;
    @Input() selectedAnnouncementId: string | null = null;
    @Input() searchQuery = '';
    @Input() isCollapsed = false;

    @Output() selectAnnouncement = new EventEmitter<string>();
    @Output() toggleCollapse = new EventEmitter<void>();
    @Output() searchChange = new EventEmitter<string>();
    @Output() toggleTodo = new EventEmitter<string>();
    @Output() deleteAnnouncement = new EventEmitter<string | string[]>();

    selectedFolder = 'Inbox';
    filteredAnnouncements: Announcement[] = [];
    selectedItems = new Set<string>();
    selectAll = false;

    isFilterOpen = false;

    constructor(public filterService: FilterService) { }

    ngOnInit() {
        this.filterService.activeFilters$.subscribe(() => {
            this.filterAnnouncements();
        });
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['announcements'] || changes['searchQuery'] || changes['selectedFolder']) {
            this.filterAnnouncements();
        }
    }

    selectFolder(folder: string) {
        this.selectedFolder = folder;
        this.filterAnnouncements();
    }

    clearFilters(event?: Event) {
        if (event) event.stopPropagation();
        this.filterService.clearFilters();
    }

    applyDetailFilters(filters: FilterOptions) {
        this.filterService.updateFilters(filters);
        this.isFilterOpen = false;
    }

    filterAnnouncements() {
        let result = this.announcements;
        const activeFilters = this.filterService.activeFilters;

        // Folder Filter
        result = result.filter(a => {
            const folder = (a as any).folder || 'Inbox';
            return folder === this.selectedFolder;
        });

        // Search Filter
        if (this.searchQuery && this.searchQuery.trim()) {
            const query = this.searchQuery.toLowerCase();
            result = result.filter(a => {
                if (a.title.toLowerCase().includes(query)) return true;
                if (a.preview.toLowerCase().includes(query)) return true;
                return false;
            });
        }

        // Advanced Filters
        if (activeFilters.companies.length > 0) {
            result = result.filter(a => a.companies.some(c => activeFilters.companies.includes(c)));
        }
        if (activeFilters.unread) {
            result = result.filter(a => !a.isRead);
        }
        if (activeFilters.todo) {
            result = result.filter(a => a.hasTodo);
        }
        if (activeFilters.attachments) {
            result = result.filter(a => a.hasAttachment);
        }
        if (activeFilters.dateRange.from && activeFilters.dateRange.to) {
            result = result.filter(a => {
                const d = new Date(a.publishedDate);
                if (isNaN(d.getTime())) return true;

                return isWithinInterval(d, {
                    start: startOfDay(activeFilters.dateRange.from!),
                    end: endOfDay(activeFilters.dateRange.to!)
                });
            });
        }

        this.filteredAnnouncements = result;
    }

    get folderUnreadCount() {
        return this.filteredAnnouncements.filter(a => !a.isRead).length;
    }

    get folderTotalCount() {
        return this.filteredAnnouncements.length;
    }

    highlight(text: string): string {
        return highlightText(text, this.searchQuery);
    }

    getStatusBadgeClass(status: string): string {
        switch (status.toLowerCase()) {
            case 'informative': return 'bg-[#007a91]'; // Using app primary as fallback or informative color
            case 'important': return 'bg-[#e2001a]';
            case 'recalled': return 'bg-[#666666]';
            default: return 'bg-[#007a91]';
        }
    }

    handleSelectAll() {
        if (this.selectAll) {
            this.selectedItems.clear();
        } else {
            this.selectedItems = new Set(this.filteredAnnouncements.map(a => a.id));
        }
        this.selectAll = !this.selectAll;
    }

    handleSelectItem(id: string) {
        if (this.selectedItems.has(id)) {
            this.selectedItems.delete(id);
        } else {
            this.selectedItems.add(id);
        }
        this.selectAll = this.selectedItems.size === this.filteredAnnouncements.length;
    }

    handleBulkAction(action: string) {
        const ids = Array.from(this.selectedItems);
        console.log(`Bulk action: ${action}`, ids);
        // Emit events based on action
        if (action === 'delete') {
            this.deleteAnnouncement.emit(ids);
        }
        // Clear selection after action
        this.selectedItems.clear();
        this.selectAll = false;
    }
}

