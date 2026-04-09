import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@/app/shared/shared.module'; // Contains AppIcon, DropdownMenu
import { Attachment } from '@/app/core/models';

export interface AttachmentAction {
    type: 'preview' | 'download' | 'remove';
    attachment: Attachment;
}

@Component({
    selector: 'app-attachment-strip',
    standalone: true,
    imports: [CommonModule, SharedModule],
    template: `
    <div *ngIf="attachments?.length" class="flex flex-wrap gap-3 items-stretch">
        <!-- Visible Attachments -->
        <ng-container *ngFor="let att of visibleAttachments">
            <div class="flex items-center gap-3 p-2 rounded border border-unicredit-gray-divider bg-white min-w-[200px] max-w-[300px]">
                <div class="shrink-0">
                    <app-icon [name]="getIconName(att)" size="16"></app-icon>
                </div>
                
                <div class="flex flex-col min-w-0 flex-1">
                    <span class="text-unicredit-text font-bold text-sm uppercase truncate" 
                          [title]="att.name"
                          style="font-family: 'UniCredit'; line-height: normal;">
                        {{ att.name }}
                    </span>
                    <div class="flex items-center gap-2 text-unicredit-text text-sm" 
                         style="font-family: 'UniCredit'; line-height: 24px;">
                        <span>{{ att.type }}</span>
                        <div class="w-px h-3 bg-unicredit-gray-divider"></div>
                        <span>{{ att.size }}</span>
                    </div>
                </div>

                <!-- Action Menu (if not editable, we show Preview/Download) -->
                <app-dropdown-menu class="ml-auto" *ngIf="!editable">
                     <button trigger class="p-1 hover:text-unicredit-primary text-unicredit-text outline-none transition-colors flex items-center justify-center h-8 w-8">
                         <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" class="text-current" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
                     </button>
                     <div items class="flex flex-col min-w-[130px] py-1">
                         <button (click)="onAction('preview', att)" class="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 hover:text-unicredit-primary text-left text-unicredit-text w-full transition-colors outline-none cursor-pointer">
                             <app-icon name="preview" size="16"></app-icon>
                             <span class="text-xs font-bold uppercase">Preview</span>
                         </button>
                         <button (click)="onAction('download', att)" class="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 hover:text-unicredit-primary text-left text-unicredit-text w-full transition-colors outline-none cursor-pointer">
                             <app-icon name="download" size="16"></app-icon>
                             <span class="text-xs font-bold uppercase">Download</span>
                         </button>
                     </div>
                </app-dropdown-menu>

                <!-- Remove Button (if editable only) -->
                <button *ngIf="editable" (click)="onAction('remove', att)" class="ml-auto text-gray-400 hover:text-unicredit-error transition-colors p-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
            </div>
        </ng-container>

        <!-- Overflow Counter Card -->
        <div *ngIf="overflowAttachments.length > 0" class="relative flex">
             <app-dropdown-menu position="auto" #overflowMenu [minWidth]="320" class="flex">
                 <button trigger class="flex items-center gap-2 p-2 rounded border border-unicredit-gray-divider bg-white group hover:border-unicredit-primary transition-all h-full outline-none cursor-pointer">
                     <app-icon name="file-document" size="16"></app-icon>
                     <span class="font-bold text-unicredit-text text-sm" style="font-family: 'UniCredit'">+{{ overflowAttachments.length }}</span>
                     <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" 
                          class="transition-transform duration-300"
                          [ngClass]="{'rotate-180 text-unicredit-primary': overflowMenu.isOpen, 'text-unicredit-text': !overflowMenu.isOpen}"
                          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="m6 9 6 6 6-6"/>
                     </svg>
                 </button>
                 <div items class="flex flex-col gap-2 p-2 w-[320px] max-h-[220px] overflow-y-auto hover-scrollbar">
                     <div *ngFor="let att of overflowAttachments" 
                          class="flex items-center gap-3 p-2 rounded border border-unicredit-gray-divider bg-white w-full"
                     >
                         <div class="shrink-0">
                             <app-icon [name]="getIconName(att)" size="16"></app-icon>
                         </div>
                         
                         <div class="flex flex-col min-w-0 flex-1">
                             <span class="text-unicredit-text font-bold text-sm uppercase truncate" 
                                   [title]="att.name"
                                   style="font-family: 'UniCredit'; line-height: normal;">
                                 {{ att.name }}
                             </span>
                             <div class="flex items-center gap-2 text-unicredit-text text-sm" 
                                  style="font-family: 'UniCredit'; line-height: 24px;">
                                 <span>{{ att.type }}</span>
                                 <div class="w-px h-3 bg-unicredit-gray-divider"></div>
                                 <span>{{ att.size }}</span>
                             </div>
                         </div>

                         <ng-container *ngIf="!editable">
                             <app-dropdown-menu>
                                  <button trigger class="p-1 hover:text-unicredit-primary text-unicredit-text outline-none transition-colors flex items-center justify-center h-8 w-8">
                                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" class="text-current" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
                                  </button>
                                  <div items class="flex flex-col min-w-[130px] py-1">
                                      <button (click)="onAction('preview', att)" class="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 hover:text-unicredit-primary text-left text-unicredit-text w-full transition-colors outline-none cursor-pointer">
                                          <app-icon name="preview" size="16"></app-icon>
                                          <span class="text-xs font-bold uppercase">Preview</span>
                                      </button>
                                      <button (click)="onAction('download', att)" class="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 hover:text-unicredit-primary text-left text-unicredit-text w-full transition-colors outline-none cursor-pointer">
                                          <app-icon name="download" size="16"></app-icon>
                                          <span class="text-xs font-bold uppercase">Download</span>
                                      </button>
                                  </div>
                             </app-dropdown-menu>
                         </ng-container>

                         <button *ngIf="editable" (click)="onAction('remove', att)" class="ml-auto text-gray-400 hover:text-red-500 p-1">
                             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                         </button>
                     </div>
                 </div>
             </app-dropdown-menu>
        </div>
    </div>
    `
})
export class AttachmentStripComponent {
    @Input() attachments: Attachment[] = [];
    @Input() editable = false;
    @Input() maxVisible = 2;
    @Output() action = new EventEmitter<AttachmentAction>();

    get visibleAttachments(): Attachment[] {
        if (!this.attachments) return [];
        // If editable, maybe we want to show all? Or usually strips show all?
        // Let's stick to maxVisible logic for now.
        if (this.maxVisible < 0) return this.attachments;
        return this.attachments.slice(0, this.maxVisible);
    }

    get overflowAttachments(): Attachment[] {
        if (!this.attachments || this.maxVisible < 0) return [];
        return this.attachments.slice(this.maxVisible);
    }

    getIconName(att: Attachment): string {
        return (att.category === 'image' || att.type === 'JPG' || att.type === 'PNG') ? 'file-image' : 'file-document';
    }

    onAction(type: 'preview' | 'download' | 'remove', attachment: Attachment) {
        this.action.emit({ type, attachment });
    }
}
