import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { Announcement } from '../models';
import { announcementsData } from '../mock/announcements.data';

@Injectable({
    providedIn: 'root'
})
export class AnnouncementsService {
    private lastSelectedAnnouncementId: string | null = null;
    private readonly NETWORK_DELAY = 500; // ms

    constructor() { }

    setLastSelectedId(id: string | null) {
        this.lastSelectedAnnouncementId = id;
    }

    getLastSelectedId(): string | null {
        return this.lastSelectedAnnouncementId;
    }

    getAllAnnouncements(): Observable<Announcement[]> {
        return of(announcementsData).pipe(delay(this.NETWORK_DELAY));
    }

    getAnnouncements(folder: string = 'Inbox', searchQuery?: string): Observable<Announcement[]> {
        return of(announcementsData).pipe(
            delay(this.NETWORK_DELAY),
            map(announcements => {
                let results = announcements.filter(a => a.folder === folder);

                if (searchQuery) {
                    const query = searchQuery.toLowerCase();
                    results = results.filter(a =>
                        (a.title || '').toLowerCase().includes(query) ||
                        (a.preview || '').toLowerCase().includes(query) ||
                        (a.content || '').toLowerCase().includes(query)
                    );
                }

                return results;
            })
        );
    }

    getAnnouncementById(id: string): Observable<Announcement | undefined> {
        return of(announcementsData.find(a => a.id === id)).pipe(delay(this.NETWORK_DELAY));
    }
}
