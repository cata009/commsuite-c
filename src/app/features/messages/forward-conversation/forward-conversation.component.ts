import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessagesService } from '@/app/core/services/messages.service';
import { ParticipantService } from '@/app/core/services/participant.service';
import { mockRecipients, Recipient } from '@/app/core/data/companies.mock';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Message, ConversationItem, ConversationMessage, isSystemMessage } from '@/app/core/models';
import { ClickOutsideDirective } from '@/app/shared/directives/click-outside.directive';
import { AppIconComponent } from '@/app/shared/components/icons/app-icon.component';
import { RichTextEditorComponent } from '@/app/shared/components/rich-text-editor/rich-text-editor.component';
import { AttachmentStripComponent } from '@/app/shared/components/attachment-strip/attachment-strip.component';


export interface ForwardDraft {
    id: string;
    originalConversationId: string;
    recipientIds: string[];
    subject: string;
    body: string;
    updatedAt: Date;
}

// Adapter for Recipient interface match
// The shared component expects Recipient interface which matches ours but good to be explicit
import { RecipientPickerComponent } from '@/app/shared/components/recipient-picker/recipient-picker.component';

@Component({
    selector: 'app-forward-conversation',
    standalone: true,
    template: `
    <div class="h-full flex flex-col bg-white overflow-hidden">
        <!-- 1. Header Title -->
        <div class="px-6 py-4 border-b border-[#e6e6e6] flex-shrink-0 bg-white">
            <h1 style="color: var(--primary-k-10262626-text, #262626); font-feature-settings: 'liga' off, 'clig' off; font-family: UniCredit; font-size: 18px; font-style: normal; font-weight: 700; line-height: normal; text-transform: uppercase;">FORWARD CONVERSATION</h1>
            <div class="flex items-center gap-2 mt-1 w-full max-w-full overflow-hidden" *ngIf="originalMessage">
                 <span class="text-sm text-[#909090] shrink-0">Companies</span>
                 <span class="text-sm font-bold text-[#262626] truncate" [title]="getAllCompanies()">
                     {{ getAllCompanies() }}
                 </span>
            </div>
        </div>

        <!-- 2. To Section (Dynamic height) -->
        <div class="px-6 py-4 border-b border-[#e6e6e6] flex-shrink-0 bg-white relative z-20">
             <!-- To Input -->
             <div class="relative flex items-start gap-4 mb-4">
                 <!-- TO Button with Picker Toggle -->
                 <div class="relative z-50">
                     <button (click)="toggleRecipientPicker()" 
                             class="font-bold text-sm mt-1.5 whitespace-nowrap flex items-center gap-1 cursor-pointer outline-none transition-colors"
                             [ngClass]="showRecipientPicker ? 'text-[#007a91]' : 'text-[#262626]'">
                        To 
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none" 
                             class="transition-transform duration-200"
                             [class.rotate-180]="showRecipientPicker">
                            <path d="M2 4L6 8L10 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                     </button>
                     
                     <!-- PICKER POPOVER -->
                     <!-- PICKER POPOVER -->
                     <app-recipient-picker
                        *ngIf="showRecipientPicker"
                        [recipients]="recipients"
                        [initialSelectedIds]="selectedRecipientIds"
                        (apply)="onPickerApply($event)"
                        (cancel)="showRecipientPicker = false"
                        class="absolute top-full left-0 mt-2 z-[100]"
                     ></app-recipient-picker>
                 </div>
                
                <div class="flex flex-wrap gap-2 items-center flex-1">
                     <div *ngFor="let recipientId of selectedRecipientIds" class="flex items-center gap-2 px-2 py-1 bg-[#F5F5F5] border border-[#E6E6E6] rounded-[4px]">
                          <app-icon [name]="getRecipientIconById(recipientId)" size="14"></app-icon> 
                          <span class="text-[#262626] text-sm font-medium">{{ getRecipientName(recipientId) }}</span>
                          <button (click)="removeRecipient(recipientId)" class="text-[#666] hover:text-[#d32f2f] flex items-center justify-center">
                               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                          </button>
                     </div>
                     
                     <input 
                        #recipientInput 
                        type="text" 
                        [(ngModel)]="recipientTypeahead" 
                        (input)="onRecipientTypeahead()" 
                        (blur)="onRecipientBlur()" 
                        (focus)="showRecipientSuggestions = true"
                        class="flex-1 min-w-[100px] outline-none text-sm bg-transparent h-7"
                     >
                </div>
                
                <!-- Suggestions Dropdown -->
                <div *ngIf="showRecipientSuggestions && recipientSuggestions.length > 0" class="absolute top-full left-[40px] mt-1 w-[300px] z-50 bg-white border border-[#ccc] rounded shadow-lg max-h-60 overflow-y-auto">
                   <button *ngFor="let recipient of recipientSuggestions" (mousedown)="addRecipientFromTypeahead(recipient)" class="w-full text-left px-4 py-2 hover:bg-[#e7f8fb] transition-colors relative flex items-start gap-3">
                       <div class="mt-0.5">
                           <app-icon [name]="getRecipientIcon(recipient)" size="20"></app-icon>
                       </div>
                       <div class="flex-1">
                           <div class="text-sm font-medium text-[#262626]">{{ recipient.name }}</div>
                           <div class="text-xs text-gray-600">{{ recipient.role }}</div>
                           <div *ngIf="recipient.outOfOffice?.isOoo" class="text-xs text-[#E91E63] font-medium mt-0.5">
                              Out of office: Returning {{ recipient.outOfOffice!.returnDate }}
                           </div>
                       </div>
                   </button>
                </div>
            </div>

            <!-- Subject (Static) -->
            <div class="flex items-center gap-2">
                 <span class="text-sm font-bold text-[#262626]">Subject:</span>
                 <span class="text-sm text-[#262626]">{{ subject }}</span>
            </div>
        </div>

        <!-- 3. Scrollable History (Flex-1) -->
        <div class="flex-1 overflow-y-auto px-6 py-4 bg-[#e5e5e5] hover-scrollbar flex flex-col gap-3">
             <div *ngFor="let msg of conversationMessages" class="flex w-full group relative" [ngClass]="msg.isOwn ? 'justify-end' : 'justify-start'">
                  
                  <div class="max-w-[75%] border rounded p-3 transition-all cursor-default"
                       [ngClass]="{
                          'bg-white border-[#007a91]': msg.isOwn,
                          'bg-[#f5f5f5] border-[#909090]': !msg.isOwn
                       }">
                       
                       <!-- Header -->
                       <div class="flex items-start justify-between gap-6 mb-3">
                           <span class="font-bold" [ngClass]="msg.isOwn ? 'text-[#007a91]' : 'text-[#262626]'">
                               {{ msg.isOwn ? 'You' : msg.sender }}
                           </span>
                           <div class="flex items-center gap-2">
                               <span class="text-[#262626] uppercase font-bold text-xs">{{ formatTimestamp(msg.timestamp) }}</span>
                           </div>
                       </div>
                       
                       <!-- Replied To Content -->
                       <div *ngIf="msg.replyTo" class="mb-3 p-4 flex flex-col gap-2 rounded bg-white border border-[#007A91] self-stretch">
                           <div class="flex items-center justify-between mb-1">
                               <span class="text-[#262626] text-sm font-bold uppercase">{{ msg.replyTo.sender }}</span>
                               <span class="text-[#666] text-xs">{{ msg.replyTo.timestamp }}</span>
                           </div>
                           <div class="text-[#262626] text-sm opacity-90 break-words whitespace-pre-wrap line-clamp-2" [innerHTML]="msg.replyTo.content"></div>
                       </div>

                       <!-- Content -->
                       <div class="text-[#262626] leading-relaxed break-words whitespace-pre-wrap text-sm" [innerHTML]="msg.content"></div>

                       <!-- Attachments Section -->
                       <app-attachment-strip 
                           [attachments]="msg.attachments || []"
                           class="mt-3 block"
                       ></app-attachment-strip>
                  </div>
             </div>
        </div>

        <!-- 4. Editor Area (Fixed) -->
        <div class="flex-shrink-0 border-t border-[#e6e6e6] bg-white p-6 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] z-30">
            <!-- Rich Text Editor -->
            <div class="mb-4">
                <app-rich-text-editor
                    [content]="body"
                    [showToolbar]="true"
                    [placeholder]="'Type your message'"
                    (contentChange)="onBodyChange($event)"
                    (attachmentClick)="attachFile()">
                </app-rich-text-editor>
            </div>

            <!-- Footer Buttons -->
            <div class="flex items-center justify-between">
                <button (click)="onBack()" class="px-6 py-2 border border-[#262626] text-[#262626] font-bold rounded hover:bg-gray-50 uppercase text-sm transition-colors" style="font-family: 'UniCredit';">
                     Back
                </button>
                <div class="flex items-center gap-4">
                     <button (click)="onSaveDraft()" [disabled]="!isDirty" class="text-[#007a91] font-bold uppercase text-sm hover:underline disabled:opacity-50 disabled:no-underline disabled:cursor-not-allowed transition-colors font-unicredit">
                         SAVE DRAFT
                     </button>
                     <button (click)="onSend()" 
                        [disabled]="selectedRecipientIds.length === 0"
                        class="px-8 py-2 bg-[#007a91] text-white font-bold rounded hover:bg-[#006577] uppercase text-sm transition-all shadow-md hover:shadow-lg active:scale-95 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed disabled:shadow-none disabled:active:scale-100" 
                        style="font-family: 'UniCredit';">
                         Send
                     </button>
                </div>
            </div>
        </div>
        
        <!-- Reuse Modals -->
        <div *ngIf="showUnsavedModal" class="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center">
            <div class="bg-white rounded w-[400px] shadow-2xl p-6 relative">
                 <h3 class="text-xl font-bold text-[#262626] text-center mb-2">You will lose all changes.</h3>
                 <p class="text-center text-[#666] mb-8">Are you sure you want to leave?</p>
                 <div class="flex gap-4">
                     <button (click)="onDontSave()" class="flex-1 py-2.5 border border-[#262626] font-bold text-[#262626] uppercase hover:bg-gray-50 rounded">Don't save</button>
                     <button (click)="onSaveDraftAndLeave()" class="flex-1 py-2.5 bg-[#007a91] text-white font-bold uppercase hover:bg-[#006577] rounded">Save draft</button>
                 </div>
            </div>
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
    `],
    imports: [CommonModule, FormsModule, AppIconComponent, ClickOutsideDirective, RichTextEditorComponent, RecipientPickerComponent, AttachmentStripComponent]
})
export class ForwardConversationComponent implements OnInit {
    @ViewChild('recipientInput') recipientInputRef!: ElementRef<HTMLInputElement>;

