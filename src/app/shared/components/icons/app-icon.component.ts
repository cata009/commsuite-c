import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { APP_ICONS } from '@/app/core/registry/icons.registry';

@Component({
  selector: 'app-icon',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span 
        class="d-inline-flex align-items-center justify-center"
        [class]="className"
        [style.width]="cssSize"
        [style.height]="cssSize"
        [style.color]="color"
        style="display: inline-flex; line-height: 0;"
        [innerHTML]="svgContent">
    </span>
  `
})
export class AppIconComponent {
  @Input() name!: string;
  @Input() isActive: boolean = false;
  @Input() size: number | string = 24;
  @Input() className: string = '';

  constructor(private sanitizer: DomSanitizer) { }

  get svgContent(): SafeHtml {
    let svg = APP_ICONS[this.name];
    if (!svg) {
      console.warn(`Icon not found: ${this.name}`);
      return '';
    }
    return this.sanitizer.bypassSecurityTrustHtml(svg);
  }

  get color() {
    if (this.isActive) return '#007A91';
    // Return undefined to inherit color (currentColor behavior)
    return undefined;
  }

  get cssSize(): string {
    if (typeof this.size === 'number' || !isNaN(Number(this.size))) {
      return `${this.size}px`;
    }
    return this.size as string;
  }
}
