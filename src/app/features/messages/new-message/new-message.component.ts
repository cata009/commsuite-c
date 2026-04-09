import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { mockCompanies, mockRecipients, Company, Recipient } from '@/app/core/data/companies.mock';

export interface MessageDraft {
    id: string;
    companyId: string | null;
    recipientIds: string[];
    subject: string;
    body: string;
    updatedAt: Date;
}

@Component({
    selector: 'app-new-message',
    template: `
    <div class="h-full flex flex-col bg-white">
        <!-- Header -->
        <div class="px-6 py-4 border-b border-[#ccc]">
            <h1 class="text-2xl font-bold text-[#262626]">New Message</h1>
        </div>

        <!-- Form Content -->
        <div class="flex-1 overflow-y-auto px-6 py-6">
            <!-- Company Field -->
            <div class="mb-6">
                <label class="block text-sm font-bold text-[#262626] mb-2">
                    Company
                </label>
                
                <!-- Company Chip or Selector -->
                <div *ngIf="!selectedCompany" class="relative">
                    <button
                        (click)="toggleCompanyPicker()"
                        class="w-full max-w-md px-3 py-2 border border-[#ccc] rounded text-left flex items-center justify-between hover:border-[#007a91] transition-colors"
                        [class.border-[#007a91]]="showCompanyPicker"
                    >
                        <span class="text-gray-400">Company</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none" class="transition-transform" [class.-rotate-180]="showCompanyPicker">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M1.5 4.98881C2.10103 4.33706 3.07641 4.33706 3.678 4.98881L6 7.34884L8.322 4.98881C8.92359 4.33706 9.89841 4.33706 10.5 4.98881L6 9.5625L1.5 4.98881Z" fill="#007A91"/>
                        </svg>
                    </button>

                    <!-- Company Dropdown -->
                    <div *ngIf="showCompanyPicker" class="absolute z-50 mt-1 w-full max-w-md bg-white border border-[#ccc] rounded shadow-lg">
                        <div class="p-2">
                            <input
                                type="text"
                                [(ngModel)]="companySearchQuery"
                                (input)="filterCompanies()"
                                placeholder="Search"
                                class="w-full px-3 py-2 border border-[#ccc] rounded text-sm focus:outline-none focus:border-[#007a91]"
                            />
                        </div>
                        <div class="max-h-60 overflow-y-auto">
                            <label
                                *ngFor="let company of filteredCompanies"
                                class="flex items-center px-4 py-2 hover:bg-[#e7f8fb] cursor-pointer"
                            >
                                <input
                                    type="checkbox"
                                    [checked]="draftCompanyId === company.id"
                                    (change)="onCompanySelect(company)"
                                    class="mr-3"
                                />
                                <span class="text-sm text-[#262626]">{{ company.name }}</span>
                            </label>
                        </div>
                        <div class="flex items-center justify-between p-3 border-t border-[#ccc]">
                            <button
                                (click)="cancelCompanySelection()"
                                class="px-4 py-2 text-sm font-bold text-[#262626] hover:bg-gray-100 rounded transition-colors"
                            >
                                CANCEL
                            </button>
                            <span class="text-sm text-gray-600">{{ draftCompanyId ? '1' : '0' }} selected</span>
                            <button
                                (click)="applyCompanySelection()"
                                class="px-4 py-2 text-sm font-bold text-white bg-[#007a91] hover:bg-[#006577] rounded transition-colors"
                            >
                                APPLY
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Selected Company Chip -->
                <div *ngIf="selectedCompany" class="flex items-center gap-2">
                    <span class="inline-flex items-center gap-2 px-3 py-1 bg-[#e7f8fb] text-[#007a91] text-sm font-medium rounded-full">
                        {{ selectedCompany.name }}
                        <button
                            (click)="removeCompany()"
                            class="hover:text-[#d32f2f] transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
                                <path d="M9 3L3 9M3 3L9 9" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                            </svg>
                        </button>
                    </span>
                </div>

                <!-- Mandatory Field Error -->
                <div *ngIf="showCompanyError" class="mt-2 px-4 py-2 bg-[#d32f2f] text-white text-sm font-bold rounded">
                    Mandatory field
                </div>
            </div>

            <!-- Recipients Field -->
            <div class="mb-6">
                <label class="block text-sm font-bold text-[#262626] mb-2">
                    To
                </label>
                
                <!-- Recipients Container -->
                <div class="relative">
                    <div class="min-h-[42px] px-3 py-2 border border-[#ccc] rounded flex flex-wrap gap-2 items-center" 
                         [class.bg-gray-50]="!selectedCompany"
                         (click)="focusRecipientInput()">
                        <!-- Recipient Chips -->
                        <span
                            *ngFor="let recipientId of selectedRecipientIds"
                            class="inline-flex items-center gap-2 px-3 py-1 bg-[#e7f8fb] text-[#007a91] text-sm font-medium rounded-full"
                        >
                            {{ getRecipientName(recipientId) }}
                            <button
                                (click)="removeRecipient(recipientId); $event.stopPropagation()"
                                [disabled]="!selectedCompany"
                                class="hover:text-[#d32f2f] transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
                                    <path d="M9 3L3 9M3 3L9 9" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                                </svg>
                            </button>
                        </span>
                        
                        <!-- Typeahead Input -->
                        <input
                            #recipientInput
                            *ngIf="selectedCompany"
                            type="text"
                            [(ngModel)]="recipientTypeahead"
                            (input)="onRecipientTypeahead()"
                            (focus)="showRecipientSuggestions = true"
                            (blur)="onRecipientBlur()"
                            placeholder="{{ selectedRecipientIds.length === 0 ? 'Type to search recipients...' : '' }}"
                            class="flex-1 min-w-[200px] outline-none text-sm bg-transparent"
                        />
                        
                        <!-- Advanced Picker Button -->
                        <button
                            *ngIf="selectedCompany"
                            (click)="toggleRecipientsPicker(); $event.stopPropagation()"
                            class="text-sm text-[#007a91] hover:text-[#006577] font-medium whitespace-nowrap"
                        >
                            Advanced
                        </button>
                    </div>

                    <!-- Typeahead Suggestions -->
                    <div *ngIf="showRecipientSuggestions && recipientSuggestions.length > 0 && selectedCompany" 
                         class="absolute z-40 mt-1 w-full bg-white border border-[#ccc] rounded shadow-lg max-h-60 overflow-y-auto">
                        <button
                            *ngFor="let recipient of recipientSuggestions"
                            (mousedown)="addRecipientFromTypeahead(recipient)"
                            class="w-full text-left px-4 py-2 hover:bg-[#e7f8fb] transition-colors"
                        >
                            <div class="text-sm font-medium text-[#262626]">{{ recipient.name }}</div>
                            <div class="text-xs text-gray-600">{{ recipient.role }}</div>
                            <div *ngIf="recipient.outOfOffice?.isOoo" class="text-xs text-[#E91E63] font-medium mt-0.5">
                                Out of office: Returning {{ recipient.outOfOffice!.returnDate }}
                            </div>
                        </button>
                    </div>

                    <!-- Advanced Recipients Picker -->
                    <div *ngIf="showRecipientsPicker && selectedCompany" class="absolute z-50 mt-1 w-full bg-white border border-[#ccc] rounded shadow-lg">
                        <div class="p-2">
                            <input
                                type="text"
                                [(ngModel)]="recipientsSearchQuery"
                                (input)="filterRecipients()"
                                placeholder="Search"
                                class="w-full px-3 py-2 border border-[#ccc] rounded text-sm focus:outline-none focus:border-[#007a91]"
                            />
                        </div>
                        <div class="max-h-60 overflow-y-auto">
                            <label
                                *ngFor="let recipient of filteredRecipients"
                                class="flex items-start px-4 py-2 hover:bg-[#e7f8fb] cursor-pointer"
                            >
                                <input
                                    type="checkbox"
                                    [checked]="draftRecipientIds.includes(recipient.id)"
                                    (change)="toggleRecipientSelection(recipient.id)"
                                    class="mr-3 mt-1"
                                />
                                <div class="flex-1">
                                    <div class="text-sm font-medium text-[#262626]">{{ recipient.name }}</div>
                                    <div class="text-xs text-gray-600">{{ recipient.role }}</div>
                                    <div *ngIf="recipient.outOfOffice?.isOoo" class="text-xs text-[#E91E63] font-medium mt-0.5">
                                        Out of office: Returning {{ recipient.outOfOffice!.returnDate }}
                                    </div>
                                </div>
                            </label>
                        </div>
                        <div class="flex items-center justify-between p-3 border-t border-[#ccc]">
                            <button
                                (click)="cancelRecipientsSelection()"
                                class="px-4 py-2 text-sm font-bold text-[#262626] hover:bg-gray-100 rounded transition-colors"
                            >
                                CANCEL
                            </button>
                            <span class="text-sm text-gray-600">{{ draftRecipientIds.length }} selected</span>
                            <button
                                (click)="applyRecipientsSelection()"
                                class="px-4 py-2 text-sm font-bold text-white bg-[#007a91] hover:bg-[#006577] rounded transition-colors"
                            >
                                APPLY
                            </button>
                        </div>
                    </div>
                </div>

                <p class="mt-2 text-sm text-gray-500" *ngIf="!selectedCompany">
                    Choose the company before adding the recipients
                </p>
            </div>

            <!-- Subject Field -->
            <div class="mb-6">
                <input
                    type="text"
                    [(ngModel)]="subject"
                    (input)="markAsDirty()"
                    placeholder="Add a subject"
                    class="w-full px-3 py-2 border border-[#ccc] rounded text-sm focus:outline-none focus:border-[#007a91]"
                />
            </div>

            <!-- Rich Text Editor Area -->
            <div class="mb-6">
                <app-rich-text-editor
                    [content]="body"
                    [showToolbar]="true"
                    [placeholder]="'Type your message'"
                    (contentChange)="onBodyChange($event)"
                    (attachmentClick)="attachFile()">
                </app-rich-text-editor>
            </div>
        </div>

        <!-- Footer -->
        <div class="flex items-center justify-between px-6 py-4 border-t border-[#ccc] bg-white">
            <button
                (click)="onBack()"
                class="px-6 py-2 border border-[#262626] text-[#262626] font-bold rounded hover:bg-gray-100 transition-colors"
            >
                Back
            </button>
            <div class="flex items-center gap-4">
                <button
                    (click)="onSaveDraft()"
                    [disabled]="!isDirty"
                    class="text-sm font-bold transition-colors"
                    [class.text-[#007a91]]="isDirty"
                    [class.hover:text-[#006577]]="isDirty"
                    [class.text-gray-400]="!isDirty"
                    [class.cursor-not-allowed]="!isDirty"
                >
                    SAVE DRAFT
                </button>
                <button
                    (click)="onSend()"
                    class="px-6 py-2 bg-[#007a91] text-white font-bold rounded hover:bg-[#006577] transition-colors"
                >
                    Send
                </button>
            </div>
        </div>

        <!-- Unsaved Changes Modal -->
        <div *ngIf="showUnsavedModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
                <div class="p-6">
                    <div class="flex justify-end mb-4">
                        <button (click)="showUnsavedModal = false" class="text-gray-400 hover:text-gray-600">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M18 6L6 18M6 6l12 12"/>
                            </svg>
                        </button>
                    </div>
                    
                    <div class="flex justify-center mb-6">
                        <div class="w-16 h-16 rounded-full border-4 border-orange-500 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                                <circle cx="16" cy="16" r="14" stroke="#FF6B00" stroke-width="2" fill="none"/>
                                <path d="M16 10v8M16 22v2" stroke="#FF6B00" stroke-width="2.5" stroke-linecap="round"/>
                            </svg>
                        </div>
                    </div>
                    
                    <h2 class="text-xl font-bold text-center text-[#262626] mb-2">
                        You will loose all changes.
                    </h2>
                    <p class="text-center text-gray-600 mb-6">
                        Are you sure you want to leave?
                    </p>
                    
                    <div class="flex gap-3">
                        <button
                            (click)="onDontSave()"
                            class="flex-1 px-4 py-2 border border-[#262626] text-[#262626] font-bold rounded hover:bg-gray-100 transition-colors"
                        >
                            Don't Save
                        </button>
                        <button
                            (click)="onSaveDraftAndLeave()"
                            class="flex-1 px-4 py-2 bg-[#007a91] text-white font-bold rounded hover:bg-[#006577] transition-colors"
                        >
                            Save draft
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Toast Notification -->
        <div *ngIf="showToast" class="fixed top-4 right-4 bg-white border border-[#ccc] rounded shadow-lg px-4 py-3 flex items-center gap-3 z-50 animate-fade-in">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="9" fill="#4CAF50"/>
                <path d="M6 10l2 2 4-4" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span class="text-sm font-medium text-[#262626]">Draft correctly saved.</span>
            <button (click)="showToast = false" class="text-gray-400 hover:text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 4L4 12M4 4l8 8"/>
                </svg>
            </button>
        </div>
    </div>
    `,
    styles: [`
        @keyframes fade-in {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .animate-fade-in {
            animation: fade-in 0.3s ease-out;
        }
    `]
})
export class NewMessageComponent implements OnInit {
    @ViewChild('recipientInput') recipientInputRef!: ElementRef<HTMLInputElement>;

