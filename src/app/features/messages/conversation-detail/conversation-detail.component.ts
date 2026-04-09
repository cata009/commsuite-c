import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';


import { ConversationData, ConversationItem, ConversationMessage, isSystemMessage, SystemMessage, Attachment } from '@/app/core/models';
import { Router } from '@angular/router';
import { MessagesService } from '@/app/core/services/messages.service';
import { mockRecipients, Recipient } from '@/app/core/data/companies.mock';
import { highlightText } from '@/app/core/utils/search.utils';
import { RichTextEditorComponent } from '@/app/shared/components/rich-text-editor/rich-text-editor.component';
import { RecipientPickerComponent } from '@/app/shared/components/recipient-picker/recipient-picker.component';
import { AttachmentStripComponent, AttachmentAction } from '@/app/shared/components/attachment-strip/attachment-strip.component';

import { CompanyDisplayComponent } from '@/app/shared/components/company-display/company-display.component';
import { ParticipantService } from '@/app/core/services/participant.service';
import { NotificationService } from '@/app/core/services/notification.service';

@Component({
    selector: 'app-conversation-detail',
    styles: [`
        :host {
            display: flex;
            flex-direction: column;
            height: 100%;
            flex: 1;
            min-width: 0;
        }
        ::ng-deep .rich-text-content {
          font-size: 14px;
          line-height: 1.15;
        }
        ::ng-deep .rich-text-content font {
          line-height: normal;
        }
    `],
    template: `
    <div *ngIf="!messageId" class="flex-1 flex flex-col items-center justify-center bg-white text-unicredit-text-secondary gap-4 h-full">
      <!-- Empty State SVG -->
      <svg xmlns="http://www.w3.org/2000/svg" width="110" height="83" viewBox="0 0 110 83" fill="none">
         <path d="M80.5241 72.173H30.3591C28.5223 72.1727 26.7608 71.4429 25.462 70.1441C24.1632 68.8453 23.4334 67.0838 23.4331 65.247V14.811H102.866C104.703 14.811 106.465 15.5406 107.764 16.8395C109.063 18.1383 109.793 19.9 109.793 21.737V72.173H96.6831V82.303L80.5241 72.173Z" fill="#E5E5E5"/>
         <path d="M13.111 57.358H6.846C5.03024 57.3577 3.28893 56.6362 2.00509 55.3522C0.721241 54.0682 -1.93655e-08 52.3268 0 50.511L0 0H79.517C81.3328 -1.93655e-08 83.0742 0.721241 84.3582 2.00509C85.6422 3.28893 86.3637 5.03024 86.364 6.846V57.358H29.278L13.111 67.493V57.358Z" fill="#CCCCCC"/>
      </svg>
      <p class="text-lg">Select a conversation to view messages</p>
    </div>

    <div *ngIf="messageId && conversation" class="flex-1 bg-white flex flex-col min-w-0 h-full">
      <!-- Top Header Wrapper -->
      <div class="border-b border-unicredit-gray flex flex-col">
        <!-- Main Header Row -->
        <div class="px-6 py-4 flex items-center justify-between">
            <div class="flex-1 min-w-0 pr-4">
                <h2 class="text-xl font-bold text-unicredit-text truncate" [title]="conversation.title">
                    {{ conversation.title }}
                </h2>
            </div>
            <div class="flex items-center gap-4">
                <span class="text-sm text-unicredit-text-secondary">Updated: {{ conversation.lastUpdated }}</span>
                
                <!-- Participant List Dropdown -->
                <div class="relative" clickOutside (clickOutside)="isMemberDropdownOpen = false">
                    <button 
                        (click)="isMemberDropdownOpen = !isMemberDropdownOpen"
                        class="flex items-center gap-1 px-4 py-1.5 border rounded-[4px] transition-colors group outline-none"
                        [ngClass]="{
                            'bg-unicredit-primary-light text-unicredit-primary border-unicredit-primary': hasParticipantMatch,
                            'bg-unicredit-gray-lighter text-unicredit-primary border-unicredit-primary': isMemberDropdownOpen && !hasParticipantMatch,
                            'border-unicredit-text bg-unicredit-gray-lighter hover:bg-gray-100': !isMemberDropdownOpen && !hasParticipantMatch
                        }"
                    >
                        <app-icon name="participants" size="15" [isActive]="isMemberDropdownOpen || hasParticipantMatch"></app-icon>
                        <span class="text-sm font-bold" [ngClass]="(isMemberDropdownOpen || hasParticipantMatch) ? 'text-unicredit-primary' : 'text-unicredit-text'">
                            {{ (conversation.participantsList || []).length }}
                        </span>
                    </button>

                    <!-- Member Popover -->
                    <div *ngIf="isMemberDropdownOpen" 
                         class="absolute top-full right-0 mt-1 w-[240px] bg-white rounded-[4px] border border-unicredit-text shadow-lg z-50 p-3 flex flex-col animate-slideDown">
                        <!-- Companies Label -->
                        <div class="w-full mb-2 flex justify-center">
                            <app-company-display
                                [companies]="getConversationCompanies()"
                                textSize="text-sm"
                                [isBold]="true"
                                maxWidth="max-w-full"
                            ></app-company-display>
                        </div>
                        
                        <div class="flex-1 overflow-y-auto pr-1 hover-scrollbar" style="max-height: 216px;">
                            <div *ngFor="let member of sortedParticipants" 
                                 class="flex items-center gap-2.5 w-full rounded py-1.5 px-3 transition-colors cursor-default relative group/ooo"
                                 [ngClass]="isMemberOOO(member) ? 'bg-unicredit-ooo-bg hover:bg-[#F8BBD0]' : 'bg-unicredit-gray-lighter hover:bg-[#ebebeb]'"
                                 [title]="isMemberOOO(member) ? 'Out of office: Returning ' + getMemberOOODate(member) : ''">
                                <div class="shrink-0 flex items-center justify-center w-5 h-5">
                                    <app-icon [name]="getMemberIconName(member)" size="15"></app-icon>
                                </div>
                                <span class="text-unicredit-text font-bold text-sm uppercase truncate flex-1 block" [innerHTML]="highlightMember(member)">
                                </span>
                                <!-- OOO Icon -->
                                <div *ngIf="isMemberOOO(member)" class="shrink-0 text-unicredit-text">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                                        <polyline points="16 17 21 12 16 7"></polyline>
                                        <line x1="21" y1="12" x2="9" y2="12"></line>
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div class="flex justify-center w-full">
                            <button (click)="startEditMembers()" class="flex items-center gap-2 mt-4 hover:opacity-80 transition-opacity text-[#007a91]">
                                <app-icon name="edit" size="16" class="text-current"></app-icon>
                                <span class="font-bold text-sm uppercase" style="font-family: 'UniCredit', sans-serif; font-feature-settings: 'liga' off, 'clig' off; line-height: normal;">EDIT MEMBERS</span>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Header Options Dropdown -->
                <app-dropdown-menu>
                    <button trigger class="p-2 transition-colors duration-200 hover:text-[#007a91] text-[#262626] outline-none cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                          <path fill-rule="evenodd" clip-rule="evenodd" d="M11.875 2.1875C11.875 0.979311 10.8956 0 9.68711 0C8.47942 0 7.5 0.979311 7.5 2.1875C7.5 3.39569 8.47942 4.375 9.68711 4.375C10.8956 4.375 11.875 3.39569 11.875 2.1875ZM11.875 9.9021C11.875 8.69449 10.8956 7.715 9.68711 7.715C8.47942 7.715 7.5 8.69449 7.5 9.9021C7.5 11.1105 8.47942 12.09 9.68711 12.09C10.8956 12.09 11.875 11.1105 11.875 9.9021ZM11.875 17.6163C11.875 16.4087 10.8956 15.4292 9.68711 15.4292C8.47942 15.4292 7.5 16.4087 7.5 17.6163C7.5 18.8255 8.47942 19.8042 9.68711 19.8042C10.8956 19.8042 11.875 18.8255 11.875 17.6163Z" fill="currentColor"/>
                        </svg>
                    </button>
                    <div items class="flex flex-col min-w-[200px]">
                        <!-- Mark as unread -->
                        <button (click)="markUnread.emit(messageId!)" class="flex items-center gap-2 px-3 py-3 cursor-pointer outline-none transition-colors hover:text-[#007a91] text-left w-full text-[#262626]">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                              <path d="M16 12.4385C16 13.9296 15.0058 14.9238 13.5146 14.9238H0V8.07422L7.95312 13.542L16 8.07422V12.4385ZM15.2598 7.02051L7.95312 12.04L0.646484 7.02051L7.95312 2L15.2598 7.02051Z" fill="currentColor"/>
                            </svg>
                            <span class="uppercase font-bold text-sm">Mark as unread</span>
                        </button>

                        <!-- Restore Conversation (Only for Deleted Items) -->
                        <button *ngIf="folder === 'Deleted Items'" (click)="restoreConversation.emit(messageId!)" class="flex items-center gap-2 px-3 py-3 cursor-pointer outline-none transition-colors hover:text-[#007a91] text-left w-full text-[#262626]">
                            <div class="w-4 h-4 flex-shrink-0">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                  <path fill-rule="evenodd" clip-rule="evenodd" d="M14.6764 8.0543L12.9485 8.06282C13.0515 9.48135 12.5475 10.883 11.5632 11.9102C9.64429 13.913 6.45648 13.9834 4.45714 12.0672C2.45812 10.1506 2.39287 6.96286 4.31182 4.96004C6.23082 2.95793 9.41826 2.88726 11.4176 4.80347C11.4946 4.877 11.5638 4.9571 11.6362 5.03521L10.4605 5.05603C9.7844 5.05923 9.28536 5.94909 9.30525 6.41623L12.9358 6.39815L14.2536 6.391L14.1942 4.98851L14.0457 1.50317C13.5806 1.50561 12.7578 2.00473 12.7864 2.6848L12.8311 3.78305C12.759 3.70706 12.6911 3.62686 12.6149 3.55398C9.92796 0.97845 5.64366 1.07217 3.0645 3.76446C0.484914 6.45572 0.572221 10.7412 3.25985 13.3166C5.94715 15.8925 10.2314 15.7981 12.8102 13.1062C14.1063 11.7544 14.7777 9.91989 14.6764 8.0543" fill="currentColor"/>
                                </svg>
                            </div>
                            <span class="uppercase font-bold text-sm">Restore conversation</span>
                        </button>

                        <!-- Forward conversation -->
                        <button class="flex items-center gap-2 px-3 py-3 cursor-pointer outline-none transition-colors hover:text-[#007a91] text-left w-full text-[#262626]" (click)="onForwardConversation()">
                            <div class="w-4 h-4 flex-shrink-0">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                  <path fill-rule="evenodd" clip-rule="evenodd" d="M5.15175 2C4.28275 2.80138 4.28275 4.10188 5.15175 4.904L8.29845 8L5.15175 11.096C4.28275 11.8981 4.28275 13.1979 5.15175 14L11.25 8L5.15175 2Z" fill="currentColor"/>
                                </svg>
                            </div>
                            <span class="uppercase font-bold text-sm">Forward conversation</span>
                        </button>

                        <!-- Download conversation -->
                        <button class="flex items-center gap-2 px-3 py-3 cursor-pointer outline-none transition-colors hover:text-[#007a91] text-left w-full text-[#262626]">
                            <div class="w-4 h-4 flex-shrink-0">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                  <path fill-rule="evenodd" clip-rule="evenodd" d="M2 6.35253L8.00043 12L14 6.35253C13.5871 5.94943 13.0878 5.7466 12.5029 5.7466C11.9164 5.7466 11.4179 5.94943 11.0041 6.35253L9 8.2523V0H7V8.25145L4.9959 6.35253C4.58383 5.94943 4.08365 5.7466 3.49881 5.7466C2.91225 5.7466 2.41379 5.94943 2 6.35253ZM1 13.5H12.4353C12.7859 13.5 13.1173 13.5652 13.4305 13.6965C13.7427 13.826 14.0139 14.0056 14.2422 14.2342C14.4723 14.4629 14.6558 14.7281 14.7937 15.03C14.9306 15.3311 15 15.649 15 16H3.56292C3.21323 16 2.88179 15.9411 2.56861 15.8071C2.25635 15.6723 1.98609 15.4918 1.756 15.2676C1.52683 15.0443 1.34331 14.7791 1.20544 14.4727C1.06848 14.1663 1 13.843 1 13.5Z" fill="currentColor"/>
                                </svg>
                            </div>
                            <span class="uppercase font-bold text-sm">Download conversation</span>
                        </button>


                        <!-- Delete -->
                        <button *ngIf="folder !== 'Deleted Items'" (click)="deleteConversation.emit(messageId!)" class="flex items-center gap-2 px-3 py-3 cursor-pointer outline-none transition-colors hover:text-[#007a91] text-left w-full text-[#262626]">
                            <div class="w-4 h-4 flex-shrink-0">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                  <path fill-rule="evenodd" clip-rule="evenodd" d="M9.5 1H12.523C13.508 1 14 2 14 2.5V3H2V2.5C2 2 2.492 1 3.477 1H6.5L7 0H9L9.5 1ZM4.84017 16C4.32017 16 3.88667 15.6015 3.84367 15.083L2.92017 4H12.9202L11.9962 15.083C11.9532 15.6015 11.5202 16 11.0002 16H4.84017Z" fill="currentColor"/>
                                </svg>
                            </div>
                            <span class="uppercase font-bold text-sm">Delete</span>
                        </button>
                    </div>
                </app-dropdown-menu>
            </div>
        </div>

        <!-- Todo Messages Section -->
        <div *ngIf="todoMessages.length > 0" class="px-6 pb-4">
            <app-todo-messages-section 
                [todoMessages]="todoMessages"
                (onViewInChat)="scrollToMessage($event)"
                (onUnmarkTodo)="toggleTodoStatus($event)"
            ></app-todo-messages-section>
        </div>
      </div>

      <!-- EDIT MEMBERS PANEL -->
      <div *ngIf="isEditMembersMode" class="bg-white border-b border-[#ccc] px-6 py-4 flex flex-col gap-4 animate-slideDown shadow-sm relative z-30">
        <!-- To Field -->
        <div class="flex items-start gap-4">
            <div class="relative z-50">
                 <button (click)="toggleMemberPicker()" 
                         class="font-bold text-sm mt-2 whitespace-nowrap flex items-center gap-1 cursor-pointer outline-none transition-colors"
                         [ngClass]="showMemberPicker ? 'text-[#007a91]' : 'text-[#262626]'">
                    To 
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none" 
                         class="transition-transform duration-200"
                         [class.rotate-180]="showMemberPicker">
                        <path d="M2 4L6 8L10 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                 </button>

                 <!-- PICKER POPOVER -->
                 <app-recipient-picker
                    *ngIf="showMemberPicker"
                    [recipients]="allRecipients"
                    [initialSelectedIds]="draftParticipantIds"
                    (apply)="onMemberPickerApply($event)"
                    (cancel)="showMemberPicker = false"
                    class="absolute top-full left-0 mt-2 z-[100]"
                 ></app-recipient-picker>
            </div>
            
            <div class="flex-1">
                <div class="flex flex-wrap gap-2 items-center">
                    <!-- Participant Chips -->
                    <div *ngFor="let member of draftParticipants" class="flex items-center gap-2 px-2 py-1 bg-white border border-[#ccc] rounded-[4px]">
                        <app-icon [name]="getMemberIconName(member)" size="14"></app-icon>
                        <span class="text-[#262626] text-sm font-medium">{{ member }}</span>
                        <button (click)="requestRemoveParticipant(member)" class="text-[#666] hover:text-[#d32f2f] transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>

                    <!-- Input for new members -->
                    <div class="relative flex-1 min-w-[200px]">
                        <input 
                            #memberInput
                            type="text" 
                            [(ngModel)]="memberSearchQuery"
                            (input)="onMemberSearch()"
                            (focus)="onMemberInputFocus()"
                            (blur)="onMemberInputBlur()"
                            placeholder="Add people..."
                            class="w-full outline-none text-sm py-1.5"
                        >
                        
                        <!-- Typeahead Dropdown -->
                        <div *ngIf="showMemberSuggestions && (groupedSuggestions.portfolio.length > 0 || groupedSuggestions.otherBank.length > 0)" 
                             class="absolute top-full left-0 mt-2 w-[400px] bg-white border border-[#ccc] rounded-[4px] shadow-lg max-h-[300px] overflow-y-auto z-50">
                            
                            <!-- Search Header -->
                            <div class="px-4 py-2 border-b border-[#e6e6e6]">
                                <div class="flex items-center gap-2 text-gray-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                                    <span class="text-xs uppercase font-bold">Search</span>
                                </div>
                            </div>

                            <!-- Portfolio Users -->
                            <ng-container *ngIf="groupedSuggestions.portfolio.length > 0">
                                <div class="px-4 py-2 bg-gray-50 text-[10px] font-bold text-[#666] uppercase tracking-wider">
                                    Users in my portfolio
                                </div>
                                <button *ngFor="let user of groupedSuggestions.portfolio" 
                                        (mousedown)="addParticipant(user)"
                                        class="w-full text-left px-4 py-2 hover:bg-[#e7f8fb] transition-colors flex items-start gap-3">
                                    <div class="mt-0.5">
                                        <app-icon [name]="getMemberIconName(user.name)" size="16"></app-icon>
                                    </div>
                                    <div class="flex-1">
                                        <div class="text-sm font-bold text-[#262626]">{{ user.name }}</div>
                                        <div *ngIf="user.outOfOffice?.isOoo" class="text-xs text-[#E91E63] font-medium mt-0.5">
                                            Out of office: Returning {{ user.outOfOffice!.returnDate }}
                                        </div>
                                    </div>
                                </button>
                            </ng-container>

                            <!-- Other Bank Users -->
                            <ng-container *ngIf="groupedSuggestions.otherBank.length > 0">
                                <div class="px-4 py-2 bg-gray-50 text-[10px] font-bold text-[#666] uppercase tracking-wider">
                                    Other bank users
                                </div>
                                <button *ngFor="let user of groupedSuggestions.otherBank" 
                                        (mousedown)="addParticipant(user)"
                                        class="w-full text-left px-4 py-2 hover:bg-[#e7f8fb] transition-colors flex items-start gap-3">
                                    <div class="mt-0.5">
                                        <app-icon [name]="getMemberIconName(user.name)" size="16"></app-icon>
                                    </div>
                                    <div class="flex-1">
                                        <div class="text-sm font-bold text-[#262626]">{{ user.name }}</div>
                                        <div class="text-xs text-[#666]">{{ user.role }}</div>
                                        <div *ngIf="user.outOfOffice?.isOoo" class="text-xs text-[#E91E63] font-medium mt-0.5">
                                            Out of office: Returning {{ user.outOfOffice!.returnDate }}
                                        </div>
                                    </div>
                                </button>
                            </ng-container>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="flex items-center justify-between mt-4 min-h-[40px]">
            <!-- Info Message -->
            <div *ngIf="hasNewParticipants" class="flex items-center gap-2 py-2 px-3 bg-[#f5f5f5] rounded text-sm text-[#262626]">
                <app-icon name="info" size="16" class="text-[#666]"></app-icon>
                <span>Added participants will have access to the conversation history</span>
            </div>
            
            <!-- Actions -->
            <div class="flex gap-3 ml-auto">
                <button (click)="cancelEditMembers()" class="px-6 py-2 border border-[#262626] text-[#262626] font-bold rounded hover:bg-gray-100 uppercase text-sm">
                    Cancel
                </button>
                <button (click)="saveEditMembers()" class="px-6 py-2 bg-[#007a91] text-white font-bold rounded hover:bg-[#006577] uppercase text-sm">
                    Save
                </button>
            </div>
        </div>
      </div>

      <div *ngIf="false && oooParticipants.length > 0 && !isEditMembersMode" 
           class="mx-6 mb-2 mt-4 flex items-center justify-between"
           style="padding: 4px 12px; border-radius: 4px; background-color: #FBE1F7; border: 1px solid #A33694;">
           
           <div class="flex items-center gap-2">
               <!-- Icon -->
               <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M5.91123 1.05842C6.17251 0.980035 6.4485 0.963821 6.71716 1.01107C6.98582 1.05831 7.23972 1.16771 7.45859 1.33053C7.67745 1.49335 7.85523 1.70507 7.97771 1.94881C8.1002 2.19255 8.16402 2.46155 8.16406 2.73433V11.265C8.16402 11.5378 8.1002 11.8068 7.97771 12.0505C7.85523 12.2943 7.67745 12.506 7.45859 12.6688C7.23972 12.8316 6.98582 12.941 6.71716 12.9883C6.4485 13.0355 6.17251 13.0193 5.91123 12.9409L2.41123 11.8909C2.05079 11.7828 1.7348 11.5614 1.51014 11.2595C1.28549 10.9576 1.16412 10.5913 1.16406 10.215V3.78433C1.16412 3.40802 1.28549 3.04176 1.51014 2.73987C1.7348 2.43797 2.05079 2.21654 2.41123 2.10842L5.91123 1.05842ZM8.7474 2.333C8.7474 2.17829 8.80885 2.02992 8.91825 1.92052C9.02765 1.81112 9.17602 1.74967 9.33073 1.74967H11.0807C11.5449 1.74967 11.99 1.93404 12.3182 2.26223C12.6464 2.59042 12.8307 3.03554 12.8307 3.49967V4.083C12.8307 4.23771 12.7693 4.38608 12.6599 4.49548C12.5505 4.60487 12.4021 4.66633 12.2474 4.66633C12.0927 4.66633 11.9443 4.60487 11.8349 4.49548C11.7255 4.38608 11.6641 4.23771 11.6641 4.083V3.49967C11.6641 3.34496 11.6026 3.19658 11.4932 3.08719C11.3838 2.97779 11.2354 2.91633 11.0807 2.91633H9.33073C9.17602 2.91633 9.02765 2.85487 8.91825 2.74548C8.80885 2.63608 8.7474 2.48771 8.7474 2.333ZM12.2474 9.333C12.4021 9.333 12.5505 9.39446 12.6599 9.50385C12.7693 9.61325 12.8307 9.76162 12.8307 9.91633V10.4997C12.8307 10.9638 12.6464 11.4089 12.3182 11.7371C11.99 12.0653 11.5449 12.2497 11.0807 12.2497H9.33073C9.17602 12.2497 9.02765 12.1882 8.91825 12.0788C8.80885 11.9694 8.7474 11.821 8.7474 11.6663C8.7474 11.5116 8.80885 11.3632 8.91825 11.2539C9.02765 11.1445 9.17602 11.083 9.33073 11.083H11.0807C11.2354 11.083 11.3838 11.0215 11.4932 10.9121C11.6026 10.8027 11.6641 10.6544 11.6641 10.4997V9.91633C11.6641 9.76162 11.7255 9.61325 11.8349 9.50385C11.9443 9.39446 12.0927 9.333 12.2474 9.333ZM5.2474 6.41633C5.09269 6.41633 4.94431 6.47779 4.83492 6.58719C4.72552 6.69658 4.66406 6.84496 4.66406 6.99967C4.66406 7.15438 4.72552 7.30275 4.83492 7.41214C4.94431 7.52154 5.09269 7.583 5.2474 7.583H5.24798C5.40269 7.583 5.55106 7.52154 5.66046 7.41214C5.76985 7.30275 5.83131 7.15438 5.83131 6.99967C5.83131 6.84496 5.76985 6.69658 5.66046 6.58719C5.55106 6.47779 5.40269 6.41633 5.24798 6.41633H5.2474Z" fill="#262626"/>
                  <path d="M9.32812 6.99919H12.2448M12.2448 6.99919L11.0781 5.83252M12.2448 6.99919L11.0781 8.16585" stroke="#262626" stroke-width="1.16667" stroke-linecap="round" stroke-linejoin="round"/>
               </svg>
               
               <span class="text-xs font-bold text-[#262626]" style="font-family: 'UniCredit';">
                   {{ oooParticipants[0].name }} is Out of Office until {{ oooParticipants[0].returnDate }}
                   <span *ngIf="oooParticipants.length > 1" class="font-normal">
                        and {{ oooParticipants.length - 1 }} others
                   </span>
               </span>
           </div>
      </div>

      <!-- Messages Thread -->
      <div class="flex-1 relative min-h-0 flex flex-col">
         <div #scrollContainer (scroll)="onScroll($event)" class="flex-1 overflow-y-auto message-list-scrollbar p-6 bg-white">
         <div class="flex flex-col gap-3 min-h-full justify-end">
            <ng-container *ngFor="let item of conversation.messages; let i = index">
                
                <!-- Unread Messages Separator -->
                <div *ngIf="isFirstUnread(item)" id="first-unread-separator" #unreadSeparator 
                    class="flex flex-col gap-4 pb-4 items-start self-stretch justify-end flex-1"
                    style="flex: 1 0 0;">
                    <div class="flex items-center w-full gap-[10px] justify-center">
                        <div class="h-px bg-[#007A91] flex-1"></div>
                        <div class="flex px-6 py-2 justify-center items-center gap-[10px] bg-white">
                             <span style="
                                color: #007A91;
                                font-feature-settings: 'liga' off, 'clig' off;
                                font-family: 'UniCredit';
                                font-size: 14px;
                                font-style: normal;
                                font-weight: 700;
                                line-height: normal;
                                text-transform: uppercase;
                             ">
                                {{ unreadCount }} NEW MESSAGES
                             </span>
                        </div>
                        <div class="h-px bg-[#007A91] flex-1"></div>
                    </div>
                </div>
                <div *ngIf="isSystem(item)" class="flex justify-center w-full my-2">
                    <!-- Forward Separator Style -->
                    <div *ngIf="asSystem(item).type === 'forward_separator'" 
                         class="inline-flex px-4 py-2 justify-center items-center rounded border border-[#666] bg-[#e6e6e6]">
                        <span class="text-[#262626] text-center text-sm font-bold uppercase leading-[16px]">
                            {{ formatSystemText(item) }}
                        </span>
                    </div>

                    <!-- Regular System Message Style -->
                    <div *ngIf="asSystem(item).type !== 'forward_separator'"
                         class="inline-flex px-3 py-1.5 justify-center items-center rounded border border-[#007A91] bg-[#E7F8FB] max-w-[90%]">
                        <span class="text-[#262626] text-center text-sm leading-[16px]">
                            {{ formatSystemText(item) }}
                        </span>
                    </div>
                </div>

                <!-- Chat Message -->
                <div *ngIf="!isSystem(item)" 
                     [id]="'message-' + asMessage(item).id"
                     class="flex w-full group relative"
                     [ngClass]="getIsOwn(item) ? 'justify-end' : 'justify-start'"
                >
                    <div class="max-w-[75%] border rounded p-3 transition-all"
                         [ngClass]="{
                            'bg-white border-[#007a91]': getIsOwn(item),
                            'bg-[#f5f5f5] border-[#909090]': !getIsOwn(item),
                            'shadow-md ring-1 ring-[#007A91]': highlightedMessageId === asMessage(item).id
                         }"
                    >
                        <div class="flex items-start justify-between gap-6 mb-3">
                            <span class="font-bold" [ngClass]="getIsOwn(item) ? 'text-[#007a91]' : 'text-[#262626]'">
                                <span [innerHTML]="highlight(getSender(item))"></span>
                            </span>
                            <div class="flex items-center gap-2">
                                <span class="text-[#262626] uppercase font-bold text-xs">{{ item.timestamp }}</span>
                                
                                <!-- Star/Todo Icon if marked -->
                                <div *ngIf="asMessage(item).isTodo" class="text-[#262626]">
                                    <app-icon name="todo" size="14"></app-icon>
                                </div>

                                <!-- Dropdown Menu -->
                                <app-dropdown-menu>
                                    <button trigger class="p-1 transition-colors duration-200 hover:text-[#007a91] text-[#262626] outline-none">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" class="text-current" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
                                    </button>
                                    <div items class="flex flex-col min-w-[180px]">
                                        <!-- Read / Unread -->
                                        <button class="flex items-center gap-2 px-3 py-3 cursor-pointer outline-none transition-colors hover:text-[#007a91] text-left w-full text-[#262626]">
                                            <div class="w-4 h-4 flex-shrink-0">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                  <path fill-rule="evenodd" clip-rule="evenodd" d="M7.9955 10.5C6.235 10.5 4.777 9.8215 3.251 8C4.2235 6.839 5.169 6.146 6.182 5.793C5.7625 6.2405 5.5005 6.838 5.5005 7.5C5.5005 8.8805 6.6195 10 7.9995 10C9.38 10 10.499 8.8805 10.499 7.5C10.499 6.845 10.242 6.2545 9.83 5.8085C10.8315 6.1705 11.7695 6.8685 12.751 8C11.1985 9.7895 9.756 10.5 7.9955 10.5ZM7.9995 7C8.276 7 8.4995 7.224 8.4995 7.5C8.4995 7.776 8.276 8 7.9995 8C7.724 8 7.4995 7.776 7.4995 7.5C7.4995 7.224 7.724 7 7.9995 7ZM8 0C3.582 0 0 3.582 0 8C0 12.4185 3.582 16 8 16C12.418 16 16 12.4185 16 8C16 3.582 12.418 0 8 0Z" fill="currentColor"/>
                                                </svg>
                                            </div>
                                            <span class="uppercase font-bold text-sm">Mark as unread</span>
                                        </button>

                                        <!-- Mark as To Do -->
                                        <button class="flex items-center gap-2 px-3 py-3 cursor-pointer outline-none transition-colors hover:text-[#007a91] text-left w-full text-[#262626]"
                                                (click)="toggleTodoStatus(asMessage(item).id)">
                                            <div class="w-4 h-4 flex-shrink-0">
                                                <app-icon name="todo" size="14"></app-icon>
                                            </div>
                                            <span class="uppercase font-bold text-sm">
                                                {{ asMessage(item).isTodo ? 'Unmark as to do' : 'Mark as to do' }}
                                            </span>
                                        </button>

                                        <!-- Reply -->
                                        <button (click)="onReplyMessage(asMessage(item))" class="flex items-center gap-2 px-3 py-3 cursor-pointer outline-none transition-colors hover:text-[#007a91] text-left w-full text-[#262626]">
                                            <div class="w-4 h-4 flex-shrink-0">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                  <path fill-rule="evenodd" clip-rule="evenodd" d="M10.5982 2C11.4673 2.80138 11.4673 4.10188 10.5982 4.904L7.45155 8L10.5982 11.096C11.4673 11.8981 11.4673 13.1979 10.5982 14L4.5 8L10.5982 2Z" fill="currentColor"/>
                                                </svg>
                                            </div>
                                            <span class="uppercase font-bold text-sm">Reply</span>
                                        </button>

                                        <!-- Delete for All (Sent Only) -->
                                        <button *ngIf="getIsOwn(item)" 
                                                class="flex items-center gap-2 px-3 py-3 cursor-pointer outline-none transition-colors hover:text-[#007a91] text-left w-full text-[#262626]">
                                            <div class="w-4 h-4 flex-shrink-0">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                  <path fill-rule="evenodd" clip-rule="evenodd" d="M9.5 1H12.523C13.508 1 14 2 14 2.5V3H2V2.5C2 2 2.492 1 3.477 1H6.5L7 0H9L9.5 1ZM4.84017 16C4.32017 16 3.88667 15.6015 3.84367 15.083L2.92017 4H12.9202L11.9962 15.083C11.9532 15.6015 11.5202 16 11.0002 16H4.84017Z" fill="currentColor"/>
                                                </svg>
                                            </div>
                                            <span class="uppercase font-bold text-sm">Delete for all</span>
                                        </button>
                                    </div>
                                </app-dropdown-menu>
                            </div>
                        </div>
                        
                        <!-- Replied To Content -->
                        <div *ngIf="asMessage(item).replyTo" 
                             (click)="scrollToMessage(asMessage(item).replyTo!.id)"
                             class="mb-3 p-4 flex flex-col gap-2 rounded bg-white border border-[#007A91] self-stretch cursor-pointer hover:bg-[#f0f9fb] transition-colors duration-200">
                            <div class="flex items-center justify-between mb-1">
                                <span class="text-[#262626] text-sm font-bold uppercase">{{ asMessage(item).replyTo?.sender }}</span>
                                <span class="text-[#666] text-xs">{{ asMessage(item).replyTo?.timestamp }}</span>
                            </div>
                            <div class="text-[#262626] text-sm opacity-90 transition-all duration-300 break-words whitespace-pre-wrap"
                                 [ngClass]="asMessage(item).isReplyExpanded ? '' : 'line-clamp-1'"
                                 [innerHTML]="asMessage(item).replyTo?.content">
                            </div>
                            <!-- Read More Button -->
                            <button *ngIf="shouldShowReadMore(asMessage(item).replyTo?.content)" 
                                    (click)="$event.stopPropagation(); toggleReplyExpand(asMessage(item))"
                                    class="flex items-center gap-1 text-[#007A91] text-xs font-bold uppercase mt-1 self-end hover:opacity-80 transition-opacity">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                  <path fill-rule="evenodd" clip-rule="evenodd" d="M7.9955 10.5C6.235 10.5 4.777 9.8215 3.251 8C4.2235 6.839 5.169 6.146 6.182 5.793C5.7625 6.2405 5.5005 6.838 5.5005 7.5C5.5005 8.8805 6.6195 10 7.9995 10C9.38 10 10.499 8.8805 10.499 7.5C10.499 6.845 10.242 6.2545 9.83 5.8085C10.8315 6.1705 11.7695 6.8685 12.751 8C11.1985 9.7895 9.756 10.5 7.9955 10.5M7.9995 7C8.276 7 8.4995 7.224 8.4995 7.5C8.4995 7.776 8.276 8 7.9995 8C7.724 8 7.4995 7.776 7.4995 7.5C7.4995 7.224 7.724 7 7.9995 7M8 0C3.582 0 0 3.582 0 8C0 12.4185 3.582 16 8 16C12.418 16 16 12.4185 16 8C16 3.582 12.418 0 8 0" fill="currentColor"/>
                                </svg>
                                {{ asMessage(item).isReplyExpanded ? 'Read Less' : 'Read More' }}
                            </button>
                        </div>

                        <div class="text-[#262626] leading-relaxed rich-text-content break-words whitespace-pre-wrap cursor-text select-text">
                            <div [innerHTML]="getContent(item) | highlightSearch:searchQuery"></div>
                        </div>

                        <!-- Attachments Section -->
                        <app-attachment-strip 
                            *ngIf="asMessage(item).attachments?.length"
                            [attachments]="asMessage(item).attachments || []" 
                            [maxVisible]="2"
                            class="mt-3 block"
                            (action)="handleAttachmentAction($event)"
                        ></app-attachment-strip>
                    </div>
                </div>

            </ng-container>
            <div #scrollBottom></div>
         </div>
      </div>
      <button *ngIf="showScrollButton"
           (click)="scrollToNewest()"
           class="absolute bottom-10 right-6 z-20 cursor-pointer transition-opacity duration-200 outline-none hover:bg-gray-50 bg-white"
           style="
              display: inline-flex;
              padding: 8px 12px;
              justify-content: center;
              align-items: center;
              gap: 8px;
              border-radius: 8px;
              box-shadow: 2px 2px 7px 0 rgba(0, 0, 0, 0.25);
           ">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="15" viewBox="0 0 14 15" fill="none">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M12.8346 8.60003C12.0296 7.8487 10.723 7.8487 9.91797 8.60003L8.03264 10.3601V0.0444789L5.97075 0.0437012V10.3601L4.08464 8.60003C3.27964 7.8487 1.97452 7.8487 1.16797 8.60003L7.0013 14.0437L12.8346 8.60003Z" fill="#262626"/>
          </svg>
          <span style="
              color: #262626;
              font-feature-settings: 'liga' off, 'clig' off;
              font-family: UniCredit;
              font-size: 12px;
              font-style: normal;
              font-weight: 700;
              line-height: normal;
              text-transform: uppercase;
          ">SEE THE NEWEST</span>
      </button>
      </div>

      <!-- User Removed Placeholder -->
      <div *ngIf="conversation.isUserRemoved" 
           class="border-t border-[#e6e6e6] bg-[#f5f5f5] w-full py-3"
           style="
              display: flex;
              justify-content: center;
              align-items: center;
              color: #262626;
              font-family: UniCredit;
              font-size: 16px;
              font-style: normal;
              font-weight: 700;
              line-height: 24px;
           ">
           You can no longer send messages
      </div>

      <!-- Composer -->
      <div *ngIf="!conversation.isUserRemoved" 
           class="border-t border-[#e6e6e6] bg-white relative group"
           (dragover)="onDragOver($event)"
           (dragleave)="onDragLeave($event)"
           (drop)="onDrop($event)">
           
           <input #fileInput type="file" multiple class="hidden" (change)="onFileSelected($event)">

           <!-- Dropzone Overlay -->
            <div *ngIf="isDragging" 
                 class="absolute inset-0 z-50 bg-white/90 flex flex-col items-center justify-center border-2 border-dashed border-[#007a91] m-2 rounded"
                 (dragover)="$event.preventDefault(); $event.stopPropagation()"
                 (dragleave)="isDragging = false"
                 (drop)="onDrop($event)">
                <app-icon name="upload" size="48" class="text-[#007a91] mb-2 pointer-events-none"></app-icon>
                <span class="text-[#007a91] font-bold text-lg pointer-events-none">Drop your files here</span>
            </div>
          <!-- OOO Banner -->
          <div *ngIf="oooParticipants.length > 0 && !isEditMembersMode && !isOOOBannerDismissed" 
               class="flex items-center justify-between mx-4 mt-2 mb-1 animate-fadeIn"
               style="padding: 4px 12px; border-radius: 4px; background-color: #FBE1F7; border: 1px solid #A33694;">
               
               <div class="flex items-center gap-2">
                   <!-- Icon -->
                   <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path fill-rule="evenodd" clip-rule="evenodd" d="M5.91123 1.05842C6.17251 0.980035 6.4485 0.963821 6.71716 1.01107C6.98582 1.05831 7.23972 1.16771 7.45859 1.33053C7.67745 1.49335 7.85523 1.70507 7.97771 1.94881C8.1002 2.19255 8.16402 2.46155 8.16406 2.73433V11.265C8.16402 11.5378 8.1002 11.8068 7.97771 12.0505C7.85523 12.2943 7.67745 12.506 7.45859 12.6688C7.23972 12.8316 6.98582 12.941 6.71716 12.9883C6.4485 13.0355 6.17251 13.0193 5.91123 12.9409L2.41123 11.8909C2.05079 11.7828 1.7348 11.5614 1.51014 11.2595C1.28549 10.9576 1.16412 10.5913 1.16406 10.215V3.78433C1.16412 3.40802 1.28549 3.04176 1.51014 2.73987C1.7348 2.43797 2.05079 2.21654 2.41123 2.10842L5.91123 1.05842ZM8.7474 2.333C8.7474 2.17829 8.80885 2.02992 8.91825 1.92052C9.02765 1.81112 9.17602 1.74967 9.33073 1.74967H11.0807C11.5449 1.74967 11.99 1.93404 12.3182 2.26223C12.6464 2.59042 12.8307 3.03554 12.8307 3.49967V4.083C12.8307 4.23771 12.7693 4.38608 12.6599 4.49548C12.5505 4.60487 12.4021 4.66633 12.2474 4.66633C12.0927 4.66633 11.9443 4.60487 11.8349 4.49548C11.7255 4.38608 11.6641 4.23771 11.6641 4.083V3.49967C11.6641 3.34496 11.6026 3.19658 11.4932 3.08719C11.3838 2.97779 11.2354 2.91633 11.0807 2.91633H9.33073C9.17602 2.91633 9.02765 2.85487 8.91825 2.74548C8.80885 2.63608 8.7474 2.48771 8.7474 2.333ZM12.2474 9.333C12.4021 9.333 12.5505 9.39446 12.6599 9.50385C12.7693 9.61325 12.8307 9.76162 12.8307 9.91633V10.4997C12.8307 10.9638 12.6464 11.4089 12.3182 11.7371C11.99 12.0653 11.5449 12.2497 11.0807 12.2497H9.33073C9.17602 12.2497 9.02765 12.1882 8.91825 12.0788C8.80885 11.9694 8.7474 11.821 8.7474 11.6663C8.7474 11.5116 8.80885 11.3632 8.91825 11.2539C9.02765 11.1445 9.17602 11.083 9.33073 11.083H11.0807C11.2354 11.083 11.3838 11.0215 11.4932 10.9121C11.6026 10.8027 11.6641 10.6544 11.6641 10.4997V9.91633C11.6641 9.76162 11.7255 9.61325 11.8349 9.50385C11.9443 9.39446 12.0927 9.333 12.2474 9.333ZM5.2474 6.41633C5.09269 6.41633 4.94431 6.47779 4.83492 6.58719C4.72552 6.69658 4.66406 6.84496 4.66406 6.99967C4.66406 7.15438 4.72552 7.30275 4.83492 7.41214C4.94431 7.52154 5.09269 7.583 5.2474 7.583H5.24798C5.40269 7.583 5.55106 7.52154 5.66046 7.41214C5.76985 7.30275 5.83131 7.15438 5.83131 6.99967C5.83131 6.84496 5.76985 6.69658 5.66046 6.58719C5.55106 6.47779 5.40269 6.41633 5.24798 6.41633H5.2474Z" fill="#262626"/>
                      <path d="M9.32812 6.99919H12.2448M12.2448 6.99919L11.0781 5.83252M12.2448 6.99919L11.0781 8.16585" stroke="#262626" stroke-width="1.16667" stroke-linecap="round" stroke-linejoin="round"/>
                   </svg>
                   
                   <span class="text-xs font-bold text-[#262626]" style="font-family: 'UniCredit';">
                       {{ oooParticipants[0].name }} is Out of Office until {{ oooParticipants[0].returnDate }}
                       <span *ngIf="oooParticipants.length > 1" class="font-normal">
                            and {{ oooParticipants.length - 1 }} others
                       </span>
                   </span>
               </div>
               
               <button (click)="isOOOBannerDismissed = true" class="text-[#262626] hover:text-black outline-none flex items-center justify-center w-6 h-6 ml-2 cursor-pointer">
                   <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                       <line x1="18" y1="6" x2="6" y2="18"></line>
                       <line x1="6" y1="6" x2="18" y2="18"></line>
                   </svg>
               </button>
          </div>

          <div class="p-4 pt-2">
          <div class="flex items-end gap-3 translate-y-[-2px]">
             <div class="flex-1 flex flex-col gap-3 min-w-0">
                 <app-rich-text-editor 
                    class="w-full"
                    placeholder="Type your message or drag a document"
                    [content]="draftContent"
                    [replyTo]="replyingToMessage"
                    (enterPressed)="sendMessage()"
                    (contentChange)="handleDraftChange($event)"
                    (cancelReply)="cancelReply()"
                    (attachmentClick)="triggerFileSelection()"
                 ></app-rich-text-editor>

                 <!-- Composer Attachments List -->
                 <div *ngIf="attachments.length > 0" class="flex flex-wrap gap-2 items-stretch">
                     <ng-container *ngFor="let att of attachments | slice:0:2">
                        <div class="flex items-center gap-3 p-2 rounded border border-[#CCC] bg-white min-w-[200px] max-w-[300px] relative">
                            <!-- Helper for loading state if needed, mocked via uploadingFiles set -->
                            <div *ngIf="uploadingFiles.has(att.id)" class="absolute inset-0 bg-white/60 flex items-center justify-center z-10">
                                <div class="w-5 h-5 border-2 border-[#007a91] border-t-transparent rounded-full animate-spin"></div>
                            </div>

                            <div class="shrink-0 text-[#262626]">
                                <app-icon [name]="att.category === 'image' ? 'file-image' : 'file-document'" size="16"></app-icon>
                            </div>
                            
                            <div class="flex flex-col min-w-0">
                                <span class="text-[#262626] font-bold text-sm uppercase truncate" 
                                      [title]="att.name"
                                      style="font-family: 'UniCredit'; line-height: normal;">
                                    {{ att.name }}
                                </span>
                                <div class="flex items-center gap-2 text-[#262626] text-sm" 
                                     style="font-family: 'UniCredit'; line-height: 24px;">
                                    <span>{{ att.type }}</span>
                                    <div class="w-px h-3 bg-[#ccc]"></div>
                                    <span>{{ att.size }}</span>
                                </div>
                            </div>

                            <button (click)="removeAttachment(att.id)" 
                                    class="ml-auto p-1 hover:text-[#ec6608] text-[#909090] transition-colors outline-none cursor-pointer">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>
                        </div>
                     </ng-container>

                     <!-- Overflow Counter -->
                     <div *ngIf="attachments.length > 2" class="relative flex">
                         <app-dropdown-menu position="top" #overflowComposerMenu [minWidth]="320" class="flex h-full">
                             <button trigger class="flex items-center gap-2 p-2 rounded border border-[#CCC] bg-white group hover:border-[#007a91] transition-all h-full outline-none cursor-pointer">
                                 <app-icon name="file-document" size="16"></app-icon>
                                 <span class="font-bold text-[#262626] text-sm" style="font-family: 'UniCredit'">+{{ attachments.length - 2 }}</span>
                                 <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" 
                                      class="transition-transform duration-300"
                                      [ngClass]="{'rotate-180 text-[#007a91]': overflowComposerMenu.isOpen, 'text-[#262626]': !overflowComposerMenu.isOpen}"
                                      stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                      <path d="m6 9 6 6 6-6"/>
                                 </svg>
                             </button>
                             <div items class="flex flex-col gap-2 p-2 w-[320px] max-h-[220px] overflow-y-auto hover-scrollbar mb-2 shadow-xl border border-[#e6e6e6]">
                                 <div *ngFor="let att of attachments | slice:2" 
                                      class="flex items-center gap-3 p-2 rounded border border-[#CCC] bg-white w-full relative"
                                 >
                                      <!-- Helper for loading state -->
                                    <div *ngIf="uploadingFiles.has(att.id)" class="absolute inset-0 bg-white/60 flex items-center justify-center z-10">
                                        <div class="w-4 h-4 border-2 border-[#007a91] border-t-transparent rounded-full animate-spin"></div>
                                    </div>

                                     <div class="shrink-0 text-[#262626]">
                                         <app-icon [name]="att.category === 'image' ? 'file-image' : 'file-document'" size="16"></app-icon>
                                     </div>
                                     
                                     <div class="flex flex-col min-w-0 flex-1">
                                         <span class="text-[#262626] font-bold text-sm uppercase truncate" 
                                               [title]="att.name"
                                               style="font-family: 'UniCredit'; line-height: normal;">
                                             {{ att.name }}
                                         </span>
                                         <div class="flex items-center gap-2 text-[#262626] text-sm" 
                                              style="font-family: 'UniCredit'; line-height: 24px;">
                                             <span>{{ att.type }}</span>
                                             <div class="w-px h-3 bg-[#ccc]"></div>
                                             <span>{{ att.size }}</span>
                                         </div>
                                     </div>

                                     <button (click)="removeAttachment(att.id)" 
                                            class="ml-auto p-1 hover:text-[#ec6608] text-[#909090] transition-colors outline-none cursor-pointer">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                            <line x1="18" y1="6" x2="6" y2="18"></line>
                                            <line x1="6" y1="6" x2="18" y2="18"></line>
                                        </svg>
                                    </button>
                                 </div>
                             </div>
                         </app-dropdown-menu>
                     </div>
                 </div>
             </div>
              
              <button (click)="sendMessage()" 
                      [disabled]="uploadingFiles.size > 0"
                      [ngClass]="{'opacity-50 cursor-not-allowed': uploadingFiles.size > 0}"
                      class="w-11 h-11 rounded-full bg-[#007a91] hover:bg-[#006577] flex items-center justify-center transition-all duration-200 ease-out shrink-0 mb-[2px] active:scale-95 shadow-md hover:shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" class="text-white">
                   <path d="M22 2L11 13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                   <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
          </div>
      </div>

    </div>

    <!-- REMOVE PARTICIPANT MODAL -->
    <div *ngIf="participantToRemove" class="fixed inset-0 bg-black/50 z-[1000] flex items-center justify-center">
        <div class="bg-white rounded-[4px] p-6 flex flex-col items-center shadow-2xl relative" 
             style="width: 800px; min-height: 331px;">
            
            <!-- Warning Icon -->
            <div class="mb-8 mt-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80" fill="none">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M0 40C0 17.9075 17.91 0 40 0C62.0925 0 80 17.9075 80 40C80 62.09 62.0925 80 40 80C17.91 80 0 62.09 0 40ZM5 40C5 59.3275 20.67 75 40 75C59.3325 75 75 59.3275 75 40C75 20.67 59.3325 5 40 5C20.67 5 5 20.67 5 40ZM32.0833 38.8333C32.0833 35.888 34.4713 33.5 37.4167 33.5V41.5C37.4167 44.4453 35.0287 46.8333 32.0833 46.8333V38.8333ZM52.0833 50.8333V40.1667C52.0833 33.5387 46.7113 28.1667 40.0833 28.1667C33.4553 28.1667 28.0833 33.5387 28.0833 40.1667V50.8333H52.0833ZM56.0833 57.5H24.0833V53.5H56.0833V57.5ZM41.4167 22.8333H38.75V17.5H41.4167V22.8333ZM61.4167 38.8333H56.0833V36.1667H61.4167V38.8333ZM26.5807 22.3173L29.9553 26.4467L27.8913 28.1347L24.5153 24.0053L26.5807 22.3173ZM55.6513 24.0053L52.2753 28.1347L50.2113 26.4467L53.5873 22.3173L55.6513 24.0053ZM24.0833 38.8333H18.75V36.1667H24.0833V38.8333Z" fill="#EC6608"/>
                </svg>
            </div>

            <!-- Title -->
            <h3 class="text-[#262626] text-center mb-1"
                style="font-family: 'UniCredit'; font-size: 20px; font-weight: 700; line-height: normal;">
                Are you sure you want to remove {{ participantToRemove }} from the conversation?
            </h3>

            <!-- Subtitle -->
            <p class="text-[#262626] text-center mb-10"
               style="font-family: 'UniCredit'; font-size: 18px; font-weight: 400; line-height: normal;">
                These will still have access to the chat history.
            </p>
            
            <!-- Actions -->
            <div class="flex justify-between w-full mt-auto">
                <button (click)="cancelRemoveParticipant()" 
                        class="flex flex-col justify-center items-center py-[12px] w-[160px] bg-white text-[#262626] font-bold rounded-[4px] hover:bg-gray-50 border-2 border-[#262626]"
                        style="font-family: 'UniCredit'; font-feature-settings: 'liga' off, 'clig' off; font-size: 16px; font-weight: 700; line-height: 22px;">
                    Cancel
                </button>
                <button (click)="confirmRemoveParticipant()" 
                        class="flex flex-col justify-center items-center py-[12px] w-[160px] bg-[#007A91] text-white font-bold rounded-[4px] hover:bg-[#006577]"
                        style="font-family: 'UniCredit'; font-feature-settings: 'liga' off, 'clig' off; font-size: 16px; font-weight: 700; line-height: 22px;">
                    Remove
                </button>
            </div>
        </div>
    </div>
  `
})
export class ConversationDetailComponent implements OnChanges, AfterViewChecked {
    showScrollButton = false;
    @ViewChild('scrollContainer') private scrollContainer!: ElementRef;
    @Input() messageId: string | null = null;
    @Input() searchQuery: string = '';
    @Input() folder: string | undefined = 'Inbox';
    @Output() todoStatusChange = new EventEmitter<{ id: string, hasTodo: boolean }>();
    @Output() wasReadUntilEnd = new EventEmitter<string>();
    @Output() markUnread = new EventEmitter<string>();
    @Output() deleteConversation = new EventEmitter<string>();
    @Output() restoreConversation = new EventEmitter<string>();

