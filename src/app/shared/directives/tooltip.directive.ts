import { Directive, ElementRef, HostListener, Input, Renderer2, OnDestroy } from '@angular/core';

@Directive({
    selector: '[appTooltip]',
    standalone: true
})
export class TooltipDirective implements OnDestroy {
    @Input('appTooltip') tooltipText: string = '';

    private tooltipElement: HTMLElement | null = null;

    constructor(private el: ElementRef, private renderer: Renderer2) { }

    @HostListener('mouseenter') onMouseEnter() {
        if (!this.tooltipText) return;
        this.showTooltip();
    }

    @HostListener('mouseleave') onMouseLeave() {
        this.hideTooltip();
    }

    private showTooltip() {
        this.tooltipElement = this.renderer.createElement('div');
        this.renderer.addClass(this.tooltipElement, 'custom-tooltip');

        const text = this.renderer.createText(this.tooltipText);
        this.renderer.appendChild(this.tooltipElement, text);

        this.renderer.appendChild(document.body, this.tooltipElement);

        const hostPos = this.el.nativeElement.getBoundingClientRect();
        const tooltipPos = this.tooltipElement.getBoundingClientRect();

        const top = hostPos.top - tooltipPos.height - 8;
        const left = hostPos.left + (hostPos.width - tooltipPos.width) / 2;

        this.renderer.setStyle(this.tooltipElement, 'top', `${top}px`);
        this.renderer.setStyle(this.tooltipElement, 'left', `${left}px`);
    }

    private hideTooltip() {
        if (this.tooltipElement) {
            this.renderer.removeChild(document.body, this.tooltipElement);
            this.tooltipElement = null;
        }
    }

    ngOnDestroy() {
        this.hideTooltip();
    }
}