    companies = mockCompanies;
    recipients = mockRecipients;

    // Company selection
    selectedCompany: Company | null = null;
    showCompanyPicker = false;
    companySearchQuery = '';
    filteredCompanies: Company[] = [];
    draftCompanyId: string | null = null;
    showCompanyError = false;

    // Recipients selection
    selectedRecipientIds: string[] = [];
    showRecipientsPicker = false;
    recipientsSearchQuery = '';
    filteredRecipients: Recipient[] = [];
    draftRecipientIds: string[] = [];

    // Typeahead
    recipientTypeahead = '';
    recipientSuggestions: Recipient[] = [];
    showRecipientSuggestions = false;

    // Form fields
    subject = '';
    body = '';

    // State
    isDirty = false;
    showUnsavedModal = false;
    showToast = false;

    constructor(private router: Router) { }

    ngOnInit() {
        this.filteredCompanies = [...this.companies];
    }


    // Company methods
    toggleCompanyPicker() {
        this.showCompanyPicker = !this.showCompanyPicker;
        if (this.showCompanyPicker) {
            this.draftCompanyId = this.selectedCompany?.id || null;
            this.companySearchQuery = '';
            this.filterCompanies();
        }
    }

    filterCompanies() {
        const query = this.companySearchQuery.toLowerCase();
        this.filteredCompanies = this.companies.filter(c =>
            c.name.toLowerCase().includes(query)
        );
    }

