import { Component, ElementRef, EventEmitter, Input, Output, ViewChild, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppIconComponent } from '@/app/shared/components/icons/app-icon.component';
import { trigger, transition, style, animate } from '@angular/animations';

import { ClickOutsideDirective } from '@/app/shared/directives/click-outside.directive';

@Component({
    selector: 'app-rich-text-editor',
    standalone: true,
    imports: [CommonModule, AppIconComponent, ClickOutsideDirective],
    template: `
    <div class="relative flex flex-col border border-unicredit-gray-divider rounded-md bg-white shadow-sm w-full">
      
      <!-- Reply Preview -->
      <div *ngIf="replyTo" class="mx-4 mt-4 mb-0 p-4 flex flex-col gap-2 rounded bg-unicredit-primary-light border border-unicredit-primary relative group/reply min-w-0">
          <div class="flex items-start justify-between min-w-0">
              <div class="flex-1 min-w-0 pr-10">
                  <div class="flex items-center justify-between mb-2">
                      <span class="text-unicredit-text text-sm font-bold">{{ replyTo.sender }}</span>
                      <span class="text-unicredit-text-secondary text-xs">{{ replyTo.timestamp }}</span>
                  </div>
                  <div class="text-unicredit-text text-sm opacity-90 break-words whitespace-pre-wrap transition-all duration-300 composer-scrollbar"
                       style="overflow-wrap: anywhere;"
                       [style.max-height]="isPreviewExpanded ? '150px' : '40px'"
                       [style.overflow-y]="isPreviewExpanded ? 'auto' : 'hidden'"
                       [ngClass]="isPreviewExpanded ? '' : 'line-clamp-2'"
                       [innerHTML]="replyTo.content">
                  </div>
              </div>
              <button (click)="cancelReply.emit(); isPreviewExpanded = false" class="text-unicredit-primary hover:text-unicredit-primary-hover transition-colors p-0.5 absolute top-4 right-4 z-10">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
          </div>
          <!-- Read More for Preview -->
          <button *ngIf="shouldShowReadMore(replyTo.content)" 
                  (click)="isPreviewExpanded = !isPreviewExpanded"
                  class="flex items-center gap-1 text-unicredit-primary text-xs font-bold uppercase mt-1 self-end hover:opacity-80 transition-opacity">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M7.9955 10.5C6.235 10.5 4.777 9.8215 3.251 8C4.2235 6.839 5.169 6.146 6.182 5.793C5.7625 6.2405 5.5005 6.838 5.5005 7.5C5.5005 8.8805 6.6195 10 7.9995 10C9.38 10 10.499 8.8805 10.499 7.5C10.499 6.845 10.242 6.2545 9.83 5.8085C10.8315 6.1705 11.7695 6.8685 12.751 8C11.1985 9.7895 9.756 10.5 7.9955 10.5M7.9995 7C8.276 7 8.4995 7.224 8.4995 7.5C8.4995 7.776 8.276 8 7.9995 8C7.724 8 7.4995 7.776 7.4995 7.5C7.4995 7.224 7.724 7 7.9995 7M8 0C3.582 0 0 3.582 0 8C0 12.4185 3.582 16 8 16C12.418 16 16 12.4185 16 8C16 3.582 12.418 0 8 0" fill="currentColor"/>
              </svg>
              {{ isPreviewExpanded ? 'Read Less' : 'Read More' }}
          </button>
      </div>
      
      <!-- Toolbar -->
      <div *ngIf="showToolbar || !isEmpty"
           [@toolbarAnimation]
           class="flex items-center gap-1 px-3 py-2 border-b border-unicredit-gray bg-white">

        <!-- 1. Bold -->
        <button (click)="execCommand('bold')"
                [class.bg-unicredit-primary-light]="isBold" [class.text-unicredit-primary]="isBold"
                class="px-2 py-1 hover:bg-unicredit-gray-lighter rounded transition-colors text-unicredit-text" title="Bold">
             <svg xmlns="http://www.w3.org/2000/svg" width="10" height="12" viewBox="0 0 10 12" fill="none">
               <path d="M5.78125 11.25H0V0H5.3125C5.93885 3.72804e-05 6.5521 0.179345 7.07982 0.516741C7.60753 0.854137 8.02764 1.33552 8.29054 1.90403C8.55343 2.47254 8.64812 3.10442 8.56341 3.72501C8.4787 4.34561 8.21814 4.92899 7.8125 5.40625C8.34233 5.82997 8.72779 6.40751 8.91582 7.05935C9.10386 7.7112 9.08522 8.4053 8.86248 9.04612C8.63974 9.68693 8.22384 10.2429 7.67204 10.6376C7.12024 11.0323 6.45966 11.2463 5.78125 11.25ZM1.875 9.375H5.76875C5.95342 9.375 6.13628 9.33863 6.3069 9.26796C6.47751 9.19729 6.63254 9.0937 6.76312 8.96312C6.8937 8.83254 6.99728 8.67751 7.06796 8.5069C7.13863 8.33628 7.175 8.15342 7.175 7.96875C7.175 7.78408 7.13863 7.60122 7.06796 7.4306C6.99728 7.25999 6.8937 7.10496 6.76312 6.97438C6.63254 6.8438 6.47751 6.74021 6.3069 6.66954C6.13628 6.59887 5.95342 6.5625 5.76875 6.5625H1.875V9.375ZM1.875 4.6875H5.3125C5.49717 4.6875 5.68003 4.65113 5.85065 4.58046C6.02126 4.50978 6.17629 4.4062 6.30687 4.27562C6.43745 4.14504 6.54104 3.99001 6.61171 3.8194C6.68238 3.64878 6.71875 3.46592 6.71875 3.28125C6.71875 3.09658 6.68238 2.91372 6.61171 2.7431C6.54104 2.57249 6.43745 2.41746 6.30687 2.28688C6.17629 2.1563 6.02126 2.05272 5.85065 1.98204C5.68003 1.91137 5.49717 1.875 5.3125 1.875H1.875V4.6875Z" fill="currentColor"/>
             </svg>
        </button>

        <!-- 2. Italic -->
        <button (click)="execCommand('italic')"
                [class.bg-unicredit-primary-light]="isItalic" [class.text-unicredit-primary]="isItalic"
                class="px-2 py-1 hover:bg-unicredit-gray-lighter rounded transition-colors text-unicredit-text" title="Italic">
             <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
               <path d="M11.25 1.25V0H3.125V1.25H6.3375L3.60625 10H0V11.25H8.125V10H4.9125L7.64375 1.25H11.25Z" fill="currentColor"/>
             </svg>
        </button>

        <!-- 3. Underline -->
        <button (click)="execCommand('underline')"
                [class.bg-unicredit-primary-light]="isUnderline" [class.text-unicredit-primary]="isUnderline"
                class="px-2 py-1 hover:bg-unicredit-gray-lighter rounded transition-colors text-unicredit-text" title="Underline">
             <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" fill="none">
               <path d="M0 13.125H15V14.375H0V13.125ZM7.5 11.25C6.33968 11.25 5.22688 10.7891 4.40641 9.96859C3.58594 9.14812 3.125 8.03532 3.125 6.875V0H4.375V6.875C4.375 7.7038 4.70424 8.49866 5.29029 9.08471C5.87634 9.67076 6.6712 10 7.5 10C8.3288 10 9.12366 9.67076 9.70971 9.08471C10.2958 8.49866 10.625 7.7038 10.625 6.875V0H11.875V6.875C11.875 8.03532 11.4141 9.14812 10.5936 9.96859C9.77312 10.7891 8.66032 11.25 7.5 11.25Z" fill="currentColor"/>
             </svg>
        </button>

        <!-- 4. Strikethrough -->
        <button (click)="execCommand('strikeThrough')"
                [class.bg-unicredit-primary-light]="isStrikethrough" [class.text-unicredit-primary]="isStrikethrough"
                class="px-2 py-1 hover:bg-unicredit-gray-lighter rounded transition-colors text-unicredit-text" title="Strikethrough">
             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
               <path d="M17.5 9.37489H11.2225C10.945 9.30027 10.6662 9.23047 10.3863 9.16552C8.63125 8.75052 7.63875 8.44677 7.63875 7.02614C7.6245 6.7809 7.66081 6.53535 7.74542 6.30473C7.83004 6.07411 7.96115 5.86335 8.13062 5.68552C8.6615 5.24896 9.32644 5.0084 10.0137 5.00427C11.7825 4.96052 12.5981 5.56052 13.265 6.47302L14.2744 5.73552C13.8019 5.05699 13.1578 4.51605 12.4078 4.16796C11.6578 3.81987 10.8288 3.67711 10.0056 3.75427C8.99439 3.76072 8.01887 4.12898 7.25563 4.79239C6.96634 5.08583 6.74024 5.43541 6.59125 5.81959C6.44227 6.20377 6.37356 6.61439 6.38937 7.02614C6.36197 7.4767 6.4466 7.92702 6.63572 8.33688C6.82483 8.74674 7.11254 9.10337 7.47312 9.37489H2.5V10.6249H11.0325C12.2619 10.9811 12.9969 11.4449 13.0156 12.7236C13.0359 12.9968 12.9985 13.2712 12.9056 13.5289C12.8128 13.7866 12.6667 14.0218 12.4769 14.2193C11.8155 14.7406 10.9938 15.0165 10.1519 14.9999C9.52345 14.9817 8.90738 14.8208 8.35029 14.5294C7.7932 14.2381 7.30966 13.8238 6.93625 13.318L5.97812 14.1205C6.46358 14.7675 7.08994 15.2954 7.80972 15.6643C8.52951 16.0333 9.32384 16.2335 10.1325 16.2499H10.195C11.3492 16.2632 12.4695 15.8595 13.35 15.113C13.6625 14.7979 13.9054 14.4208 14.0632 14.006C14.2209 13.5913 14.2898 13.148 14.2656 12.7049C14.289 11.9469 14.0332 11.2068 13.5469 10.6249H17.5V9.37489Z" fill="currentColor"/>
             </svg>
        </button>

        <!-- Separator 1 -->
        <div class="w-px h-5 bg-unicredit-gray-divider mx-1"></div>

        <!-- 5. Bullet List -->
        <button (click)="execCommand('insertUnorderedList')"
                class="p-1.5 hover:bg-unicredit-gray-lighter rounded transition-colors text-unicredit-text" title="Bullet list">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M4.375 7.5C5.41053 7.5 6.25 6.66053 6.25 5.625C6.25 4.58947 5.41053 3.75 4.375 3.75C3.33947 3.75 2.5 4.58947 2.5 5.625C2.5 6.66053 3.33947 7.5 4.375 7.5Z" fill="currentColor"/>
                <path d="M4.375 16.25C5.41053 16.25 6.25 15.4105 6.25 14.375C6.25 13.3395 5.41053 12.5 4.375 12.5C3.33947 12.5 2.5 13.3395 2.5 14.375C2.5 15.4105 3.33947 16.25 4.375 16.25Z" fill="currentColor"/>
                <path d="M10 13.75H18.75V15H10V13.75ZM10 5H18.75V6.25H10V5Z" fill="currentColor"/>
            </svg>
        </button>

        <!-- 6. Numbered List -->
        <button (click)="execCommand('insertOrderedList')"
                class="p-1.5 hover:bg-unicredit-gray-lighter rounded transition-colors text-unicredit-text" title="Numbered list">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 13.75H18.75V15H10V13.75ZM10 5H18.75V6.25H10V5ZM5 7.5V2.5H3.75V3.125H2.5V4.375H3.75V7.5H2.5V8.75H6.25V7.5H5ZM6.25 17.5H2.5V15C2.5 14.6685 2.6317 14.3505 2.86612 14.1161C3.10054 13.8817 3.41848 13.75 3.75 13.75H5V12.5H2.5V11.25H5C5.33152 11.25 5.64946 11.3817 5.88388 11.6161C6.1183 11.8505 6.25 12.1685 6.25 12.5V13.75C6.25 14.0815 6.1183 14.3995 5.88388 14.6339C5.64946 14.8683 5.33152 15 5 15H3.75V16.25H6.25V17.5Z" fill="#262626"/>
            </svg>
        </button>

        <!-- Separator 2 -->
        <div class="w-px h-5 bg-unicredit-gray-divider mx-1"></div>

        <!-- 7. Text Highlight / Background Color -->
        <div class="relative group" (clickOutside)="isHighlightMenuOpen = false">
            <button (click)="toggleHighlightMenu($event)" class="flex items-center gap-0.5 p-1.5 hover:bg-unicredit-gray-lighter rounded transition-colors text-unicredit-text" title="Highlight color">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 20 20" fill="none">
                  <path d="M8 8.33333L12.5 12.8333L8.33333 17C8 17.3333 7.61111 17.5 7.16667 17.5C6.72222 17.5 6.33333 17.3333 6 17L5.95833 16.9583L5.41667 17.5H1.25L3.875 14.875L3.83333 14.8333C3.5 14.5 3.33333 14.1111 3.33333 13.6667C3.33333 13.2222 3.5 12.8333 3.83333 12.5L8 8.33333ZM9.1875 7.14583L13.3333 3C13.6667 2.66667 14.0556 2.5 14.5 2.5C14.9444 2.5 15.3333 2.66667 15.6667 3L17.8333 5.16667C18.1667 5.5 18.3333 5.88889 18.3333 6.33333C18.3333 6.77778 18.1667 7.16667 17.8333 7.5L13.6875 11.6458L9.1875 7.14583Z" fill="currentColor"/>
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M14 6.65175C13.1986 5.78275 11.8981 5.78275 11.096 6.65175L8 9.79845L4.904 6.65175C4.10188 5.78275 2.80212 5.78275 2 6.65175L8 12.75L14 6.65175Z" fill="currentColor"/>
                </svg>
            </button>
            <div *ngIf="isHighlightMenuOpen" class="absolute bottom-full mb-2 left-0 bg-white border border-unicredit-gray shadow-xl rounded-[4px] z-50 min-w-[124px] p-2 grid grid-cols-4 gap-1 transition-all duration-200">
                <div *ngFor="let color of highlightColors"
                     (click)="setHighlightColor(color)"
                     class="w-6 h-6 rounded-sm cursor-pointer border border-black/10 hover:scale-110 transition-transform"
                     [style.background-color]="color"
                     [title]="color">
                </div>
            </div>
        </div>

        <!-- 8. Text Color Picker -->
        <div class="relative" (clickOutside)="isColorMenuOpen = false">
            <button (click)="toggleColorMenu($event)" class="p-1.5 hover:bg-unicredit-gray-lighter rounded transition-colors h-8 flex items-center justify-center" title="Text color">
                <div class="w-[18px] h-[18px] rounded-sm border border-unicredit-gray-divider" [style.background-color]="currentColor"></div>
            </button>
            <div *ngIf="isColorMenuOpen" class="absolute bottom-full mb-2 left-0 bg-white border border-unicredit-gray shadow-xl rounded-[4px] z-50 min-w-[124px] p-2 grid grid-cols-4 gap-1 transition-all duration-200">
                <div *ngFor="let color of colors"
                     (click)="setTextColor(color); isColorMenuOpen = false"
                     class="w-6 h-6 rounded-sm cursor-pointer border border-black/10 hover:scale-110 transition-transform"
                     [style.background-color]="color">
                </div>
            </div>
        </div>

        <!-- 9. Font Size -->
        <div class="relative" (clickOutside)="isFontMenuOpen = false">
            <button (click)="toggleFontMenu($event)" class="flex items-center gap-1 px-2 py-1 hover:bg-unicredit-gray-lighter rounded text-sm cursor-pointer transition-colors outline-none h-8">
                <span class="text-unicredit-text font-medium min-w-[20px]">{{ fontSize }}</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M14 6.65175C13.1986 5.78275 11.8981 5.78275 11.096 6.65175L8 9.79845L4.904 6.65175C4.10188 5.78275 2.80212 5.78275 2 6.65175L8 12.75L14 6.65175Z" fill="currentColor"/>
                </svg>
            </button>
            <div *ngIf="isFontMenuOpen" class="absolute bottom-full mb-2 left-0 bg-white border border-unicredit-gray shadow-xl rounded-[4px] z-50 min-w-[80px] p-1 transition-all duration-200">
                <div *ngFor="let size of ['14', '16', '18', '20']"
                     (click)="setFontSize(size); isFontMenuOpen = false"
                     class="px-3 py-1.5 hover:bg-unicredit-primary-light cursor-pointer text-sm text-unicredit-text rounded-sm transition-colors">
                     {{ size }}
                </div>
            </div>
        </div>

        <!-- Separator 3 -->
        <div class="w-px h-5 bg-unicredit-gray-divider mx-1"></div>

        <!-- 10. Paste -->
        <button (click)="customPaste()" class="p-1.5 hover:bg-unicredit-gray-lighter rounded transition-colors text-unicredit-text" title="Paste">
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="20" viewBox="0 0 15 20" fill="none">
                <path d="M13.75 20H1.25C0.559766 20 0 19.4402 0 18.75V10H15V18.75C15 19.4402 14.4402 20 13.75 20ZM0 7.5C0 6.11914 1.11953 5 2.5 5H5V2.5C5 1.11914 6.11953 0 7.5 0C8.88047 0 10 1.11914 10 2.5V5H12.5C13.8805 5 15 6.11914 15 7.5V8.75H0V7.5ZM7.5 3.4375C8.01758 3.4375 8.4375 3.01797 8.4375 2.5C8.4375 1.98242 8.01758 1.5625 7.5 1.5625C6.98242 1.5625 6.5625 1.98242 6.5625 2.5C6.5625 3.01797 6.98242 3.4375 7.5 3.4375Z" fill="currentColor"/>
            </svg>
        </button>

        <!-- 11. Insert Link -->
        <button class="p-1.5 hover:bg-unicredit-gray-lighter rounded transition-colors text-unicredit-text" title="Insert link">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="10" viewBox="0 0 20 10" fill="none">
                <path d="M5 10C3.61667 10 2.43767 9.51233 1.463 8.537C0.488334 7.56167 0.000667349 6.38267 6.82594e-07 5C-0.000665984 3.61733 0.487001 2.43833 1.463 1.463C2.439 0.487667 3.618 0 5 0H8C8.28333 0 8.521 0.0960001 8.713 0.288C8.905 0.48 9.00067 0.717333 9 1C8.99933 1.28267 8.90333 1.52033 8.712 1.713C8.52067 1.90567 8.28333 2.00133 8 2H5C4.16667 2 3.45833 2.29167 2.875 2.875C2.29167 3.45833 2 4.16667 2 5C2 5.83333 2.29167 6.54167 2.875 7.125C3.45833 7.70833 4.16667 8 5 8H8C8.28333 8 8.521 8.096 8.713 8.288C8.905 8.48 9.00067 8.71733 9 9C8.99933 9.28267 8.90333 9.52033 8.712 9.713C8.52067 9.90567 8.28333 10.0013 8 10H5ZM7 6C6.71667 6 6.47933 5.904 6.288 5.712C6.09667 5.52 6.00067 5.28267 6 5C5.99933 4.71733 6.09533 4.48 6.288 4.288C6.48067 4.096 6.718 4 7 4H13C13.2833 4 13.521 4.096 13.713 4.288C13.905 4.48 14.0007 4.71733 14 5C13.9993 5.28267 13.9033 5.52033 13.712 5.713C13.5207 5.90567 13.2833 6.00133 13 6H7ZM12 10C11.7167 10 11.4793 9.904 11.288 9.712C11.0967 9.52 11.0007 9.28267 11 9C10.9993 8.71733 11.0953 8.48 11.288 8.288C11.4807 8.096 11.718 8 12 8H15C15.8333 8 16.5417 7.70833 17.125 7.125C17.7083 6.54167 18 5.83333 18 5C18 4.16667 17.7083 3.45833 17.125 2.875C16.5417 2.29167 15.8333 2 15 2H12C11.7167 2 11.4793 1.904 11.288 1.712C11.0967 1.52 11.0007 1.28267 11 1C10.9993 0.717333 11.0953 0.48 11.288 0.288C11.4807 0.0960001 11.718 0 12 0H15C16.3833 0 17.5627 0.487667 18.538 1.463C19.5133 2.43833 20.0007 3.61733 20 5C19.9993 6.38267 19.5117 7.562 18.537 8.538C17.5623 9.514 16.3833 10.0013 15 10H12Z" fill="currentColor"/>
            </svg>
        </button>

        <!-- 12. Attach (Paperclip) -->
        <button (click)="attachmentClick.emit()" class="p-1.5 hover:bg-unicredit-gray-lighter rounded transition-colors text-unicredit-text" title="Attach">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M5.56474 19.9924C4.46373 19.9924 3.35528 19.5665 2.51464 18.7071C1.674 17.8476 1.18301 16.5927 1.25740 15.3074C1.32436 14.1893 1.84511 13.155 2.61879 12.364L9.74562 5.07785C10.8615 3.93702 12.7139 4.00547 13.7405 5.2832C14.6332 6.39362 14.4696 8.05163 13.4727 9.07078L9.41085 13.2234C8.62973 12.4248 8.62973 11.1319 9.41085 10.3257L12.1411 7.53446C12.4089 7.26065 12.4089 6.80432 12.1411 6.53052C11.8733 6.25672 11.4195 6.26432 11.1591 6.53052L4.0025 13.8471C3.1321 14.7369 3.00563 16.1972 3.81651 17.1403C4.31495 17.7259 5.044 18.0225 5.81024 17.9389C6.36075 17.878 6.87406 17.589 7.26834 17.1859L15.5483 8.72093C16.9171 7.3215 17.1551 5.07785 15.9723 3.51871C14.544 1.62492 11.8658 1.50323 10.2664 3.13082L6.44258 7.04009C5.66146 7.83868 4.39678 7.83868 3.60822 7.04009L8.69668 1.83788C10.8764 -0.390558 14.4324 -0.664359 16.7609 1.41196C19.3125 3.69364 19.4092 7.67136 17.051 10.0823L8.60741 18.7147C7.76677 19.5741 6.66576 20 5.55731 20L5.56474 19.9924Z" fill="currentColor"/>
            </svg>
        </button>

        <!-- 13. Signature Selection -->
        <div class="relative group">
            <button class="flex items-center gap-0.5 p-1.5 hover:bg-unicredit-gray-lighter rounded transition-colors text-unicredit-text h-8" title="Signature selection">
                <svg xmlns="http://www.w3.org/2000/svg" width="23" height="20" viewBox="0 0 23 20" fill="none">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M15.2309 3.30751e-05C15.4569 -0.00181983 15.6515 0.0741493 15.8201 0.235352L18.2789 2.58854C18.4383 2.74048 18.5161 2.94245 18.5198 3.1648C18.5235 3.39085 18.4568 3.59653 18.3011 3.75402L16.993 5.11591L13.3594 1.6065L14.6546 0.257587C14.814 0.0926784 15.0067 0.00373889 15.2309 3.30751e-05ZM3.72247 12.6535C4.16717 12.5164 4.63596 12.7666 4.77307 13.2094C4.91019 13.6541 4.66005 14.1229 4.2172 14.26C2.92387 14.6565 2.05671 15.4236 1.76951 16.1444C1.69354 16.3371 1.6676 16.5131 1.69725 16.6577C1.71948 16.767 1.78619 16.867 1.89551 16.9467C2.368 17.2914 3.38525 17.3803 5.09363 16.9652C6.10531 16.7188 7.18926 16.3853 8.14907 16.0888C9.12926 15.7868 9.9853 15.5218 10.5801 15.4107C11.677 15.2068 12.7721 15.0679 13.6559 15.1123C14.8158 15.1698 15.6867 15.5422 15.985 16.4335C16.1777 17.0097 16.124 17.51 16.0758 17.9584C16.0758 18.1196 16.0425 18.2697 16.0499 18.3679C16.0499 18.3716 16.2259 18.3586 17.0745 18.2919C18.0566 18.2141 19.0738 17.8268 20.0781 17.4433C20.5932 17.2469 21.1046 17.0523 21.6846 16.8745C22.1292 16.7392 22.598 16.9912 22.7314 17.434C22.8667 17.8787 22.6147 18.3475 22.1719 18.4809C21.7216 18.618 21.2009 18.8182 20.6784 19.0164C19.5593 19.4426 18.429 19.8743 17.2061 19.9707C14.9696 20.1467 14.4508 19.5148 14.3711 18.4976C14.3526 18.2586 14.3767 18.027 14.4026 17.7787C14.4323 17.5007 14.4656 17.1894 14.3897 16.9652C14.3563 16.8652 14.0395 16.8133 13.5762 16.7911C12.8369 16.754 11.8679 16.88 10.8821 17.0634C10.3911 17.1542 9.57581 17.4062 8.64194 17.6953C7.66546 17.9973 6.56298 18.3364 5.48830 18.5977C3.23887 19.1443 1.74357 18.9127 0.906056 18.3012C0.435418 17.9584 0.155629 17.51 0.0481603 17.0042C-0.0518967 16.5335 0.00554343 16.0258 0.205657 15.5218C0.661472 14.3841 1.91589 13.2057 3.72247 12.6535ZM7.64878 8.97737L9.87783 11.1212L7.1522 11.8531C7.054 11.8716 7.01509 11.8327 7.03177 11.7419L7.64878 8.97737ZM12.2069 2.79978L15.8368 6.29621L10.8784 11.5307L6.43513 12.7221C6.27578 12.7536 6.21278 12.6906 6.23872 12.5405L7.24485 8.03609L12.2069 2.79978Z" fill="currentColor"/>
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M14 6.65175C13.1986 5.78275 11.8981 5.78275 11.096 6.65175L8 9.79845L4.904 6.65175C4.10188 5.78275 2.80212 5.78275 2 6.65175L8 12.75L14 6.65175Z" fill="currentColor"/>
                </svg>
            </button>
        </div>
      </div>

      <!-- Editor Area -->
      <div #editor
           contentEditable="true"
           class="w-full px-4 py-[10px] bg-white focus:outline-none transition-all duration-300 ease-in-out composer-scrollbar overflow-y-auto rich-text-content break-words whitespace-pre-wrap"
           [style.min-height]="showToolbar ? '100px' : '44px'"
           [style.max-height]="'140px'"
           [style.font-size.px]="14"
           [style.line-height.px]="16"
           (input)="onInput()"
           (focus)="onFocus()"
           (blur)="onBlur()"
           (keydown)="onKeyDown($event)"
           (keyup)="onKeyUp($event)"
           (mouseup)="onMouseUp($event)">
      </div>

      <!-- Placeholder -->
      <div *ngIf="isEmpty && !isFocused && !replyTo" 
           class="absolute left-4 text-unicredit-text-secondary pointer-events-none select-none z-10"
           [style.top]="showToolbar ? '52px' : '10px'">
          {{ placeholder }}
      </div>

    </div>
  `,
    styles: [`
    .rich-text-content {
      word-break: break-word;
      overflow-wrap: anywhere;
      line-height: 1.15;
      font-size: 14px;
    }
  `],
    animations: [
        trigger('toolbarAnimation', [
            transition(':enter', [
                style({
                    opacity: 0,
                    height: 0,
                    transform: 'translateY(-10px)'
                }),
                animate('250ms cubic-bezier(0.4, 0.0, 0.2, 1)',
                    style({
                        opacity: 1,
                        height: '*',
                        transform: 'translateY(0)'
                    })
                )
            ]),
            transition(':leave', [
                animate('200ms ease-in',
                    style({
                        opacity: 0,
                        height: 0,
                        transform: 'translateY(-5px)'
                    })
                )
            ])
        ])
    ]
})
export class RichTextEditorComponent implements AfterViewInit, OnChanges {
    @Input() placeholder: string = 'Type your message...';
    @Input() content: string = '';
    @Input() showToolbar: boolean = false;
    @Input() maxHeight: string = '200px';
    @Input() replyTo: any = null;
    @Output() contentChange = new EventEmitter<string>();
    @Output() enterPressed = new EventEmitter<void>();
    @Output() cancelReply = new EventEmitter<void>();
    @Output() attachmentClick = new EventEmitter<void>();

