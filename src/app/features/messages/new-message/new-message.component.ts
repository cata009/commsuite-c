import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { mockCompanies, mockRecipients, Company, Recipient } from '../../../core/data/companies.mock';

export interface MessageDraft {
    id: string;
    companyId: string | null;
    recipientIds: string[];
    subject: string;
    body: string;
    updatedAt: Date;
}

interface TextFormat {
    bold: boolean;
    italic: boolean;
    underline: boolean;
    strikethrough: boolean;
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
                <div class="border border-[#ccc] rounded">
                    <!-- Toolbar -->
                    <div class="flex items-center gap-1 px-3 py-2 border-b border-[#ccc] bg-gray-50">
                        <select [(ngModel)]="fontSize" class="px-2 py-1 border border-[#ccc] rounded text-sm bg-white">
                            <option value="12">12</option>
                            <option value="14" selected>14</option>
                            <option value="16">16</option>
                            <option value="18">18</option>
                            <option value="20">20</option>
                        </select>
                        
                        <div class="w-px h-6 bg-gray-300 mx-1"></div>
                        
                        <button
                            (click)="toggleFormat('bold')"
                            [class.bg-gray-300]="textFormat.bold"
                            class="p-1.5 hover:bg-gray-200 rounded transition-colors"
                            title="Bold"
                        >
                            <span class="font-bold text-sm">B</span>
                        </button>
                        
                        <button
                            (click)="toggleFormat('italic')"
                            [class.bg-gray-300]="textFormat.italic"
                            class="p-1.5 hover:bg-gray-200 rounded transition-colors"
                            title="Italic"
                        >
                            <span class="italic text-sm">I</span>
                        </button>
                        
                        <button
                            (click)="toggleFormat('underline')"
                            [class.bg-gray-300]="textFormat.underline"
                            class="p-1.5 hover:bg-gray-200 rounded transition-colors"
                            title="Underline"
                        >
                            <span class="underline text-sm">U</span>
                        </button>
                        
                        <button
                            (click)="toggleFormat('strikethrough')"
                            [class.bg-gray-300]="textFormat.strikethrough"
                            class="p-1.5 hover:bg-gray-200 rounded transition-colors"
                            title="Strikethrough"
                        >
                            <span class="line-through text-sm">S</span>
                        </button>
                        
                        <div class="w-px h-6 bg-gray-300 mx-1"></div>
                        
                        <button
                            (click)="insertHighlight()"
                            class="p-1.5 hover:bg-gray-200 rounded transition-colors"
                            title="Highlight"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <rect x="2" y="12" width="12" height="3" fill="#FFEB3B"/>
                                <path d="M4 2L12 2L12 12L4 12Z" stroke="#666" stroke-width="1.5" fill="none"/>
                            </svg>
                        </button>
                        
                        <button
                            (click)="insertBulletList()"
                            class="p-1.5 hover:bg-gray-200 rounded transition-colors"
                            title="Bullet List"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <circle cx="3" cy="4" r="1.5" fill="#666"/>
                                <circle cx="3" cy="8" r="1.5" fill="#666"/>
                                <circle cx="3" cy="12" r="1.5" fill="#666"/>
                                <line x1="6" y1="4" x2="14" y2="4" stroke="#666" stroke-width="1.5"/>
                                <line x1="6" y1="8" x2="14" y2="8" stroke="#666" stroke-width="1.5"/>
                                <line x1="6" y1="12" x2="14" y2="12" stroke="#666" stroke-width="1.5"/>
                            </svg>
                        </button>
                        
                        <button
                            (click)="insertNumberedList()"
                            class="p-1.5 hover:bg-gray-200 rounded transition-colors"
                            title="Numbered List"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <text x="1" y="5" font-size="5" fill="#666">1.</text>
                                <text x="1" y="9" font-size="5" fill="#666">2.</text>
                                <text x="1" y="13" font-size="5" fill="#666">3.</text>
                                <line x1="6" y1="4" x2="14" y2="4" stroke="#666" stroke-width="1.5"/>
                                <line x1="6" y1="8" x2="14" y2="8" stroke="#666" stroke-width="1.5"/>
                                <line x1="6" y1="12" x2="14" y2="12" stroke="#666" stroke-width="1.5"/>
                            </svg>
                        </button>
                        
                        <div class="w-px h-6 bg-gray-300 mx-1"></div>
                        
                        <button
                            (click)="insertLink()"
                            class="p-1.5 hover:bg-gray-200 rounded transition-colors"
                            title="Insert Link"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M6.5 8.5L9.5 5.5M4 11L5.5 9.5M11 4L9.5 5.5M8.5 10.5C7.5 11.5 5.5 11.5 4.5 10.5C3.5 9.5 3.5 7.5 4.5 6.5L6 5M10 11L11.5 9.5C12.5 8.5 12.5 6.5 11.5 5.5C10.5 4.5 8.5 4.5 7.5 5.5L6 7" stroke="#666" stroke-width="1.5" fill="none"/>
                            </svg>
                        </button>
                        
