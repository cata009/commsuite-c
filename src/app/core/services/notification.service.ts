import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Notification {
    title: string;
    message: string;
    type: 'error' | 'success'; // can expand later
}

@Injectable({
    providedIn: 'root'
})
export class NotificationService {
    private notificationSubject = new BehaviorSubject<Notification | null>(null);
    notification$ = this.notificationSubject.asObservable();

    showError(title: string, message: string) {
        this.notificationSubject.next({ title, message, type: 'error' });
    }

    clear() {
        this.notificationSubject.next(null);
    }
}