    @Input() messageId: string | null = null;

    recipients = mockRecipients;

    // Original conversation data
    conversationId: string = '';
    originalMessage: Message | null = null;
    conversationMessages: ConversationMessage[] = [];

    // Recipients selection
    selectedRecipientIds: string[] = [];

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

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private messagesService: MessagesService,
        private participantService: ParticipantService
    ) { }

    ngOnInit() {
        if (this.messageId) {
            this.conversationId = this.messageId;
            this.loadConversation();
        } else {
            this.route.params.subscribe(params => {
                if (params['id']) {
                    this.conversationId = params['id'];
                    this.loadConversation();
                }
            });
        }
    }


    loadConversation() {
        // Fetch original message details
        this.messagesService.getAllMessages().subscribe(messages => {
            this.originalMessage = messages.find(m => m.id === this.conversationId) || null;
            if (this.originalMessage) {
                this.subject = `FW: ${this.originalMessage.subject}`;
            }
        });

        // Fetch conversation thread
        this.messagesService.getConversation(this.conversationId).subscribe(data => {
            if (data && data.messages) {
                // Filter out system messages and cast to ConversationMessage
                this.conversationMessages = data.messages
                    .filter(item => !isSystemMessage(item)) as ConversationMessage[];
            }
        });
    }

    getAllCompanies(): string {
        return this.originalMessage?.companies?.join(', ') || '';
    }

    // Recipients methods
    focusRecipientInput() {
        if (this.recipientInputRef) {
            setTimeout(() => this.recipientInputRef.nativeElement.focus(), 0);
        }
    }

    onRecipientTypeahead() {
        const query = this.recipientTypeahead.toLowerCase().trim();

        if (query.length === 0) {
            this.recipientSuggestions = [];
            this.showRecipientSuggestions = false;
            return;
        }

        // Filter recipients
        // Note: mockRecipients might not be linked to the original message's company in the same way 
        // as NewMessage (where company is selected dynamically).
        // Here we default to showing all matching recipients or just filtering by company if strict.
        // Assuming we want to allow forwarding to anyone or just related company people?
        // Let's filter by the company of the original message if possible to be consistent.

        const companyName = this.originalMessage?.companies?.[0];

        this.recipientSuggestions = this.recipients
            // .filter(r => ... ) // Optional: valid filtering logic if we have companyId map
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

    removeRecipient(recipientId: string) {
        this.selectedRecipientIds = this.selectedRecipientIds.filter(id => id !== recipientId);
        this.markAsDirty();
    }

    getRecipientName(recipientId: string): string {
        return this.recipients.find(r => r.id === recipientId)?.name || '';
    }

    getRecipientIcon(recipient: Recipient): string {
        const type = this.participantService.getParticipantType(recipient.name);
        return type === 'banker' ? 'member-banker' : 'member-client';
    }

    getRecipientIconById(recipientId: string): string {
        const recipient = this.recipients.find(r => r.id === recipientId);
        if (!recipient) return 'member-client';
        return this.getRecipientIcon(recipient);
    }

    // Rich text editor methods
    onBodyChange(content: string) {
        this.body = content;
        this.markAsDirty();
    }

    attachFile() {
        alert('File attachment functionality would be implemented here');
    }

    // Utility methods
    formatTimestamp(timestamp: string): string {
        // Assume timestamp is ISO string or formatted string
        // If it's already a formatted string like "10:30 AM", just return it
        // Check if valid date
        const date = new Date(timestamp);
        if (isNaN(date.getTime())) {
            return timestamp;
        }

        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        return `${day}.${month}.${year} ${hours}:${minutes}`;
    }

    // Form methods
    markAsDirty() {
        this.isDirty = true;
    }

    validateForm(): boolean {
        if (this.selectedRecipientIds.length === 0) {
            return false;
        }

        if (!this.subject.trim()) {
            return false;
        }

        return true;
    }

    onSend() {
        if (!this.validateForm()) {
            return;
        }

        console.log('Forwarding conversation:', {
            originalConversationId: this.conversationId,
            recipients: this.selectedRecipientIds,
            subject: this.subject,
            body: this.body
        });

        this.isDirty = false;
        this.router.navigate(['/messages']);
    }

    onSaveDraft() {
        if (!this.isDirty) return;

        const draft: ForwardDraft = {
            id: 'forward-draft-' + Date.now(),
            originalConversationId: this.conversationId,
            recipientIds: [...this.selectedRecipientIds],
            subject: this.subject,
            body: this.body,
            updatedAt: new Date()
        };

        const drafts = JSON.parse(localStorage.getItem('forwardDrafts') || '[]');
        drafts.push(draft);
        localStorage.setItem('forwardDrafts', JSON.stringify(drafts));

        this.showToast = true;
        setTimeout(() => this.showToast = false, 3000);

        this.isDirty = false;
        this.router.navigate(['/messages', this.conversationId]);
    }

    onBack() {
        if (this.isDirty) {
            this.showUnsavedModal = true;
        } else {
            this.router.navigate(['/messages', this.conversationId]);
        }
    }

    onDontSave() {
        this.isDirty = false;
        this.showUnsavedModal = false;
        this.router.navigate(['/messages', this.conversationId]);
    }

    onSaveDraftAndLeave() {
        this.showUnsavedModal = false;
        this.onSaveDraft();
    }
    // Picker Logic
    showRecipientPicker = false;

    toggleRecipientPicker() {
        this.showRecipientPicker = !this.showRecipientPicker;
    }

    onPickerApply(selectedIds: string[]) {
        this.selectedRecipientIds = selectedIds;
        this.markAsDirty();
        this.showRecipientPicker = false;
    }
}
