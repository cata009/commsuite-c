import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Announcement } from '@/app/core/models';
import { highlightText } from '@/app/core/utils/search.utils';

@Component({
    selector: 'app-announcement-detail',
    styles: [`
        :host {
            display: flex;
            flex-direction: column;
            height: 100%;
            flex: 1;
            min-width: 0;
        }
    `],
    template: `
    <div *ngIf="!announcement" class="flex-1 flex flex-col items-center justify-center bg-white gap-4 h-full">
         <svg xmlns="http://www.w3.org/2000/svg" width="109" height="109" viewBox="0 0 109 109" fill="none">
           <!-- SVG Path from React Component -->
           <path fill-rule="evenodd" clip-rule="evenodd" d="M72.6294 18.2085C78.6882 14.7304 86.2913 19.0321 86.2913 25.9436V40.5321C88.0806 40.5321 89.8524 40.8795 91.5056 41.5543C93.1587 42.2292 94.6608 43.2184 95.926 44.4654C97.1913 45.7124 98.1949 47.1928 98.8796 48.8221C99.5644 50.4514 99.9168 52.1977 99.9168 53.9612C99.9168 55.7248 99.5644 57.471 98.8796 59.1003C98.1949 60.7296 97.1913 62.21 95.926 63.457C94.6608 64.704 93.1587 65.6932 91.5056 66.3681C89.8524 67.043 88.0806 67.3903 86.2913 67.3903V80.8194C86.2913 88.1965 77.7481 92.4087 71.7574 87.9816L62.4012 81.0611C57.3998 77.3656 51.5767 74.8981 45.4146 73.8631V86.5939C45.4151 89.5203 44.3423 92.3483 42.3939 94.5564C40.4454 96.7646 37.7528 98.2042 34.8122 98.6098C31.8717 99.0154 28.8815 98.3597 26.3928 96.7636C23.9042 95.1674 22.0848 92.7384 21.2702 89.9243L14.1395 65.3222C11.5734 62.3356 9.90346 58.7027 9.31733 54.8319C8.73121 50.9612 9.25214 47.006 10.8216 43.411C12.391 39.8161 14.9467 36.7238 18.2015 34.4818C21.4562 32.2399 25.2809 30.9371 29.2457 30.7199L42.953 29.9679C49.6597 29.6007 56.182 27.6692 61.9833 24.3322L72.6294 18.2085ZM25.5849 72.2158L30.0042 87.4668C30.2168 88.205 30.6933 88.8425 31.3457 89.2615C31.998 89.6804 32.7822 89.8526 33.5533 89.7462C34.3244 89.6398 35.0304 89.2621 35.541 88.6827C36.0515 88.1032 36.3321 87.3613 36.3309 86.5939V73.1201L29.2457 72.7306C28.0132 72.6574 26.7889 72.4852 25.5849 72.2158ZM90.8331 53.9612C90.8331 52.774 90.3546 51.6354 89.5029 50.796C88.6511 49.9565 87.4959 49.4849 86.2913 49.4849V58.4376C87.4959 58.4376 88.6511 57.966 89.5029 57.1265C90.3546 56.287 90.8331 55.1484 90.8331 53.9612Z" fill="#CCCCCC" />
          </svg>
          <p class="text-unicredit-text-secondary">Select an announcement to view details</p>
    </div>

    <div *ngIf="announcement" class="flex-1 flex flex-col bg-white h-full overflow-hidden">
        <!-- Header -->
        <div class="border-b border-unicredit-gray bg-white px-6 py-4 flex items-center justify-between sticky top-0 z-10">
            <h2 class="text-xl font-bold text-unicredit-text flex-1 truncate">{{ announcement.title }}</h2>
            
            <div class="flex items-center gap-4">
                <div *ngIf="announcement.expirationDate" class="text-sm text-unicredit-text-secondary">
                    <span class="font-semibold">Expiration:</span> {{ announcement.expirationDate }}
                </div>
                <div class="w-px h-6 bg-unicredit-gray"></div>
                
                <button class="p-1 transition-colors hover:text-unicredit-primary text-unicredit-text-secondary" (click)="toggleReadStatus.emit()">
                    <svg *ngIf="!announcement.isRead" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 16 16" fill="none">
                        <path d="M16 12.4385C16 13.9296 15.0058 14.9238 13.5146 14.9238H0V8.07422L7.95312 13.542L16 8.07422V12.4385ZM15.2598 7.02051L7.95312 12.04L0.646484 7.02051L7.95312 2L15.2598 7.02051Z" fill="currentColor"/>
                    </svg>
                    <svg *ngIf="announcement.isRead" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" class="text-unicredit-text-secondary">
                         <path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
            </div>
        </div>

        <!-- Meta Info -->
        <div class="border-b border-unicredit-gray bg-white px-6 py-3 flex items-center justify-between">
            <div class="flex items-center gap-2">
                 <!-- Companies -->
                 <app-company-display
                     [companies]="announcement.companies"
                     textSize="text-sm"
                     [isBold]="true"
                 ></app-company-display>
            </div>

            <div class="flex items-center gap-3">
                 <div *ngIf="announcement.hasTodo" class="text-unicredit-text-secondary">
                    <app-icon name="todo" size="16"></app-icon>
                 </div>
                 
                 <div 
                    class="px-2 py-1 text-xs font-bold text-white rounded"
                    [ngClass]="getStatusBadgeClass(announcement.status)"
                    style="font-size: 10px; line-height: 14px;"
                 >
                    {{ announcement.status | uppercase }}
                 </div>
            </div>
        </div>

        <!-- Content -->
        <div class="flex-1 overflow-y-auto px-6 py-6 message-list-scrollbar">
            <div class="w-full">
                <!-- Dates -->
                <div class="mb-6 text-sm text-unicredit-text-secondary">
                    <span class="font-semibold">Published:</span> {{ announcement.publishedDate }}
                </div>

                <!-- Text -->
                <div class="prose prose-sm max-w-none">
                    <div class="text-unicredit-text leading-relaxed whitespace-pre-line">
                         <div [innerHTML]="highlight(announcement.content)"></div>
                    </div>
                </div>

                <!-- Interested Button -->
                <div *ngIf="announcement.hasTodo" class="mt-8 pt-6 border-t border-unicredit-gray">
                    <button class="btn-primary">
                        I am interested
                    </button>
                </div>
            </div>
        </div>

    </div>
  `
})
export class AnnouncementDetailComponent {
    @Input() announcementId: string | null = null;
    @Input() searchQuery = '';
    @Input() announcement: Announcement | null = null;

    @Output() toggleReadStatus = new EventEmitter<void>();
    @Output() toggleTodo = new EventEmitter<void>();
    @Output() deleteAnnouncement = new EventEmitter<void>();

    getStatusBadgeClass(status: string): string {
        switch (status.toLowerCase()) {
            case 'informative': return 'bg-unicredit-primary';
            case 'important': return 'bg-unicredit-error';
            case 'recalled': return 'bg-unicredit-text-secondary';
            default: return 'bg-unicredit-primary';
        }
    }

    highlight(text: string): string {
        return highlightText(text, this.searchQuery);
    }
}