    isPreviewExpanded = false;

    @ViewChild('editor') editorRef!: ElementRef<HTMLDivElement>;

    fontSize = '14';
    currentColor = '#262626';
    colors = [
        '#262626', // Black
        '#007A91', // CommSuite Blue
        '#D32F2F', // Red
        '#388E3C', // Green
        '#F57C00', // Orange
        '#7B1FA2', // Purple
        '#000000', // Pure Black
        '#1976D2'  // Deep Blue
    ];
    isBold = false;
    isItalic = false;
    isUnderline = false;
    isStrikethrough = false;
    isFocused = false;
    isEmpty: boolean = true;

    // Helper to ensure we use CSS for styling instead of old HTML tags
    private ensureCssMode() {
        document.execCommand('styleWithCSS', false, 'true');
    }

    private savedSelection: Range | null = null;
    isFontMenuOpen = false;
    isColorMenuOpen = false;
    isHighlightMenuOpen = false;

    highlightColors = [
        '#FFFF00', // Yellow
        '#00FF00', // Green
        '#00FFFF', // Cyan
        '#FF00FF', // Magenta
        '#FF0000', // Red
        '#E0E0E0', // Light Gray
        '#FFFFFF', // White/Transparent (Reset)
    ];

    saveSelection() {
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
            this.savedSelection = selection.getRangeAt(0).cloneRange();
        } else {
            this.savedSelection = null;
        }
    }

    restoreSelection() {
        if (!this.savedSelection) return;

        const selection = window.getSelection();
        if (selection) {
            selection.removeAllRanges();
            selection.addRange(this.savedSelection);
        }
    }

    toggleFontMenu(event: Event) {
        event.stopPropagation();
        if (!this.isFontMenuOpen) {
            // About to open, save the selection
            this.saveSelection();
            this.isFontMenuOpen = true;
        } else {
            this.isFontMenuOpen = false;
        }
        this.isColorMenuOpen = false; // Close others
        this.isHighlightMenuOpen = false; // Close others
    }

    toggleColorMenu(event: MouseEvent) {
        event.stopPropagation();
        this.saveSelection();
        this.isColorMenuOpen = !this.isColorMenuOpen;
        this.isFontMenuOpen = false;
        this.isHighlightMenuOpen = false;
    }

    setHighlightColor(color: string) {
        this.restoreSelection();
        // 'hiliteColor' is the standard command for background color
        // 'backColor' is for IE, but most modern browsers support hiliteColor or alias backColor.
        // Let's rely on execCommand wrapper which might need handling, but standard is hiliteColor
        this.execCommand('hiliteColor', color);
        this.isHighlightMenuOpen = false;
    }

    toggleHighlightMenu(event: MouseEvent) {
        event.stopPropagation();
        this.saveSelection();
        this.isHighlightMenuOpen = !this.isHighlightMenuOpen;
        this.isColorMenuOpen = false;
        this.isFontMenuOpen = false;
    }

    get placeholderTop(): string {
        if (this.replyTo) {
            // Dynamic calculation based on expanded state
            const toolbarHeight = this.showToolbar ? 52 : 0;
            const replyBaseHeight = 80; // Base height for collapsed reply
            const expandedExtraHeight = this.isPreviewExpanded ? 100 : 0; // Extra when expanded
            return (toolbarHeight + replyBaseHeight + expandedExtraHeight + 10) + 'px';
        }
        return this.showToolbar ? '52px' : '10px';
    }

    shouldShowReadMore(content: string | undefined): boolean {
        if (!content) return false;
        return content.length > 150 || content.includes('<br>') || content.includes('</div>');
    }

    private updateIsEmpty() {
        if (!this.editorRef) {
            this.isEmpty = !this.content;
            return;
        }
        const html = this.editorRef.nativeElement.innerHTML || '';
        const text = this.editorRef.nativeElement.innerText || '';
        // Robust check for empty content
        this.isEmpty = !html || html === '<br>' || html === '<div><br></div>' || text.trim() === '';
    }

    ngAfterViewInit() {
        if (this.content && this.editorRef) {
            this.editorRef.nativeElement.innerHTML = this.content;
        }
        this.updateIsEmpty();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['content']) {
            if (this.editorRef && this.content !== this.editorRef.nativeElement.innerHTML) {
                this.editorRef.nativeElement.innerHTML = this.content || '';
                this.checkActiveStyles();
                this.updateIsEmpty();
            } else if (!this.editorRef) {
                this.isEmpty = !this.content;
            }
        }
    }

    onInput() {
        if (this.editorRef) {
            this.sanitize();
            this.contentChange.emit(this.editorRef.nativeElement.innerHTML);
            this.checkActiveStyles();
            this.updateIsEmpty();
            this.updateState();
        }
    }

    onFocus() {
        this.isFocused = true;
        this.showToolbar = true;
        this.ensureCssMode();
        this.checkActiveStyles();
        this.updateState();
    }

    onBlur() {
        setTimeout(() => {
            // Only clear focus if we didn't click into a menu
            if (!this.isFontMenuOpen && !this.isColorMenuOpen) {
                this.isFocused = false;
            }
        }, 200);
    }

    onKeyDown(event: KeyboardEvent) {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            this.enterPressed.emit();
        }
    }

    onKeyUp(event: KeyboardEvent) {
        this.updateState();
    }

    async customPaste() {
        try {
            const text = await navigator.clipboard.readText();
            if (text) {
                this.execCommand('insertText', text);
            }
        } catch (err) {
            console.error('Failed to read clipboard contents: ', err);
        }
    }

    onMouseUp(event: MouseEvent) {
        this.updateState();
    }

    execCommand(command: string, value: string | any = null) {
        this.ensureCssMode();
        document.execCommand(command, false, value);
        this.checkActiveStyles();
        this.updateState();
        this.onInput();
    }

    sanitize() {
        if (!this.editorRef) return;

        // Handle <font> tags generated by execCommand
        const fontTags = this.editorRef.nativeElement.getElementsByTagName('font');
        for (let i = 0; i < fontTags.length; i++) {
            const font = fontTags[i];
            // Match size="7" (from execCommand('fontSize', '7'))
            if (font.size === '7' || font.getAttribute('size') === '7') {
                font.removeAttribute('size');
                font.style.fontSize = this.fontSize + 'px';
                // Adjust line height for larger fonts
                font.style.lineHeight = (parseInt(this.fontSize) + 4) + 'px';
            }
        }

        // Handle <span> generated by styleWithCSS
        const spans = this.editorRef.nativeElement.getElementsByTagName('span');
        for (let i = 0; i < spans.length; i++) {
            const span = spans[i];
            // Some browsers use named sizes or px values when styleWithCSS is on
            if (span.style.fontSize === 'xxx-large' || span.style.fontSize === '48px' ||
                (span.style.fontSize && this.fontSize !== '14' && span.style.fontSize.includes(this.fontSize))) {
                // Ensure consistency
                span.style.fontSize = this.fontSize + 'px';
                span.style.lineHeight = (parseInt(this.fontSize) + 4) + 'px';
            }
        }
    }


    setFontSize(size: string) {
        this.fontSize = size;
        this.ensureCssMode();
        this.focus();
        this.restoreSelection(); // Restore if lost

        // Use '7' as a temporary marker for "current custom size"
        document.execCommand('fontSize', false, '7');
        this.sanitize(); // Apply custom size immediately
        this.onInput();
    }

    setTextColor(color: string) {
        this.currentColor = color;
        this.ensureCssMode();
        this.focus();
        this.restoreSelection(); // Restore if lost

        document.execCommand('foreColor', false, color);
        // Force font size again just in case color command reset it or created weird span
        this.sanitize();
        this.onInput();
    }

    checkActiveStyles() {
        this.isBold = document.queryCommandState('bold');
        this.isItalic = document.queryCommandState('italic');
        this.isUnderline = document.queryCommandState('underline');
    }

    updateState() {
        this.checkActiveStyles();

        // Sync Font Size from active element/selection
        const currentSize = document.queryCommandValue('fontSize');
        // Browsers return '1'-'7' or '18px' depending on mode.
        // Since we force styleWithCSS, we might get px values or nothing if mixed.
        if (currentSize && currentSize.indexOf('px') !== -1) {
            const size = currentSize.replace('px', '');
            // Validate it is one of our allowed sizes or just accept it?
            // To keep dropdown in sync, we try to match.
            if (!isNaN(parseInt(size))) {
                this.fontSize = size;
            }
        }

        const currentColor = document.queryCommandValue('foreColor');
        if (currentColor) {
            // We could try to sync color too, but rgb-hex conversion is verbose
            // For now, let's trust explicit setting for color, but size is critical for typing continuity
        }
    }

    public clear() {
        if (this.editorRef) {
            this.editorRef.nativeElement.innerHTML = '';
            this.onInput();
        }
    }

    public focus() {
        this.editorRef?.nativeElement?.focus();
    }
}
