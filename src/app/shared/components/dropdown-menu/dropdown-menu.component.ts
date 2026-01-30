import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { CommonModule } from '@angular/common';

export interface DropdownItem {
  label: string;
  icon?: string; // name in app-icon
  iconClass?: string;
  action: () => void;
  style?: any;
}

@Component({
  selector: 'app-dropdown-menu',
  template: `
    <div class="relative inline-flex h-full text-left" (clickOutside)="close()" #container>
      <div (click)="toggle($event)">
        <ng-content select="[trigger]"></ng-content>
      </div>

      <div *ngIf="isOpen" 
           [@dropdownAnimation]
           [ngClass]="{
             'bottom-full mb-2': computedPosition === 'top',
             'top-full mt-2': computedPosition === 'bottom'
           }"
           class="absolute right-0 origin-top-right bg-white border border-[#262626] rounded-[4px] shadow-2xl z-50 ring-1 ring-black ring-opacity-5 focus:outline-none backdrop-blur-sm"
           [style.min-width.px]="minWidth">
        <div role="menu" aria-orientation="vertical">
          <ng-content select="[items]"></ng-content>
        </div>
      </div>
    </div>
  `,
  styles: [],
  animations: [
    trigger('dropdownAnimation', [
      transition(':enter', [
        style({
          opacity: 0,
          transform: 'scale(0.95) translateY(-10px)'
        }),
        animate('200ms cubic-bezier(0.34, 1.56, 0.64, 1)',
          style({
            opacity: 1,
            transform: 'scale(1) translateY(0)'
          })
        )
      ]),
      transition(':leave', [
        animate('150ms ease-in',
          style({
            opacity: 0,
            transform: 'scale(0.95) translateY(-5px)'
          })
        )
      ])
    ])
  ]
})
export class DropdownMenuComponent {
  @Input() minWidth: number = 150;
  @Input() position: 'top' | 'bottom' | 'auto' = 'bottom';
  @ViewChild('container') container!: ElementRef;

  isOpen = false;
  computedPosition: 'top' | 'bottom' = 'bottom';

  private static openMenus: DropdownMenuComponent[] = [];

  toggle(event: Event) {
    event.stopPropagation();

    if (!this.isOpen) {
      this.calculatePosition();

      // Close unrelated menus (those that do NOT contain this one)
      while (DropdownMenuComponent.openMenus.length > 0) {
        const top = DropdownMenuComponent.openMenus[DropdownMenuComponent.openMenus.length - 1];
        if (top.container.nativeElement.contains(this.container.nativeElement)) {
          break;
        }
        top.close();
      }

      DropdownMenuComponent.openMenus.push(this);
      this.isOpen = true;
    } else {
      this.close();
    }
  }

  calculatePosition() {
    if (this.position !== 'auto') {
      this.computedPosition = this.position;
      return;
    }

    if (this.container) {
      const rect = this.container.nativeElement.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;

      // If less than 250px below and more space above, flip to top
      this.computedPosition = (spaceBelow < 250 && spaceAbove > spaceBelow) ? 'top' : 'bottom';
    }
  }

  close() {
    if (!this.isOpen) return;
    this.isOpen = false;
    const index = DropdownMenuComponent.openMenus.indexOf(this);
    if (index > -1) {
      DropdownMenuComponent.openMenus.splice(index, 1);
    }
  }
}
