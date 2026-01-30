import { Component } from '@angular/core';

@Component({
  selector: 'app-left-nav',
  template: `
    <div class="w-[68px] h-full flex flex-col items-center py-4 bg-[#f5f5f5] border-r border-[#e6e6e6] gap-2">
      <ng-container *ngFor="let item of navItems">
            <div class="relative w-full flex justify-center py-1">
                <!-- Vertical Indicator - 2.5px width with rounded ends -->
                <div *ngIf="rla.isActive" class="absolute left-[2px] top-0 bottom-0 w-[2.5px] bg-[#007a91] rounded-full"></div>
                
                <a
                    [routerLink]="['/' + item.id]"
                    routerLinkActive="active"
                    #rla="routerLinkActive"
                    [attr.title]="item.label"
                    class="w-10 h-10 flex items-center justify-center transition-colors"
                    [ngClass]="rla.isActive ? 'text-[#007a91]' : 'text-[#666666] hover:text-[#007a91]'"
                >
                    <app-icon 
                        [name]="item.icon" 
                        [isActive]="rla.isActive"
                    ></app-icon>
                </a>
            </div>
      </ng-container>

      <div class="mt-auto flex flex-col gap-4 items-center mb-2">
         <div class="relative w-full flex justify-center py-1">
              <!-- Vertical Indicator - 2.5px width with rounded ends -->
              <div *ngIf="rlaSettings.isActive" class="absolute left-[2px] top-0 bottom-0 w-[2.5px] bg-[#007a91] rounded-full"></div>
              
              <a 
                 routerLink="/settings"
                 routerLinkActive="active"
                 #rlaSettings="routerLinkActive"
                 title="Settings"
                 class="w-10 h-10 flex items-center justify-center transition-colors"
                 [ngClass]="rlaSettings.isActive ? 'text-[#007a91]' : 'text-[#666666] hover:text-[#007a91]'"
              >
                 <app-icon name="settings" [isActive]="rlaSettings.isActive"></app-icon>
              </a>
          </div>
          
          <!-- User Profile -->
          <div class="w-7 h-7 rounded-full bg-[#e5e5e5] flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity" title="User Profile">
             <span class="text-xs font-bold text-[#262626]">ES</span>
          </div>
      </div>
    </div>
  `
})
export class LeftNavComponent {
  navItems = [
    { id: 'messages', label: 'Messages', icon: 'messages' },
    { id: 'announcements', label: 'Announcements', icon: 'announcements' },
    { id: 'contacts', label: 'Contacts', icon: 'contacts' }
  ];
}