    onCompanySelect(company: Company) {
        this.draftCompanyId = company.id;
    }

    cancelCompanySelection() {
        this.showCompanyPicker = false;
        this.draftCompanyId = this.selectedCompany?.id || null;
    }

    applyCompanySelection() {
        if (this.draftCompanyId) {
            const company = this.companies.find(c => c.id === this.draftCompanyId);
            if (company) {
                const companyChanged = this.selectedCompany?.id !== company.id;
                this.selectedCompany = company;

                // Clear recipients if company changed
                if (companyChanged) {
                    this.selectedRecipientIds = [];
                }

                this.markAsDirty();
            }
        }
        this.showCompanyPicker = false;
        this.showCompanyError = false;
    }

    removeCompany() {
        this.selectedCompany = null;
        this.selectedRecipientIds = [];
        this.recipientTypeahead = '';
        this.markAsDirty();
    }

    // Recipients methods
    focusRecipientInput() {
        if (this.selectedCompany && this.recipientInputRef) {
            setTimeout(() => this.recipientInputRef.nativeElement.focus(), 0);
        }
    }

    onRecipientTypeahead() {
        if (!this.selectedCompany) return;

        const query = this.recipientTypeahead.toLowerCase().trim();

        if (query.length === 0) {
            this.recipientSuggestions = [];
            this.showRecipientSuggestions = false;
            return;
        }

        this.recipientSuggestions = this.recipients
            .filter(r => r.companyId === this.selectedCompany!.id)
            .filter(r => !this.selectedRecipientIds.includes(r.id))
            .filter(r =>
                r.name.toLowerCase().includes(query) ||
                r.role.toLowerCase().includes(query)
            )
            .slice(0, 10);

        this.showRecipientSuggestions = this.recipientSuggestions.length > 0;
    }

