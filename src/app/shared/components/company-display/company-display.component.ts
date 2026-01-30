import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-company-display',
  standalone: true,
  imports: [CommonModule],
  template: `
    <ng-container *ngIf="companies && companies.length > 0">
      <!-- Single Company -->
      <div *ngIf="companies.length === 1" 
           class="truncate block cursor-default"
           [ngClass]="[baseClasses, maxWidth]"
           [title]="companies[0]">
        {{ companies[0] }}
      </div>

      <!-- Multiple Companies -->
      <div *ngIf="companies.length > 1" 
           class="cursor-default whitespace-nowrap"
           [ngClass]="baseClasses"
           [title]="companies.join('\\n')">
        {{ companies.length }} COMPANIES
      </div>
    </ng-container>
  `,
  styles: [`
    :host {
      font-feature-settings: 'liga' off, 'clig' off;
      font-family: 'UniCredit', sans-serif;
    }
  `]
})
export class CompanyDisplayComponent {
  @Input() companies: string[] = [];
  @Input() textSize: string = 'text-sm';
  @Input() isBold: boolean = true;
  @Input() maxWidth: string = 'max-w-full';

  get baseClasses(): string {
    const fontWeight = this.isBold ? 'font-bold' : 'font-normal';
    return `${this.textSize} ${fontWeight} text-[#262626] uppercase transition-colors hover:text-[#007a91]`;
  }
}