    @ViewChild('unreadSeparator') unreadSeparator!: ElementRef;
    @ViewChild('scrollBottom') scrollBottom!: ElementRef;
    @ViewChild('memberInput') memberInput!: ElementRef;

    conversation: ConversationData | null = null;

    // Edit Members State
    isEditMembersMode = false;
    draftParticipants: string[] = [];
    memberSearchQuery = '';
    showMemberSuggestions = false;
    participantToRemove: string | null = null;
    groupedSuggestions = {
        portfolio: [] as any[],
        otherBank: [] as any[]
    };

    get hasNewParticipants(): boolean {
        if (!this.conversation || !this.conversation.participantsList) return false;
        return this.draftParticipants.some(p => !this.conversation!.participantsList.includes(p));
    }

    draftContent: string = '';
    highlightedMessageId: string | null = null;
    isMemberDropdownOpen = false;
    replyingToMessage: ConversationMessage | null = null;
    isOOOBannerDismissed = false;

    // Attachment State
    isDragging = false;
    attachments: Attachment[] = [];
    uploadingFiles = new Set<string>(); // Set of names or IDs
    @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

    constructor(
        private messagesService: MessagesService,
        private participantService: ParticipantService,
        private router: Router,
        private notificationService: NotificationService,
        private sanitizer: DomSanitizer
    ) { }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['messageId']) {
            this.isOOOBannerDismissed = false;
            if (this.messageId) {
                this.loadConversation(this.messageId);
                // Restore draft from service
                this.draftContent = this.messagesService.getDraft(this.messageId);
            } else {
                this.conversation = null;
                this.draftContent = '';
            }
        }
    }

    ngAfterViewChecked() {
    }

    loadConversation(id: string) {
        this.messagesService.getConversation(id).subscribe(data => {
            this.conversation = data;
            this.handleInitialScroll();
        });
    }

    isFirstUnread(item: ConversationItem): boolean {
        if (!this.conversation || !this.conversation.messages || this.unreadCount === 0) return false;
        const index = this.conversation.messages.indexOf(item);
        const firstUnreadIndex = this.conversation.messages.length - this.unreadCount;
        return index === firstUnreadIndex;
    }

    handleInitialScroll() {
        this.showScrollButton = false;
        setTimeout(() => {
            const separator = document.getElementById('first-unread-separator');
            if (separator) {
                separator.scrollIntoView({ behavior: 'auto', block: 'center' });
            } else if (this.scrollContainer) {
                this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
            }
        }, 100);
    }

    get unreadCount(): number {
        if (!this.conversation) return 0;
        // Prioritize explicit unreadCount from data if available (for mock/testing)
        if ((this.conversation as any).unreadCount !== undefined) {
            return (this.conversation as any).unreadCount;
        }
        return this.conversation.messages.filter(m => !isSystemMessage(m) && (m as ConversationMessage).isRead === false).length;
    }


    get todoMessages(): ConversationMessage[] {
        if (!this.conversation) return [];
        return this.conversation.messages
            .filter((item): item is ConversationMessage => !this.isSystem(item) && !!(item as ConversationMessage).isTodo);
    }

    isSystem(item: ConversationItem): boolean {
        return isSystemMessage(item);
    }

    asMessage(item: ConversationItem): ConversationMessage {
        return item as ConversationMessage;
    }

    asSystem(item: ConversationItem): SystemMessage {
        return item as SystemMessage;
    }

    formatSystemText(item: any): string {
        const { type, actor, targetUser, organization } = item;
        const pronoun = this.getGenderPronoun(targetUser);

        switch (type) {
            case 'member_added':
                if (actor === 'System') return `${targetUser} has been added to the conversation`;
                return `${actor} added ${targetUser} to the conversation`;
            case 'member_removed':
                return `${actor} removed ${targetUser} from the conversation`;
            case 'you_were_added':
                return `${actor} added You to the conversation`;
            case 'you_were_removed':
                return `${actor} removed You from the conversation`;
            case 'member_left_org':
                return `${targetUser} was removed from the conversation because ${pronoun} is no longer part of ${organization}`;
            case 'you_left_org':
                return `You were removed from the conversation because you are no longer part of ${organization}`;
            case 'banker_replaced':
                return `${targetUser} was removed from the conversation as ${pronoun} is no longer assigned to organisation`;
            case 'forward_separator':
                return 'FORWARDED MESSAGES ABOVE';
            default:
                return 'System notification';
        }
    }

    getGenderPronoun(name: string): string {
        const femaleEndings = ['a', 'ia', 'na', 'la', 'cia', 'sia'];
        const lowerName = name.toLowerCase();
        // Check first name (split by space)
        const firstName = lowerName.split(' ')[0];
        if (femaleEndings.some(ending => firstName.endsWith(ending))) {
            return 'she';
        }
        return 'he';
    }

    onForwardConversation() {
        if (this.messageId) {
            this.router.navigate(['/messages/forward', this.messageId]);
        }
    }


    getMemberIconName(name: string): string {
        const bankTerms = ['unicredit', 'wilson thomas', 'rossi mario'];
        const lower = name.toLowerCase();
        if (bankTerms.some(term => lower.includes(term))) return 'member-bank';
        if (name.length % 5 === 0 && !lower.includes('(you)')) return 'member-bank';
        return 'member-client';
    }

    get sortedParticipants(): string[] {
        if (!this.conversation?.participantsList) return [];
        return [...this.conversation.participantsList].sort((a, b) => a.localeCompare(b));
    }

    get hasParticipantMatch(): boolean {
        if (!this.searchQuery || !this.conversation?.participantsList) return false;
        const query = this.searchQuery.toLowerCase();
        return this.conversation.participantsList.some(p => p.toLowerCase().includes(query));
    }

    highlightMember(name: string): string {
        return highlightText(name, this.searchQuery);
    }

    getContent(item: ConversationItem): string {
        if (!isSystemMessage(item)) {
            return (item as any).content || '';
        }
        return '';
    }

    getSender(item: ConversationItem): string {
        if (!isSystemMessage(item)) {
            return (item as any).sender || '';
        }
        return '';
    }

    getIsOwn(item: ConversationItem): boolean {
        if (!isSystemMessage(item)) {
            return !!(item as any).isOwn;
        }
        return false;
    }

    highlight(text: string | undefined): string {
        return highlightText(text, this.searchQuery);
    }



    scrollToMessage(id: string) {
        this.highlightedMessageId = id;
        setTimeout(() => {
            const el = document.getElementById('message-' + id);
            if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            setTimeout(() => this.highlightedMessageId = null, 3000);
        }, 100);
    }

    onScroll(event: any): void {
        const element = event.target;
        // Show button if we are not at the bottom (threshold 100px)
        const atBottom = element.scrollHeight - element.scrollTop <= element.clientHeight + 10;
        this.showScrollButton = !atBottom;

        if (atBottom && this.messageId) {
            this.wasReadUntilEnd.emit(this.messageId);
        }
    }

    scrollToNewest(): void {
        if (this.scrollContainer) {
            this.scrollContainer.nativeElement.scrollTo({ top: this.scrollContainer.nativeElement.scrollHeight, behavior: 'smooth' });
        }
    }

    toggleTodoStatus(id: string) {
        if (!this.messageId) return;
        this.messagesService.toggleMessageTodo(this.messageId, id);
    }

    @ViewChild(RichTextEditorComponent) richTextEditor!: RichTextEditorComponent;

    handleDraftChange(content: string) {
        this.draftContent = content;
        if (this.messageId) {
            this.messagesService.setDraft(this.messageId, content);
        }
    }

    sendMessage() {
        if ((!this.draftContent || !this.draftContent.trim()) && this.attachments.length === 0) return;
        if (!this.conversation || !this.messageId) return;
        if (this.uploadingFiles.size > 0) return;

        const newMessage: ConversationMessage = {
            id: `msg-${Date.now()}`,
            sender: 'You',
            content: this.draftContent,
            attachments: [...this.attachments],
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
            isOwn: true,
            isTodo: false,
            replyTo: this.replyingToMessage ? { ...this.replyingToMessage } : undefined
        };

        this.conversation.messages = [...this.conversation.messages, newMessage];

        // Clear local draft, service draft and reply state
        const id = this.messageId;
        this.draftContent = '';
        this.replyingToMessage = null;
        this.messagesService.setDraft(id, '');
        this.attachments = [];

        if (this.richTextEditor) {
            this.richTextEditor.clear();
        }

        // Scroll to bottom
        setTimeout(() => {
            if (this.scrollBottom) {
                this.scrollBottom.nativeElement.scrollIntoView({ behavior: 'smooth' });
            }
        }, 100);
    }

    onReplyMessage(message: ConversationMessage) {
        this.replyingToMessage = message;
        if (this.richTextEditor) {
            this.richTextEditor.focus();
        }
    }

    cancelReply() {
        this.replyingToMessage = null;
    }

    // Attachment Handlers
    triggerFileSelection() {
        this.fileInput.nativeElement.click();
    }

    onFileSelected(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files) {
            this.processFiles(input.files);
        }
        input.value = ''; // Reset
    }

    processFiles(fileList: FileList) {
        const files = Array.from(fileList);
        const MAX_SIZE = 20 * 1024 * 1024; // 20MB
        let hasError = false;

        files.forEach(file => {
            if (file.size > MAX_SIZE) {
                hasError = true;
                return;
            }

            // Allowed types: PDF, DOC/DOCX, XLS/XLSX, TXT, images
            // In a real app we'd validate MIME types strictly. For now, we accept all valid size files per requirements.

            const attachment: Attachment = {
                id: `att-${Date.now()}-${file.name}`,
                name: file.name,
                type: file.name.split('.').pop()?.toUpperCase() || 'FILE',
                size: this.formatBytes(file.size),
                category: file.type.startsWith('image/') ? 'image' : 'document',
                url: URL.createObjectURL(file) // Mock URL for local preview logic if needed
            };

            // Simulate Upload
            this.uploadingFiles.add(attachment.id);
            this.attachments.push(attachment);

            // Mock Upload Delay
            setTimeout(() => {
                this.uploadingFiles.delete(attachment.id);
            }, 1000 + Math.random() * 2000);
        });

        if (hasError) {
            this.notificationService.showError(
                'You have exceeded the maximum size.',
                'The maximum size for attachments is 20MB.'
            );
        }
    }

    removeAttachment(id: string) {
        this.attachments = this.attachments.filter(a => a.id !== id);
        this.uploadingFiles.delete(id);
    }

    onDragOver(event: DragEvent) {
        event.preventDefault();
        event.stopPropagation();
        if (event.dataTransfer) {
            event.dataTransfer.dropEffect = 'copy';
            this.isDragging = true;
        }
    }

    onDragLeave(event: DragEvent) {
        event.preventDefault();
        event.stopPropagation();

        // Only disable if leaving the main container
        const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
        if (
            event.clientX <= rect.left ||
            event.clientX >= rect.right ||
            event.clientY <= rect.top ||
            event.clientY >= rect.bottom
        ) {
            this.isDragging = false;
        }
    }

    onDrop(event: DragEvent) {
        event.preventDefault();
        event.stopPropagation();
        this.isDragging = false;

        if (event.dataTransfer && event.dataTransfer.files.length > 0) {
            this.processFiles(event.dataTransfer.files);
        }
    }

    private formatBytes(bytes: number, decimals = 2) {
        if (!+bytes) return '0 B';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
    }

    toggleReplyExpand(message: ConversationMessage) {
        message.isReplyExpanded = !message.isReplyExpanded;
    }

    shouldShowReadMore(content: string | undefined): boolean {
        if (!content) return false;
        // Simple heuristic: if content has many chars or multiple lines
        return content.length > 200 || content.includes('<br>') || content.includes('</div>');
    }

    showOOOBanner = true;

    isMemberOOO(name: string): boolean {
        const r = this.participantService.getRecipientByName(name);
        return !!r?.outOfOffice?.isOoo;
    }

    getMemberOOODate(name: string): string {
        const r = this.participantService.getRecipientByName(name);
        return r?.outOfOffice?.returnDate || '';
    }

    get oooParticipants(): { name: string, returnDate: string }[] {
        if (!this.conversation?.participantsList) return [];
        return this.conversation.participantsList
            .filter(name => this.isMemberOOO(name))
            .map(name => ({
                name,
                returnDate: this.getMemberOOODate(name)
            }));
    }

    get oooBannerText(): string {
        const ooo = this.oooParticipants;
        if (ooo.length === 0) return '';

        if (ooo.length === 1) {
            const p = ooo[0];
            // Remove (You) for cleaner display
            const name = p.name.replace(' (You)', '').trim();
            return `${name} Out of office: Returning ${p.returnDate}`;
        } else {
            // Multiple users
            const names = ooo.map(p => p.name.replace(' (You)', '').trim()).join(', ');
            return `${names} Out of office`;
        }
    }

    dismissOOOBanner() {
        this.showOOOBanner = false;
    }

    getConversationCompanies(): string[] {
        if (!this.conversation || !this.conversation.participantsList) {
            return [];
        }

        return this.participantService.getCompaniesFromParticipants(this.conversation.participantsList);
    }

    // =================================================================================================
    // EDIT MEMBERS LOGIC
    // =================================================================================================

    startEditMembers() {
        if (!this.conversation) return;
        this.isEditMembersMode = true;
        this.isMemberDropdownOpen = false; // Close the dropdown
        this.draftParticipants = [...(this.conversation.participantsList || [])];
    }

    cancelEditMembers() {
        this.isEditMembersMode = false;
        this.draftParticipants = [];
        this.memberSearchQuery = '';
    }

    saveEditMembers() {
        if (!this.conversation) return;

        const original = this.conversation.participantsList || [];
        const current = this.draftParticipants;

        // Find added
        const added = current.filter(p => !original.includes(p));
        // Find removed
        const removed = original.filter(p => !current.includes(p));

        if (added.length === 0 && removed.length === 0) {
            this.isEditMembersMode = false;
            return;
        }

        // Apply changes
        this.conversation.participantsList = [...current];

        // Generate System Messages
        const currentUser = 'White Dan'; // Mock current user

        removed.forEach(name => {
            const msg: SystemMessage = {
                id: `sys-${Date.now()}-${Math.random()}`,
                type: 'member_removed',
                actor: currentUser,
                targetUser: name,
                timestamp: new Date().toLocaleTimeString(),
                organization: 'UniCredit'
            };
            this.conversation!.messages.push(msg);
        });

        added.forEach(name => {
            const msg: SystemMessage = {
                id: `sys-${Date.now()}-${Math.random()}`,
                type: 'member_added',
                actor: currentUser,
                targetUser: name,
                timestamp: new Date().toLocaleTimeString(),
                organization: 'UniCredit'
            };
            this.conversation!.messages.push(msg);
        });

        // Scroll to bottom to see activity
        setTimeout(() => {
            if (this.scrollBottom) {
                this.scrollBottom.nativeElement.scrollIntoView({ behavior: 'smooth' });
            }
        }, 100);

        this.isEditMembersMode = false;
    }

    // Search & Add
    onMemberSearch() {
        const query = this.memberSearchQuery.toLowerCase().trim();
        if (!query) {
            this.showMemberSuggestions = false;
            return;
        }

        const result = mockRecipients.filter(r =>
            !this.draftParticipants.includes(r.name) &&
            (r.name.toLowerCase().includes(query) || r.role.toLowerCase().includes(query))
        );

        // Grouping
        this.groupedSuggestions.portfolio = [];
        this.groupedSuggestions.otherBank = [];

        result.forEach(r => {
            const type = this.participantService.getParticipantType(r.name);
            if (type === 'client') {
                this.groupedSuggestions.portfolio.push(r);
            } else {
                this.groupedSuggestions.otherBank.push(r);
            }
        });

        this.showMemberSuggestions = true;
    }

    onMemberInputFocus() {
        if (this.memberSearchQuery) {
            this.showMemberSuggestions = true;
        }
    }

    onMemberInputBlur() {
        setTimeout(() => {
            this.showMemberSuggestions = false;
        }, 200);
    }

    addParticipant(user: Recipient) {
        if (!this.draftParticipants.includes(user.name)) {
            this.draftParticipants.push(user.name);
        }
        this.memberSearchQuery = '';
        this.showMemberSuggestions = false;

        if (this.memberInput) {
            this.memberInput.nativeElement.focus();
        }
    }

    // Remove Flow
    requestRemoveParticipant(name: string) {
        this.participantToRemove = name;
    }

    confirmRemoveParticipant() {
        if (this.participantToRemove) {
            this.draftParticipants = this.draftParticipants.filter(p => p !== this.participantToRemove);
            this.participantToRemove = null;
        }
    }

    cancelRemoveParticipant() {
        this.participantToRemove = null;
    }

    // Member Picker Logic
    // Member Picker Logic
    showMemberPicker = false;

    toggleMemberPicker() {
        this.showMemberPicker = !this.showMemberPicker;
    }

    get allRecipients(): Recipient[] {
        return mockRecipients;
    }

    get draftParticipantIds(): string[] {
        // Convert names to IDs
        return this.draftParticipants
            .map(name => mockRecipients.find(r => r.name === name)?.id)
            .filter(id => !!id) as string[];
    }

    onMemberPickerApply(selectedIds: string[]) {
        // Convert IDs back to names (because current logic uses names)
        const selectedNames = selectedIds
            .map(id => mockRecipients.find(r => r.id === id)?.name)
            .filter(name => !!name) as string[];

        // Update draft participants, preserving ones that might not be in mockRecipients (if any)
        // But for now, we assume mockRecipients is the source of truth for the picker.
        // To be safe, we can union with existing ones that didn't match an ID? 
        // No, the picker is authoritative for the selection set.
        this.draftParticipants = selectedNames;
        this.showMemberPicker = false;
    }

    handleAttachmentAction(event: AttachmentAction) {
        console.log('Attachment action:', event.type, event.attachment);
    }
}
