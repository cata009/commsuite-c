import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppIconComponent } from '@/app/shared/components/icons/app-icon.component';
import { ClickOutsideDirective } from '@/app/shared/directives/click-outside.directive';

@Component({
    selector: 'app-list-header',
    standalone: true,
    imports: [CommonModule, FormsModule, AppIconComponent, ClickOutsideDirective],
    template: `
    <div class="p-3 border-b border-unicredit-gray">
         <div class="flex gap-3 items-center mb-3">
            <!-- Search Input -->
            <div class="flex-1 relative">
                <div class="absolute left-3 top-1/2 -translate-y-1/2 text-unicredit-text">
                   <app-icon name="search" size="18"></app-icon>
                </div>
                <!-- Binding to internal value on input event for smoother UX, emitting on change -->
                <input
                    type="text"
                    [placeholder]="placeholder"
                    [ngModel]="searchQuery"
                    (ngModelChange)="onSearchChange($event)"
                    class="w-full pl-10 pr-9 py-1.5 text-sm border border-unicredit-gray-divider rounded bg-white focus:outline-none focus:border-unicredit-primary"
                />
                <button
                    *ngIf="searchQuery"
                    (click)="onSearchChange('')"
                    class="absolute right-3 top-1/2 -translate-y-1/2 hover:opacity-80 transition-opacity text-unicredit-text"
                >
                    <app-icon name="search-close" size="14"></app-icon>
                </button>
            </div>

            <!-- Filter Button -->
            <div class="flex items-center gap-2" *ngIf="showFilterButton">
                 <button 
                     (click)="toggleFilter()"
                     class="flex items-center justify-center p-2 rounded transition-colors outline-none border-0 bg-transparent hover:bg-transparent shadow-none focus:ring-0"
                     [class.text-unicredit-primary]="isFilterOpen || activeFilterCount > 0"
                     [class.text-unicredit-text]="!isFilterOpen && activeFilterCount === 0"
                 >
                   <app-icon name="filter" size="18"></app-icon>
                 </button>
                 
                 <!-- Active Filter Badge -->
                 <div *ngIf="activeFilterCount > 0"
                      class="flex h-[24px] px-[8px] justify-center items-center gap-[4px] rounded-[42px] bg-unicredit-primary cursor-pointer hover:bg-unicredit-primary-hover transition-colors"
                      (click)="onClearFilters($event)"
                      title="Clear filters"
                 >
                      <span class="text-white text-center text-[16px] font-[700] uppercase" style="font-family: 'UniCredit'; line-height: normal;">{{ activeFilterCount }}</span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <path fill-rule="evenodd" clip-rule="evenodd" d="M11.6314 1.3125L7 5.9439L2.36824 1.3125L1.3125 2.3686L5.9439 7L1.3125 11.6314L2.36824 12.6875L7 8.0561L11.6314 12.6875L12.6875 11.6314L8.0561 7L12.6875 2.3686L11.6314 1.3125Z" fill="white"/>
                      </svg>
                 </div>
             </div>
         </div>

         <!-- Folder Selection Row -->
         <div class="relative flex items-center justify-between pb-1" 
              [ngClass]="isFolderDropdownOpen ? '' : 'border-b border-unicredit-gray-divider'" 
              clickOutside (clickOutside)="isFolderDropdownOpen = false">
            
            <div class="flex items-center gap-2 cursor-pointer group outline-none" (click)="isFolderDropdownOpen = !isFolderDropdownOpen">
                <span class="text-xl font-bold text-unicredit-text group-hover:text-unicredit-primary transition-colors" [class.text-unicredit-primary]="isFolderDropdownOpen">
                    {{ selectedFolder }}
                </span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" class="transition-transform duration-200" [class.rotate-180]="isFolderDropdownOpen" [attr.stroke]="(isFolderDropdownOpen ? '#007a91' : '#262626')">
                    <path d="M6 9l6 6 6-6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </div>

            <!-- Counts -->
            <div class="text-sm" *ngIf="folderUnreadCount !== undefined && folderTotalCount !== undefined">
                <span class="font-bold text-unicredit-text">{{ folderUnreadCount }}</span>
                <span class="text-unicredit-text-secondary">/{{ folderTotalCount }} unread</span>
            </div>

            <!-- Folder Dropdown -->
            <div *ngIf="isFolderDropdownOpen" class="absolute top-full left-0 right-0 mt-1 bg-white rounded-[4px] shadow-lg border border-unicredit-text z-50 flex flex-col animate-fadeIn">
                <div class="flex flex-col py-2">
                    <div 
                        *ngFor="let folder of folders" 
                        (click)="tempSelectedFolder = folder"
                        class="flex items-center px-4 py-3 cursor-pointer hover:bg-gray-50 self-stretch gap-2 transition-colors"
                    >
                        <div class="flex items-start justify-center w-6 h-6 shrink-0">
                            <!-- Radio Logic -->
                            <svg *ngIf="tempSelectedFolder !== folder" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10.5" fill="white" stroke="#262626" /></svg>
                            <svg *ngIf="tempSelectedFolder === folder" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10.5" fill="white" stroke="#262626" /><circle cx="12" cy="12" r="6" fill="#007a91" /></svg>
                        </div>
                        <span class="text-unicredit-text font-bold text-base capitalize">{{ folder }}</span>
                    </div>
                </div>
                
                <!-- Buttons -->
                <div class="flex items-center justify-between w-full px-4 pb-4 pt-2">
                    <button (click)="isFolderDropdownOpen = false" class="btn-secondary">Cancel</button>
                    <button (click)="applyFolderSelection()" class="btn-primary">Apply</button>
                </div>
            </div>
         </div>
    </div>
    `,
    styles: [`
        .animate-fadeIn {
            animation: fadeIn 0.15s ease-out;
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-5px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `]
})
export class ListHeaderComponent {
    @Input() searchQuery = '';
    @Input() placeholder = 'Search';
    @Input() showFilterButton = true;
    @Input() isFilterOpen = false;
    @Input() activeFilterCount = 0;

    @Input() folders: string[] = [];
    @Input() selectedFolder = '';

    @Input() folderUnreadCount?: number;
    @Input() folderTotalCount?: number;

    @Output() searchQueryChange = new EventEmitter<string>();
    @Output() filterToggle = new EventEmitter<void>();
    @Output() clearFilters = new EventEmitter<void>();
    @Output() folderChange = new EventEmitter<string>();

    isFolderDropdownOpen = false;
    tempSelectedFolder = '';

    // Initialize temp folder when dropdown opens
    ngOnChanges() {
        if (!this.isFolderDropdownOpen) {
            this.tempSelectedFolder = this.selectedFolder;
        }
    }

    onSearchChange(value: string) {
        this.searchQuery = value;
        this.searchQueryChange.emit(value);
    }

    toggleFilter() {
        this.filterToggle.emit();
    }

    onClearFilters(event: Event) {
        event.stopPropagation();
        this.clearFilters.emit();
    }

    applyFolderSelection() {
        this.folderChange.emit(this.tempSelectedFolder);
        this.isFolderDropdownOpen = false;
    }
}