                        <button
                            (click)="attachFile()"
                            class="p-1.5 hover:bg-gray-200 rounded transition-colors"
                            title="Attach File"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M11 2L5 8C4 9 4 10.5 5 11.5C6 12.5 7.5 12.5 8.5 11.5L13 7C14.5 5.5 14.5 3 13 1.5C11.5 0 9 0 7.5 1.5L3 6C1 8 1 11 3 13C5 15 8 15 10 13L14 9" stroke="#666" stroke-width="1.5" fill="none"/>
                            </svg>
                        </button>
                    </div>
                    
                    <!-- Editor Area with Auto-grow -->
                    <textarea
                        #messageBody
                        [(ngModel)]="body"
                        (input)="onBodyInput()"
                        (keydown)="handleKeydown($event)"
                        placeholder="Type your message"
                        class="w-full px-3 py-3 resize-none focus:outline-none text-sm"
                        [style.fontSize.px]="fontSize"
                        [style.height.px]="textareaHeight"
                        [style.maxHeight.px]="maxTextareaHeight"
                        [style.overflowY]="textareaHeight >= maxTextareaHeight ? 'auto' : 'hidden'"
                    ></textarea>
                </div>
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

        textarea::-webkit-scrollbar {
            width: 6px;
        }

        textarea::-webkit-scrollbar-track {
            background: #f1f1f1;
        }

        textarea::-webkit-scrollbar-thumb {
            background: #888;
            border-radius: 3px;
        }

        textarea::-webkit-scrollbar-thumb:hover {
            background: #555;
        }
    `]
})
export class NewMessageComponent implements OnInit, AfterViewInit {
    @ViewChild('recipientInput') recipientInputRef!: ElementRef<HTMLInputElement>;
    @ViewChild('messageBody') messageBodyRef!: ElementRef<HTMLTextAreaElement>;

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
    fontSize = '14';

    // Rich text formatting
    textFormat: TextFormat = {
        bold: false,
        italic: false,
        underline: false,
        strikethrough: false
    };

    // Auto-grow textarea
    textareaHeight = 100;
    maxTextareaHeight = 200; // ~5 lines at 14px font
    lineHeight = 20;

    // State
    isDirty = false;
    showUnsavedModal = false;
    showToast = false;

    constructor(private router: Router) { }

    ngOnInit() {
        this.filteredCompanies = [...this.companies];
    }

    ngAfterViewInit() {
        this.adjustTextareaHeight();
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
    toggleFormat(format: keyof TextFormat) {
        this.textFormat[format] = !this.textFormat[format];
        this.markAsDirty();
    }

    insertHighlight() {
        this.markAsDirty();
    }

    insertBulletList() {
        const textarea = this.messageBodyRef?.nativeElement;
        if (textarea) {
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const selectedText = this.body.substring(start, end);
            const lines = selectedText.split('\n');
            const bulletList = lines.map(line => `• ${line}`).join('\n');

            this.body = this.body.substring(0, start) + bulletList + this.body.substring(end);
            this.markAsDirty();

            setTimeout(() => {
                textarea.selectionStart = start;
                textarea.selectionEnd = start + bulletList.length;
                textarea.focus();
            }, 0);
        }
    }

    insertNumberedList() {
        const textarea = this.messageBodyRef?.nativeElement;
        if (textarea) {
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const selectedText = this.body.substring(start, end);
            const lines = selectedText.split('\n');
            const numberedList = lines.map((line, index) => `${index + 1}. ${line}`).join('\n');

            this.body = this.body.substring(0, start) + numberedList + this.body.substring(end);
            this.markAsDirty();

            setTimeout(() => {
                textarea.selectionStart = start;
                textarea.selectionEnd = start + numberedList.length;
                textarea.focus();
            }, 0);
        }
    }

    insertLink() {
        const url = prompt('Enter URL:');
        if (url) {
            const textarea = this.messageBodyRef?.nativeElement;
            if (textarea) {
                const start = textarea.selectionStart;
                const end = textarea.selectionEnd;
                const selectedText = this.body.substring(start, end) || url;
                const link = `[${selectedText}](${url})`;

                this.body = this.body.substring(0, start) + link + this.body.substring(end);
                this.markAsDirty();
            }
        }
    }

    attachFile() {
        alert('File attachment functionality would be implemented here');
    }

    // Auto-grow textarea
    onBodyInput() {
        this.markAsDirty();
        this.adjustTextareaHeight();
    }

    adjustTextareaHeight() {
        const textarea = this.messageBodyRef?.nativeElement;
        if (textarea) {
            textarea.style.height = 'auto';
            const scrollHeight = textarea.scrollHeight;
            this.textareaHeight = Math.max(100, Math.min(scrollHeight, this.maxTextareaHeight));
        }
    }

    handleKeydown(event: KeyboardEvent) {
        if (event.ctrlKey || event.metaKey) {
            switch (event.key.toLowerCase()) {
                case 'b':
                    event.preventDefault();
                    this.toggleFormat('bold');
                    break;
                case 'i':
                    event.preventDefault();
                    this.toggleFormat('italic');
                    break;
                case 'u':
                    event.preventDefault();
                    this.toggleFormat('underline');
                    break;
            }
        }
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
