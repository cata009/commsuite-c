import { Component, EventEmitter, Input, OnInit, Output, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppIconComponent } from '@/app/shared/components/icons/app-icon.component';

export interface Recipient {
    id: string;
    name: string;
    role: string;
    avatar?: string;
    outOfOffice?: {
        isOoo: boolean;
        returnDate: string;
    };
}

@Component({
    selector: 'app-recipient-picker',
    standalone: true,
    imports: [CommonModule, FormsModule, AppIconComponent],
    template: `
    <div class="relative z-50 animate-fadeIn w-[340px] bg-white shadow-2xl border border-unicredit-gray-divider rounded flex flex-col h-[320px]">
        <!-- Header Search -->
        <div class="p-3 border-b border-unicredit-gray-light">
            <div class="relative">
                <div class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                </div>
                <input 
                    #searchInput
                    [(ngModel)]="searchQuery" 
                    placeholder="Search" 
                    class="w-full pl-9 pr-3 py-2 border border-unicredit-gray-divider rounded text-sm outline-none focus:border-unicredit-primary text-unicredit-text"
                    (input)="onSearch()">
            </div>
        </div>
        
        <!-- List -->
        <div class="flex-1 overflow-y-auto hover-scrollbar">
            <!-- Grouped or Flat List Logic -->
            <ng-container *ngFor="let item of filteredRecipients">
                <div 
                    (click)="toggleSelection(item.id)"
                    class="flex items-center gap-3 px-4 py-3 hover:bg-unicredit-primary-light cursor-pointer border-b border-unicredit-gray-lighter transition-colors">
                    
                    <!-- Checkbox Custom -->
                    <div class="w-5 h-5 border border-unicredit-text bg-white rounded flex items-center justify-center transition-all shrink-0">
                        <svg *ngIf="tempSelectedIds.has(item.id)" width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1 5L4.5 8.5L11 1.5" stroke="#007a91" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                        </svg>
                    </div>
                    
                    <!-- Icon: We can infer icon from recipient data or use generic -->
                    <div class="shrink-0 mt-0.5">
                        <app-icon [name]="getIconName(item)" size="18"></app-icon>
                    </div>
                    
                    <!-- Name + Role -->
                    <div class="text-sm text-unicredit-text leading-tight flex-1">
                        <span class="font-bold mr-1">{{ item.name }}</span>
                        <span *ngIf="item.role" class="text-unicredit-text-secondary font-normal">| {{ item.role }}</span>
                        
                        <!-- OOO Indicator inside list -->
                        <div *ngIf="item.outOfOffice?.isOoo" class="text-xs text-unicredit-error font-medium mt-0.5 flex items-center gap-1">
                             <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                             Return {{ item.outOfOffice!.returnDate }}
                        </div>
                    </div>
                </div>
            </ng-container>

            <div *ngIf="filteredRecipients.length === 0" class="p-4 text-center text-gray-500 text-sm">
                No results found
            </div>
        </div>

        <!-- Footer -->
        <div *ngIf="showFooter" class="p-4 border-t border-unicredit-gray-light flex items-center justify-between bg-white shrink-0">
            <button (click)="onCancel()" class="btn-secondary">CANCEL</button>
            <div class="flex items-center gap-6">
                <span class="font-bold text-sm text-unicredit-text">{{ tempSelectedIds.size }} selected</span>
                <button (click)="onApply()" class="btn-primary">APPLY</button>
            </div>
        </div>
    </div>
    `,
    styles: [`
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-5px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
            animation: fadeIn 0.2s ease-out forwards;
        }
    `]
})
export class RecipientPickerComponent implements OnInit {
    @Input() recipients: Recipient[] = [];
    @Input() initialSelectedIds: string[] = [];
    @Input() showFooter: boolean = true;

    @Output() apply = new EventEmitter<string[]>();
    @Output() cancel = new EventEmitter<void>();

    @ViewChild('searchInput') searchInput!: ElementRef;

    searchQuery: string = '';
    tempSelectedIds = new Set<string>();
    filteredRecipients: Recipient[] = [];

    ngOnInit() {
        this.tempSelectedIds = new Set(this.initialSelectedIds);
        this.filteredRecipients = [...this.recipients];

        // Auto-focus search on open
        setTimeout(() => {
            if (this.searchInput) {
                this.searchInput.nativeElement.focus();
            }
        }, 50);
    }

    onSearch() {
        const query = this.searchQuery.toLowerCase().trim();
        if (!query) {
            this.filteredRecipients = [...this.recipients];
            return;
        }

        this.filteredRecipients = this.recipients.filter(r =>
            r.name.toLowerCase().includes(query) ||
            (r.role && r.role.toLowerCase().includes(query))
        );
    }

    toggleSelection(id: string) {
        if (this.tempSelectedIds.has(id)) {
            this.tempSelectedIds.delete(id);
        } else {
            this.tempSelectedIds.add(id);
        }
    }

    onApply() {
        this.apply.emit(Array.from(this.tempSelectedIds));
    }

    onCancel() {
        this.cancel.emit();
    }

    getIconName(item: Recipient): string {
        // Logic inferred from previous components
        // Can be improved with explicit type on Recipient interface later
        if (item.role && item.role.toLowerCase().includes('banker')) return 'member-bank';
        return 'member-client'; // Default
    }
}
