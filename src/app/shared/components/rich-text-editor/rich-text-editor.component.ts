import { Component, ElementRef, EventEmitter, Input, Output, ViewChild, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppIconComponent } from '../icons/app-icon.component';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
    selector: 'app-rich-text-editor',
    standalone: true,
    imports: [CommonModule, AppIconComponent],
    template: `
    <div class="relative flex flex-col border border-[#ccc] rounded-md bg-white shadow-sm w-full">
      
      <!-- Reply Preview -->
      <div *ngIf="replyTo" class="mx-4 mt-4 mb-0 p-4 flex flex-col gap-2 rounded bg-[#E7F8FB] border border-[#007A91] relative group/reply min-w-0">
          <div class="flex items-start justify-between min-w-0">
              <div class="flex-1 min-w-0 pr-10">
                  <div class="flex items-center justify-between mb-2">
                      <span class="text-[#262626] text-sm font-bold">{{ replyTo.sender }}</span>
                      <span class="text-[#666] text-xs">{{ replyTo.timestamp }}</span>
                  </div>
                  <div class="text-[#262626] text-sm opacity-90 break-words whitespace-pre-wrap transition-all duration-300 composer-scrollbar"
                       style="overflow-wrap: anywhere;"
                       [style.max-height]="isPreviewExpanded ? '150px' : '40px'"
                       [style.overflow-y]="isPreviewExpanded ? 'auto' : 'hidden'"
                       [ngClass]="isPreviewExpanded ? '' : 'line-clamp-2'"
                       [innerHTML]="replyTo.content">
                  </div>
              </div>
              <button (click)="cancelReply.emit(); isPreviewExpanded = false" class="text-[#007A91] hover:text-[#005a6b] transition-colors p-0.5 absolute top-4 right-4 z-10">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
          </div>
          <!-- Read More for Preview -->
          <button *ngIf="shouldShowReadMore(replyTo.content)" 
                  (click)="isPreviewExpanded = !isPreviewExpanded"
                  class="flex items-center gap-1 text-[#007A91] text-xs font-bold uppercase mt-1 self-end hover:opacity-80 transition-opacity">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M7.9955 10.5C6.235 10.5 4.777 9.8215 3.251 8C4.2235 6.839 5.169 6.146 6.182 5.793C5.7625 6.2405 5.5005 6.838 5.5005 7.5C5.5005 8.8805 6.6195 10 7.9995 10C9.38 10 10.499 8.8805 10.499 7.5C10.499 6.845 10.242 6.2545 9.83 5.8085C10.8315 6.1705 11.7695 6.8685 12.751 8C11.1985 9.7895 9.756 10.5 7.9955 10.5M7.9995 7C8.276 7 8.4995 7.224 8.4995 7.5C8.4995 7.776 8.276 8 7.9995 8C7.724 8 7.4995 7.776 7.4995 7.5C7.4995 7.224 7.724 7 7.9995 7M8 0C3.582 0 0 3.582 0 8C0 12.4185 3.582 16 8 16C12.418 16 16 12.4185 16 8C16 3.582 12.418 0 8 0" fill="currentColor"/>
              </svg>
              {{ isPreviewExpanded ? 'Read Less' : 'Read More' }}
          </button>
      </div>
      
      <!-- Toolbar -->
      <div *ngIf="showToolbar || !isEmpty" 
           [@toolbarAnimation]
           class="flex items-center gap-1 px-3 py-2 border-b border-[#e6e6e6] bg-white">
        
        <!-- Paste -->
        <button (click)="execCommand('paste')" class="p-1.5 hover:bg-[#f5f5f5] rounded transition-colors text-[#262626]" title="Paste">
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="20" viewBox="0 0 15 20" fill="none">
                <path d="M13.75 20H1.25C0.559766 20 0 19.4402 0 18.75V10H15V18.75C15 19.4402 14.4402 20 13.75 20ZM0 7.5C0 6.11914 1.11953 5 2.5 5H5V2.5C5 1.11914 6.11953 0 7.5 0C8.88047 0 10 1.11914 10 2.5V5H12.5C13.8805 5 15 6.11914 15 7.5V8.75H0V7.5ZM7.5 3.4375C8.01758 3.4375 8.4375 3.01797 8.4375 2.5C8.4375 1.98242 8.01758 1.5625 7.5 1.5625C6.98242 1.5625 6.5625 1.98242 6.5625 2.5C6.5625 3.01797 6.98242 3.4375 7.5 3.4375Z" fill="black"/>
            </svg>
        </button>
        
        <!-- Font Size -->
        <div class="relative group">
            <button class="flex items-center gap-1 px-2 py-1 hover:bg-[#f5f5f5] rounded text-sm cursor-pointer transition-colors outline-none h-8">
                <span class="text-[#262626] font-medium min-w-[20px]">{{ fontSize }}px</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M14 6.65175C13.1986 5.78275 11.8981 5.78275 11.096 6.65175L8 9.79845L4.904 6.65175C4.10188 5.78275 2.80212 5.78275 2 6.65175L8 12.75L14 6.65175Z" fill="#262626"/>
                </svg>
            </button>
            <div class="absolute top-full left-0 opacity-0 invisible group-hover:opacity-100 group-hover:visible bg-white border border-[#e6e6e6] shadow-xl rounded-[4px] z-50 min-w-[80px] p-1 mt-1 transition-all duration-200">
                <div *ngFor="let size of ['14', '16', '18', '20']" 
                     (click)="setFontSize(size)"
                     class="px-3 py-1.5 hover:bg-[#e7f8fb] cursor-pointer text-sm text-[#262626] rounded-sm transition-colors">
                     {{ size }}px
                </div>
            </div>
        </div>

        <!-- Text Color Picker -->
        <div class="relative group">
            <button class="p-1.5 hover:bg-[#f5f5f5] rounded transition-colors h-8 flex items-center justify-center" title="Text color">
                <div class="w-[18px] h-[18px] rounded-sm border border-[#ccc]" [style.background-color]="currentColor"></div>
            </button>
            <div class="absolute top-full left-0 opacity-0 invisible group-hover:opacity-100 group-hover:visible bg-white border border-[#e6e6e6] shadow-xl rounded-[4px] z-50 min-w-[124px] p-2 mt-1 grid grid-cols-4 gap-1 transition-all duration-200">
                <div *ngFor="let color of colors" 
                     (click)="setTextColor(color)"
                     class="w-6 h-6 rounded-sm cursor-pointer border border-black/10 hover:scale-110 transition-transform"
                     [style.background-color]="color">
                </div>
            </div>
        </div>

        <!-- Bold -->
        <button (click)="execCommand('bold')" 
                [class.bg-[#e7f8fb]]="isBold" [class.text-[#007a91]]="isBold"
                class="px-2 py-1 hover:bg-[#f5f5f5] rounded transition-colors text-[#262626] font-bold text-sm">
          B
        </button>

        <!-- Italic -->
        <button (click)="execCommand('italic')" 
                [class.bg-[#e7f8fb]]="isItalic" [class.text-[#007a91]]="isItalic"
                class="px-2 py-1 hover:bg-[#f5f5f5] rounded transition-colors text-[#262626] italic text-sm">
          I
        </button>

        <!-- Underline -->
        <button (click)="execCommand('underline')" 
                [class.bg-[#e7f8fb]]="isUnderline" [class.text-[#007a91]]="isUnderline"
                class="px-2 py-1 hover:bg-[#f5f5f5] rounded transition-colors text-[#262626] underline text-sm">
          U
        </button>

        <!-- Strikethrough -->
        <button (click)="execCommand('strikeThrough')" 
                [class.bg-[#e7f8fb]]="isStrikethrough" [class.text-[#007a91]]="isStrikethrough"
                class="px-2 py-1 hover:bg-[#f5f5f5] rounded transition-colors text-[#262626] line-through text-sm">
          S
        </button>

        <!-- Text Highlight / Background Color -->
        <div class="relative group">
            <button class="flex items-center gap-0.5 p-1.5 hover:bg-[#f5f5f5] rounded transition-colors text-[#262626]" title="Highlight color">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 11-6 6v3h3l6-6"/><path d="m22 2-7 7-4-4 7-7z"/></svg>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M14 6.65175C13.1986 5.78275 11.8981 5.78275 11.096 6.65175L8 9.79845L4.904 6.65175C4.10188 5.78275 2.80212 5.78275 2 6.65175L8 12.75L14 6.65175Z" fill="#262626"/>
                </svg>
            </button>
        </div>

        <!-- Bullet List -->
        <button (click)="execCommand('insertUnorderedList')" 
                class="p-1.5 hover:bg-[#f5f5f5] rounded transition-colors text-[#262626]" title="Bullet list">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M4.375 7.5C5.41053 7.5 6.25 6.66053 6.25 5.625C6.25 4.58947 5.41053 3.75 4.375 3.75C3.33947 3.75 2.5 4.58947 2.5 5.625C2.5 6.66053 3.33947 7.5 4.375 7.5Z" fill="#262626"/>
                <path d="M4.375 16.25C5.41053 16.25 6.25 15.4105 6.25 14.375C6.25 13.3395 5.41053 12.5 4.375 12.5C3.33947 12.5 2.5 13.3395 2.5 14.375C2.5 15.4105 3.33947 16.25 4.375 16.25Z" fill="#262626"/>
                <path d="M10 13.75H18.75V15H10V13.75ZM10 5H18.75V6.25H10V5Z" fill="#262626"/>
            </svg>
        </button>

        <!-- Numbered List -->
        <button (click)="execCommand('insertOrderedList')" 
                class="p-1.5 hover:bg-[#f5f5f5] rounded transition-colors text-[#262626]" title="Numbered list">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 13.75H18.75V15H10V13.75ZM10 5H18.75V6.25H10V5ZM5 7.5V2.5H3.75V3.125H2.5V4.375H3.75V7.5H2.5V8.75H6.25V7.5H5ZM6.25 17.5H2.5V15C2.5 14.6685 2.6317 14.3505 2.86612 14.1161C3.10054 13.8817 3.41848 13.75 3.75 13.75H5V12.5H2.5V11.25H5C5.33152 11.25 5.64946 11.3817 5.88388 11.6161C6.1183 11.8505 6.25 12.1685 6.25 12.5V13.75C6.25 14.0815 6.1183 14.3995 5.88388 14.6339C5.64946 14.8683 5.33152 15 5 15H3.75V16.25H6.25V17.5Z" fill="#262626"/>
            </svg>
        </button>

        <!-- Insert Link -->
        <button class="p-1.5 hover:bg-[#f5f5f5] rounded transition-colors text-[#262626]" title="Insert link">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="10" viewBox="0 0 20 10" fill="none">
                <path d="M5 10C3.61667 10 2.43767 9.51233 1.463 8.537C0.488334 7.56167 0.000667349 6.38267 6.82594e-07 5C-0.000665984 3.61733 0.487001 2.43833 1.463 1.463C2.439 0.487667 3.618 0 5 0H8C8.28333 0 8.521 0.0960001 8.713 0.288C8.905 0.48 9.00067 0.717333 9 1C8.99933 1.28267 8.90333 1.52033 8.712 1.713C8.52067 1.90567 8.28333 2.00133 8 2H5C4.16667 2 3.45833 2.29167 2.875 2.875C2.29167 3.45833 2 4.16667 2 5C2 5.83333 2.29167 6.54167 2.875 7.125C3.45833 7.70833 4.16667 8 5 8H8C8.28333 8 8.521 8.096 8.713 8.288C8.905 8.48 9.00067 8.71733 9 9C8.99933 9.28267 8.90333 9.52033 8.712 9.713C8.52067 9.90567 8.28333 10.0013 8 10H5ZM7 6C6.71667 6 6.47933 5.904 6.288 5.712C6.09667 5.52 6.00067 5.28267 6 5C5.99933 4.71733 6.09533 4.48 6.288 4.288C6.48067 4.096 6.718 4 7 4H13C13.2833 4 13.521 4.096 13.713 4.288C13.905 4.48 14.0007 4.71733 14 5C13.9993 5.28267 13.9033 5.52033 13.712 5.713C13.5207 5.90567 13.2833 6.00133 13 6H7ZM12 10C11.7167 10 11.4793 9.904 11.288 9.712C11.0967 9.52 11.0007 9.28267 11 9C10.9993 8.71733 11.0953 8.48 11.288 8.288C11.4807 8.096 11.718 8 12 8H15C15.8333 8 16.5417 7.70833 17.125 7.125C17.7083 6.54167 18 5.83333 18 5C18 4.16667 17.7083 3.45833 17.125 2.875C16.5417 2.29167 15.8333 2 15 2H12C11.7167 2 11.4793 1.904 11.288 1.712C11.0967 1.52 11.0007 1.28267 11 1C10.9993 0.717333 11.0953 0.48 11.288 0.288C11.4807 0.0960001 11.718 0 12 0H15C16.3833 0 17.5627 0.487667 18.538 1.463C19.5133 2.43833 20.0007 3.61733 20 5C19.9993 6.38267 19.5117 7.562 18.537 8.538C17.5623 9.514 16.3833 10.0013 15 10H12Z" fill="#262626"/>
            </svg>
        </button>

        <!-- Attach (Paperclip) -->
        <button class="p-1.5 hover:bg-[#f5f5f5] rounded transition-colors text-[#262626]" title="Attach">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M5.56474 19.9924C4.46373 19.9924 3.35528 19.5665 2.51464 18.7071C1.674 17.8476 1.18301 16.5927 1.2574 15.3074C1.32436 14.1893 1.84511 13.155 2.61879 12.364L9.74562 5.07785C10.8615 3.93702 12.7139 4.00547 13.7405 5.2832C14.6332 6.39362 14.4696 8.05163 13.4727 9.07078L9.41085 13.2234C8.62973 12.4248 8.62973 11.1319 9.41085 10.3257L12.1411 7.53446C12.4089 7.26065 12.4089 6.80432 12.1411 6.53052C11.8733 6.25672 11.4195 6.26432 11.1591 6.53052L4.0025 13.8471C3.1321 14.7369 3.00563 16.1972 3.81651 17.1403C4.31495 17.7259 5.044 18.0225 5.81024 17.9389C6.36075 17.878 6.87406 17.589 7.26834 17.1859L15.5483 8.72093C16.9171 7.3215 17.1551 5.07785 15.9723 3.51871C14.544 1.62492 11.8658 1.50323 10.2664 3.13082L6.44258 7.04009C5.66146 7.83868 4.39678 7.83868 3.60822 7.04009L8.69668 1.83788C10.8764 -0.390558 14.4324 -0.664359 16.7609 1.41196C19.3125 3.69364 19.4092 7.67136 17.051 10.0823L8.60741 18.7147C7.76677 19.5741 6.66576 20 5.55731 20L5.56474 19.9924Z" fill="#262626"/>
            </svg>
        </button>

        <!-- Signature Selection -->
        <div class="relative group">
            <button class="flex items-center gap-0.5 p-1.5 hover:bg-[#f5f5f5] rounded transition-colors text-[#262626] h-8" title="Signature selection">
                <svg xmlns="http://www.w3.org/2000/svg" width="23" height="20" viewBox="0 0 23 20" fill="none">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M15.2309 3.30751e-05C15.4569 -0.00181983 15.6515 0.0741493 15.8201 0.235352L18.2789 2.58854C18.4383 2.74048 18.5161 2.94245 18.5198 3.1648C18.5235 3.39085 18.4568 3.59653 18.3011 3.75402L16.993 5.11591L13.3594 1.6065L14.6546 0.257587C14.814 0.0926784 15.0067 0.00373889 15.2309 3.30751e-05ZM3.72247 12.6535C4.16717 12.5164 4.63596 12.7666 4.77307 13.2094C4.91019 13.6541 4.66005 14.1229 4.2172 14.26C2.92387 14.6565 2.05671 15.4236 1.76951 16.1444C1.69354 16.3371 1.6676 16.5131 1.69725 16.6577C1.71948 16.767 1.78619 16.867 1.89551 16.9467C2.368 17.2914 3.38525 17.3803 5.09363 16.9652C6.10531 16.7188 7.18926 16.3853 8.14907 16.0888C9.12926 15.7868 9.9853 15.5218 10.5801 15.4107C11.677 15.2068 12.7721 15.0679 13.6559 15.1123C14.8158 15.1698 15.6867 15.5422 15.985 16.4335C16.1777 17.0097 16.124 17.51 16.0758 17.9584C16.0758 18.1196 16.0425 18.2697 16.0499 18.3679C16.0499 18.3716 16.2259 18.3586 17.0745 18.2919C18.0566 18.2141 19.0738 17.8268 20.0781 17.4433C20.5932 17.2469 21.1046 17.0523 21.6846 16.8745C22.1292 16.7392 22.598 16.9912 22.7314 17.434C22.8667 17.8787 22.6147 18.3475 22.1719 18.4809C21.7216 18.618 21.2009 18.8182 20.6784 19.0164C19.5593 19.4426 18.429 19.8743 17.2061 19.9707C14.9696 20.1467 14.4508 19.5148 14.3711 18.4976C14.3526 18.2586 14.3767 18.027 14.4026 17.7787C14.4323 17.5007 14.4656 17.1894 14.3897 16.9652C14.3563 16.8652 14.0395 16.8133 13.5762 16.7911C12.8369 16.754 11.8679 16.88 10.8821 17.0634C10.3911 17.1542 9.57581 17.4062 8.64194 17.6953C7.66546 17.9973 6.56298 18.3364 5.4883 18.5977C3.23887 19.1443 1.74357 18.9127 0.906056 18.3012C0.435418 17.9584 0.155629 17.51 0.0481603 17.0042C-0.0518967 16.5335 0.00554343 16.0258 0.205657 15.5218C0.661472 14.3841 1.91589 13.2057 3.72247 12.6535ZM7.64878 8.97737L9.87783 11.1212L7.1522 11.8531C7.054 11.8716 7.01509 11.8327 7.03177 11.7419L7.64878 8.97737ZM12.2069 2.79978L15.8368 6.29621L10.8784 11.5307L6.43513 12.7221C6.27578 12.7536 6.21278 12.6906 6.23872 12.5405L7.24485 8.03609L12.2069 2.79978Z" fill="#262626"/>
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M14 6.65175C13.1986 5.78275 11.8981 5.78275 11.096 6.65175L8 9.79845L4.904 6.65175C4.10188 5.78275 2.80212 5.78275 2 6.65175L8 12.75L14 6.65175Z" fill="#262626"/>
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
           (keydown)="onKeyDown($event)">
      </div>

      <!-- Placeholder -->
      <div *ngIf="isEmpty && !isFocused && !replyTo" 
           class="absolute left-4 text-[#666] pointer-events-none select-none z-10"
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
            this.contentChange.emit(this.editorRef.nativeElement.innerHTML);
            this.checkActiveStyles();
            this.updateIsEmpty();
        }
    }

    onFocus() {
        this.isFocused = true;
        this.showToolbar = true;
        document.execCommand('styleWithCSS', false, 'true');
        this.checkActiveStyles();
    }

    onBlur() {
        setTimeout(() => {
            this.isFocused = false;
        }, 200);
    }

    onKeyDown(event: KeyboardEvent) {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            this.enterPressed.emit();
        }
    }

    execCommand(command: string, value: string | any = null) {
        document.execCommand(command, false, value);
        this.checkActiveStyles();
        this.onInput();
    }

    setFontSize(size: string) {
        this.fontSize = size;
        this.execCommand('fontSize', '7'); // Use a placeholder size

        // Handle <font> tags
        const fontTags = this.editorRef.nativeElement.getElementsByTagName('font');
        for (let i = 0; i < fontTags.length; i++) {
            if (fontTags[i].size === '7' || fontTags[i].getAttribute('size') === '7') {
                fontTags[i].removeAttribute('size');
                fontTags[i].style.fontSize = size + 'px';
                fontTags[i].style.lineHeight = (parseInt(size) + 2) + 'px';
            }
        }

        // Handle <span> tags (if styleWithCSS is on)
        const spans = this.editorRef.nativeElement.getElementsByTagName('span');
        for (let i = 0; i < spans.length; i++) {
            if (spans[i].style.fontSize === 'xxx-large' || spans[i].style.fontSize === '48px') {
                spans[i].style.fontSize = size + 'px';
                spans[i].style.lineHeight = (parseInt(size) + 2) + 'px';
            }
        }
    }

    setTextColor(color: string) {
        this.currentColor = color;
        this.execCommand('foreColor', color);
    }

    checkActiveStyles() {
        this.isBold = document.queryCommandState('bold');
        this.isItalic = document.queryCommandState('italic');
        this.isUnderline = document.queryCommandState('underline');
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
