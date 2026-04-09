import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '@/app/shared/shared.module';
import { CheckboxComponent } from '@/app/shared/components/checkbox/checkbox.component';
import { companies, members } from '@/app/core/data/filter.mock';
import { FilterOptions } from '@/app/core/models';

@Component({
    selector: 'app-switch',
    standalone: true,
    template: `
     <div 
        class="w-[42px] h-[24px] rounded-full relative cursor-pointer transition-colors"
        [class.bg-unicredit-text]="checked"
        [class.bg-unicredit-gray]="!checked"
        (click)="toggle()"
     >
        <div 
            class="absolute top-[2px] w-[20px] h-[20px] bg-white rounded-full transition-all duration-200 shadow-sm"
            [class.left-[2px]]="!checked"
            [class.left-[20px]]="checked"
        ></div>
     </div>
   `
})
export class SwitchComponent {
    @Input() checked = false;
    @Output() checkedChange = new EventEmitter<boolean>();

    toggle() {
        this.checked = !this.checked;
        this.checkedChange.emit(this.checked);
    }
}

@Component({
    selector: 'app-filter-panel',
    standalone: true,
    imports: [CommonModule, FormsModule, SharedModule, CheckboxComponent, SwitchComponent],
    template: `
    <div class="flex flex-col h-full bg-white relative">
      <div class="flex-1 overflow-y-auto px-4 py-2 hover-scrollbar">
         
         <!-- Company and Member Section -->
         <div class="border-b border-unicredit-gray">
            <button 
                class="flex items-center justify-between w-full py-4 rounded group outline-none"
                (click)="toggleSection('company-member')"
            >
                <span class="font-bold text-unicredit-text text-base group-hover:text-unicredit-primary" [class.text-unicredit-primary]="openSection === 'company-member'">
                    Company and member
                </span>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" 
                     class="transition-transform duration-300 group-hover:text-unicredit-primary" 
                     [ngClass]="{'rotate-180 text-unicredit-primary': openSection === 'company-member', 'text-unicredit-text-secondary': openSection !== 'company-member'}"
                     stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                     <path d="m6 9 6 6 6-6"/>
                </svg>
            </button>
            
            <div *ngIf="openSection === 'company-member'" class="pt-2 pb-4 flex flex-col gap-3 animate-slideDown">
                
                <!-- Company Dropdown Trigger -->
                <div class="relative" clickOutside (clickOutside)="isCompanyOpen = false">
                    <div 
                        (click)="isCompanyOpen = !isCompanyOpen"
                        class="flex items-center justify-between px-3 py-2 border rounded bg-white cursor-pointer hover:border-unicredit-primary"
                        [ngClass]="{'border-unicredit-primary': isCompanyOpen, 'border-unicredit-gray-divider': !isCompanyOpen}"
                    >
                        <span class="text-sm truncate" [ngClass]="selectedCompanies.length > 0 ? 'text-unicredit-text' : 'text-unicredit-text-secondary'">
                            {{ selectedCompanies.length > 0 ? selectedCompanies.length + ' companies selected' : 'Select company' }}
                        </span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" class="text-unicredit-text-secondary" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                    </div>

                    <!-- Company Popover -->
                    <div *ngIf="isCompanyOpen" class="absolute top-full left-0 mt-1 w-full bg-white rounded shadow-lg border border-unicredit-gray p-2 z-50">
                        <div class="flex items-center px-2 py-1.5 border border-unicredit-gray-divider rounded mb-2">
                             <app-icon name="search" size="14" class="mr-2 text-unicredit-text-secondary"></app-icon>
                             <input 
                                class="flex-1 text-sm outline-none" 
                                placeholder="Search" 
                                [value]="companySearch" 
                                (input)="updateCompanySearch($event)"
                                (click)="$event.stopPropagation()"
                             >
                        </div>
                        <div class="max-h-[200px] overflow-y-auto flex flex-col hover-scrollbar">
                            <div *ngFor="let company of filteredCompanies" 
                                 (click)="toggleCompany(company)"
                                 class="flex items-center gap-2 px-2 py-2 hover:bg-unicredit-primary-light rounded cursor-pointer"
                            >
                                <div class="pointer-events-none">
                                    <app-checkbox [checked]="isCompanySelected(company)"></app-checkbox>
                                </div>
                                <span class="text-sm text-unicredit-text">{{ company }}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Member Dropdown Trigger -->
                <div class="relative" clickOutside (clickOutside)="isMemberOpen = false">
                    <div 
                        (click)="isMemberOpen = !isMemberOpen"
                        class="flex items-center justify-between px-3 py-2 border rounded bg-white cursor-pointer hover:border-unicredit-primary"
                        [ngClass]="{'border-unicredit-primary': isMemberOpen, 'border-unicredit-gray-divider': !isMemberOpen}"
                    >
                        <span class="text-sm truncate" [ngClass]="selectedMembers.length > 0 ? 'text-unicredit-text' : 'text-unicredit-text-secondary'">
                             {{ selectedMembers.length > 0 ? 'Select member (' + selectedMembers.length + ')' : 'Select member' }}
                        </span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" class="text-unicredit-text-secondary" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                    </div>

                     <!-- Member Popover -->
                    <div *ngIf="isMemberOpen" class="absolute top-full left-0 mt-1 w-full bg-white rounded shadow-lg border border-unicredit-gray p-2 z-50">
                        <div class="flex items-center px-2 py-1.5 border border-unicredit-gray-divider rounded mb-2">
                             <app-icon name="search" size="14" class="mr-2 text-unicredit-text-secondary"></app-icon>
                             <input 
                                class="flex-1 text-sm outline-none" 
                                placeholder="Search" 
                                [value]="memberSearch" 
                                (input)="updateMemberSearch($event)"
                                (click)="$event.stopPropagation()"
                             >
                        </div>
                        <div class="max-h-[200px] overflow-y-auto flex flex-col gap-1 hover-scrollbar">
                             <div *ngFor="let member of filteredMembers" 
                                 (click)="toggleMember(member.id)" 
                                 class="flex items-start gap-2 px-2 py-2 hover:bg-unicredit-primary-light rounded cursor-pointer"
                            >
                                <div class="pointer-events-none mt-0.5">
                                    <app-checkbox [checked]="isMemberSelected(member.id)"></app-checkbox>
                                </div>
                                 <div class="flex flex-col">
                                     <div class="flex items-center gap-1.5 font-bold text-unicredit-text">
                                         <app-icon [name]="member.type === 'banker' ? 'member-bank' : 'member-client'" size="16"></app-icon>
                                         <span class="text-sm">{{ member.name }}</span>
                                     </div>
                                     <span class="text-xs text-unicredit-text-secondary ml-5">
                                         {{ member.type === 'client' ? member.company : (member.company + ' | ' + member.role) }}
                                     </span>
                                 </div>
                             </div>
                             <div *ngIf="filteredMembers.length === 0" class="px-2 py-2 text-sm text-unicredit-text-secondary text-center">
                                No members found
                             </div>
                        </div>
                    </div>
                </div>

            </div>
         </div>

         <!-- Time Period -->
         <div class="border-b border-unicredit-gray">
            <button 
                class="flex items-center justify-between w-full py-4 rounded group outline-none"
                (click)="toggleSection('time-period')"
            >
                <span class="font-bold text-unicredit-text text-base group-hover:text-unicredit-primary" [class.text-unicredit-primary]="openSection === 'time-period'">
                    Time period
                </span>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" 
                     class="transition-transform duration-300 group-hover:text-unicredit-primary" 
                     [ngClass]="{'rotate-180 text-unicredit-primary': openSection === 'time-period', 'text-unicredit-text-secondary': openSection !== 'time-period'}"
                     stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                     <path d="m6 9 6 6 6-6"/>
                </svg>
            </button>
            <div *ngIf="openSection === 'time-period'" class="pt-2 pb-4 flex flex-col gap-2">
                 <div class="flex items-center gap-2">
                    <input type="date" [ngModel]="fromDate" (ngModelChange)="fromDate = $event" class="flex-1 p-2 border border-unicredit-gray-divider rounded text-sm focus:border-unicredit-primary outline-none">
                    <span class="text-unicredit-text-secondary">-</span>
                    <input type="date" [ngModel]="toDate" (ngModelChange)="toDate = $event" class="flex-1 p-2 border border-unicredit-gray-divider rounded text-sm focus:border-unicredit-primary outline-none">
                 </div>
            </div>
         </div>
        
          <!-- Toggles -->
          <div class="flex flex-col mt-2">
             <div class="flex items-center justify-between py-4 border-b border-unicredit-gray">
                  <span class="font-bold text-unicredit-text">Unread</span>
                  <app-switch [checked]="unread" (checkedChange)="unread = $event"></app-switch>
             </div>
             <div class="flex items-center justify-between py-4 border-b border-unicredit-gray">
                  <span class="font-bold text-unicredit-text">To-do</span>
                  <app-switch [checked]="todo" (checkedChange)="todo = $event"></app-switch>
             </div>
             <div class="flex items-center justify-between py-4 border-b border-unicredit-gray">
                  <span class="font-bold text-unicredit-text">Attachments</span>
                  <app-switch [checked]="attachments" (checkedChange)="attachments = $event"></app-switch>
             </div>
         </div>

      </div>

      <!-- Footer -->
      <div class="p-4 border-t border-unicredit-gray flex items-center justify-between bg-white mt-auto">
          <button (click)="onCancel.emit()" class="btn-secondary !px-4 !py-2">
              Cancel
          </button>
          <button (click)="applyFilters()" class="btn-primary !px-4 !py-2">
              Apply
          </button>
      </div>

    </div>
  `,
    styles: [`
    .animate-slideDown {
        animation: slideDown 0.2s ease-out;
    }
    @keyframes slideDown {
        from { opacity: 0; transform: translateY(-5px); }
        to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class FilterPanelComponent implements OnInit {
    @Input() initialFilters!: FilterOptions;
    @Output() onApply = new EventEmitter<FilterOptions>();
    @Output() onCancel = new EventEmitter<void>();

    openSection: string | undefined = undefined;

    // States
    selectedCompanies: string[] = [];
    selectedMembers: string[] = [];

    // Date strings for input[type=date]
    fromDate: string = '';
    toDate: string = '';

    unread = false;
    todo = false;
    attachments = false;

    // Dropdown States
    isCompanyOpen = false;
    isMemberOpen = false;

    companySearch = '';
    memberSearch = '';

    allCompanies = companies;
    allMembers = members;

    ngOnInit() {
        if (this.initialFilters) {
            this.selectedCompanies = [...(this.initialFilters.companies || [])];
            this.selectedMembers = [...(this.initialFilters.members || [])];
            this.unread = this.initialFilters.unread;
            this.todo = this.initialFilters.todo;
            this.attachments = this.initialFilters.attachments;

            if (this.initialFilters.dateRange && this.initialFilters.dateRange.from) {
                this.fromDate = this.initialFilters.dateRange.from.toISOString().split('T')[0];
            }
            if (this.initialFilters.dateRange && this.initialFilters.dateRange.to) {
                this.toDate = this.initialFilters.dateRange.to.toISOString().split('T')[0];
            }
        }
    }

    toggleSection(section: string) {
        if (this.openSection === section) {
            this.openSection = undefined;
        } else {
            this.openSection = section;
        }
    }

    get filteredCompanies() {
        return this.allCompanies.filter(c => c.toLowerCase().includes(this.companySearch.toLowerCase()));
    }

    get filteredMembers() {
        return this.allMembers.filter(m => {
            // Filter by selected companies if any selected
            const matchesCompany = this.selectedCompanies.length === 0 || this.selectedCompanies.includes(m.company);
            // Filter by search query
            const matchesSearch = m.name.toLowerCase().includes(this.memberSearch.toLowerCase());

            return matchesCompany && matchesSearch;
        });
    }

    updateCompanySearch(e: Event) {
        this.companySearch = (e.target as HTMLInputElement).value;
    }

    updateMemberSearch(e: Event) {
        this.memberSearch = (e.target as HTMLInputElement).value;
    }

    // New Multi-select Company Logic
    toggleCompany(company: string) {
        if (this.selectedCompanies.includes(company)) {
            this.selectedCompanies = this.selectedCompanies.filter(c => c !== company);
        } else {
            this.selectedCompanies.push(company);
        }

        // Optional: clear selected members if their company was deselected?
        // For now, let's keep it simple or align members.
        // If dynamic, we should verify members.
        // User request: "continutul selectat de la o companie sau la mai multe sa se reflecte asupra membrilor pe care ii gasesc cand deschid select member"
        // This is handled by `filteredMembers` getter.
        // But what about ALREADY selected members that are now hidden? 
        // We should probably keep them selected unless user manually deselects, OR filter them out.
        // Usually, filtering just hides options. Selection persists.
    }

    isCompanySelected(company: string) {
        return this.selectedCompanies.includes(company);
    }

    toggleMember(id: string) {
        if (this.selectedMembers.includes(id)) {
            this.selectedMembers = this.selectedMembers.filter(m => m !== id);
        } else {
            this.selectedMembers.push(id);
        }
    }

    isMemberSelected(id: string) {
        return this.selectedMembers.includes(id);
    }

    applyFilters() {
        this.onApply.emit({
            companies: this.selectedCompanies,
            members: this.selectedMembers,
            dateRange: {
                from: this.fromDate ? new Date(this.fromDate) : undefined,
                to: this.toDate ? new Date(this.toDate) : undefined
            },
            unread: this.unread,
            todo: this.todo,
            attachments: this.attachments
        });
    }
}