    addRecipientFromTypeahead(recipient: Recipient) {
        if (!this.selectedRecipientIds.includes(recipient.id)) {
            this.selectedRecipientIds.push(recipient.id);
            this.markAsDirty();
        }
        this.recipientTypeahead = '';
        this.recipientSuggestions = [];
        this.showRecipientSuggestions = false;
        this.focusRecipientInput();
    }

    onRecipientBlur() {
        setTimeout(() => {
            this.showRecipientSuggestions = false;
        }, 200);
    }

    toggleRecipientsPicker() {
        this.showRecipientsPicker = !this.showRecipientsPicker;
        if (this.showRecipientsPicker) {
            this.draftRecipientIds = [...this.selectedRecipientIds];
            this.recipientsSearchQuery = '';
            this.filterRecipients();
        }
    }

    filterRecipients() {
        if (!this.selectedCompany) {
            this.filteredRecipients = [];
            return;
        }

        const query = this.recipientsSearchQuery.toLowerCase();
        this.filteredRecipients = this.recipients
            .filter(r => r.companyId === this.selectedCompany!.id)
            .filter(r =>
                r.name.toLowerCase().includes(query) ||
                r.role.toLowerCase().includes(query)
            );
    }

    toggleRecipientSelection(recipientId: string) {
        const index = this.draftRecipientIds.indexOf(recipientId);
        if (index > -1) {
            this.draftRecipientIds.splice(index, 1);
        } else {
            this.draftRecipientIds.push(recipientId);
        }
    }

