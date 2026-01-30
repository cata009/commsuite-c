import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AnnouncementsService } from '@/app/core/services/announcements.service';
import { Announcement } from '@/app/core/models';

@Component({
    selector: 'app-announcements',
    template: `
    <div class="flex-1 flex flex-col h-full bg-white relative z-0">
      <!-- Header -->
      <div class="flex items-center justify-between border-b border-[#e6e6e6] bg-white min-h-[73px] px-3 py-4 shrink-0 z-20 relative">
        <h2 class="text-[26px] font-bold text-[#262626]" style="font-family: 'UniCredit'; line-height: normal; font-feature-settings: 'liga' off, 'clig' off;">Announcements</h2>
      </div>

      <!-- Main Content -->
      <div class="flex-1 relative min-h-0">
        <div class="absolute inset-0 flex overflow-hidden">
            
            <!-- List Panel -->
            <app-announcement-list
                [announcements]="announcements"
                [isLoading]="isLoading"
                [selectedAnnouncementId]="selectedAnnouncementId"
                [searchQuery]="searchQuery"
                [isCollapsed]="isListCollapsed"
                (selectAnnouncement)="onSelectAnnouncement($event)"
                (toggleCollapse)="isListCollapsed = !isListCollapsed"
                (searchChange)="searchQuery = $event"
                (toggleTodo)="onToggleTodo($event)"
                (deleteAnnouncement)="onDeleteAnnouncement($event)"
            ></app-announcement-list>

            <!-- Detail Panel -->
            <app-announcement-detail
                class="flex-1 min-w-0 relative z-20 bg-white"
                [announcementId]="selectedAnnouncementId"
                [searchQuery]="searchQuery"
                [announcement]="selectedAnnouncement"
                (toggleReadStatus)="onToggleReadStatus()"
                (toggleTodo)="onToggleTodoFromDetail()"
                (deleteAnnouncement)="onDeleteFromDetail()"
            ></app-announcement-detail>

            <!-- Vertical Divider -->
            <div *ngIf="isListCollapsed" class="absolute left-0 top-0 bottom-0 w-px bg-[#e6e6e6] z-0 pointer-events-none"></div>
        </div>

        <!-- Expand Button -->
        <button
          *ngIf="isListCollapsed"
          (click)="isListCollapsed = false"
          class="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-[30px] h-[30px] bg-[#007a91] shadow-[2px_2px_7px_0_rgba(0,0,0,0.25)] hover:bg-[#006577] flex items-center justify-center transition-colors z-[100]"
          style="border-radius: 8px;"
          title="Expand announcements list"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>
    </div>
  `
})
export class AnnouncementsComponent implements OnInit {
    announcements: Announcement[] = [];
    isLoading = true;
    searchQuery = '';
    selectedAnnouncementId: string | null = null;
    isListCollapsed = false;

    constructor(
        private announcementsService: AnnouncementsService,
        private route: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit() {
        this.announcementsService.getAllAnnouncements().subscribe({
            next: (data) => {
                this.announcements = data;
                this.isLoading = false;

                // Check initial route param
                // Note: In real app, we might need to wait for data before setting selection if we want to validate ID
            },
            error: (err) => {
                console.error(err);
                this.isLoading = false;
            }
        });

        this.route.paramMap.subscribe(params => {
            const id = params.get('id');
            if (id) {
                this.selectedAnnouncementId = id;
                this.announcementsService.setLastSelectedId(id);
                this.markAsRead(id);
            } else {
                const lastId = this.announcementsService.getLastSelectedId();
                if (lastId) {
                    this.router.navigate(['/announcements', lastId], { replaceUrl: true });
                }
            }
        });
    }

    get selectedAnnouncement() {
        return this.announcements.find(a => a.id === this.selectedAnnouncementId) || null;
    }

    onSelectAnnouncement(id: string) {
        this.selectedAnnouncementId = id;
        this.announcementsService.setLastSelectedId(id);
        this.router.navigate(['/announcements', id]);
        this.markAsRead(id);
    }

    markAsRead(id: string) {
        if (!this.announcements.length) return;
        this.announcements = this.announcements.map(a =>
            a.id === id && !a.isRead ? { ...a, isRead: true } : a
        );
    }

    onToggleReadStatus() {
        if (this.selectedAnnouncementId) {
            const id = this.selectedAnnouncementId;
            this.announcements = this.announcements.map(a =>
                a.id === id ? { ...a, isRead: !a.isRead } : a
            );
        }
    }

    onToggleTodo(id: string) {
        this.announcements = this.announcements.map(a =>
            a.id === id ? { ...a, hasTodo: !a.hasTodo } : a
        );
    }

    onToggleTodoFromDetail() {
        if (this.selectedAnnouncementId) {
            this.onToggleTodo(this.selectedAnnouncementId);
        }
    }

    onDeleteAnnouncement(ids: string | string[]) {
        const idsToDelete = Array.isArray(ids) ? ids : [ids];
        this.announcements = this.announcements.map(a => {
            if (idsToDelete.includes(a.id)) {
                return { ...a, folder: 'Deleted' }; // Mock deletion (move to Deleted folder)
            }
            return a;
        });

        // If filtering logic hides deleted items, they will disappear from view in child component
        // If we are viewing a deleted item, navigate away if needed
        if (this.selectedAnnouncementId && idsToDelete.includes(this.selectedAnnouncementId)) {
            this.router.navigate(['/announcements']);
        }
    }

    onDeleteFromDetail() {
        if (this.selectedAnnouncementId) {
            this.onDeleteAnnouncement(this.selectedAnnouncementId);
        }
    }
}
