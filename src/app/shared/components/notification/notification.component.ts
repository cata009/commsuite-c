import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { animate, style, transition, trigger } from '@angular/animations';
import { NotificationService, Notification } from '@/app/core/services/notification.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="notification" 
         [@fadeAnimation]
         class="fixed top-[88px] right-[24px] z-[9999] inline-flex flex-col p-[24px] gap-[12px] rounded-[4px] bg-[#CF3524] shadow-lg max-w-[450px]"
    >
      <div class="flex items-start justify-between gap-[12px]">
        <div class="flex flex-col gap-[12px]">
          <span class="text-white font-bold text-[16px] leading-[22px]" style="font-family: 'UniCredit';">
            {{ notification.title }}
          </span>
          <span class="text-white font-normal text-[14px] leading-[20px]" style="font-family: 'UniCredit';">
            {{ notification.message }}
          </span>
        </div>
        <button (click)="close()" class="p-1 hover:opacity-80 transition-opacity outline-none cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M18.1431 0L10 8.14313L1.85625 0L0 1.85687L8.14313 10L0 18.1431L1.85625 20L10 11.8569L18.1431 20L20 18.1431L11.8569 10L20 1.85687L18.1431 0Z" fill="white"/>
          </svg>
        </button>
      </div>
    </div>
  `,
  animations: [
    trigger('fadeAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ opacity: 0, transform: 'translateY(-20px)' }))
      ])
    ])
  ]
})
export class NotificationComponent implements OnInit, OnDestroy {
  notification: Notification | null = null;
  private subscription?: Subscription;
  private timer?: any;

  constructor(private notificationService: NotificationService) { }

  ngOnInit() {
    this.subscription = this.notificationService.notification$.subscribe(n => {
      this.notification = n;
      if (this.timer) clearTimeout(this.timer);

      if (n) {
        this.timer = setTimeout(() => {
          this.close();
        }, 5000);
      }
    });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
    if (this.timer) clearTimeout(this.timer);
  }

  close() {
    this.notificationService.clear();
  }
}