    cancelRecipientsSelection() {
        this.showRecipientsPicker = false;
        this.draftRecipientIds = [...this.selectedRecipientIds];
    }

    applyRecipientsSelection() {
        this.selectedRecipientIds = [...this.draftRecipientIds];
        this.showRecipientsPicker = false;
        this.markAsDirty();
    }

    removeRecipient(recipientId: string) {
        this.selectedRecipientIds = this.selectedRecipientIds.filter(id => id !== recipientId);
        this.markAsDirty();
    }

    getRecipientName(recipientId: string): string {
        return this.recipients.find(r => r.id === recipientId)?.name || '';
    }

    // Rich text editor methods
    onBodyChange(content: string) {
        this.body = content;
        this.markAsDirty();
    }

    attachFile() {
        alert('File attachment functionality would be implemented here');
    }

    // Form methods
    markAsDirty() {
        this.isDirty = true;
    }

    validateForm(): boolean {
        if (!this.selectedCompany) {
            this.showCompanyError = true;
            return false;
        }

        if (this.selectedRecipientIds.length === 0) {
            return false;
        }

        if (!this.body.trim()) {
            return false;
        }

        return true;
    }

    onSend() {
        if (!this.validateForm()) {
            return;
        }

        console.log('Sending message:', {
            company: this.selectedCompany,
            recipients: this.selectedRecipientIds,
            subject: this.subject,
            body: this.body
        });

        this.isDirty = false;
        this.router.navigate(['/messages']);
    }

    onSaveDraft() {
        if (!this.isDirty) return;

        const draft: MessageDraft = {
            id: 'draft-' + Date.now(),
            companyId: this.selectedCompany?.id || null,
            recipientIds: [...this.selectedRecipientIds],
            subject: this.subject,
            body: this.body,
            updatedAt: new Date()
        };

        const drafts = JSON.parse(localStorage.getItem('messageDrafts') || '[]');
        drafts.push(draft);
        localStorage.setItem('messageDrafts', JSON.stringify(drafts));

        this.showToast = true;
        setTimeout(() => this.showToast = false, 3000);

        this.isDirty = false;
        this.router.navigate(['/messages']);
    }

    onBack() {
        if (this.isDirty) {
            this.showUnsavedModal = true;
        } else {
            this.router.navigate(['/messages']);
        }
    }

    onDontSave() {
        this.isDirty = false;
        this.showUnsavedModal = false;
        this.router.navigate(['/messages']);
    }

    onSaveDraftAndLeave() {
        this.showUnsavedModal = false;
        this.onSaveDraft();
    }
}
