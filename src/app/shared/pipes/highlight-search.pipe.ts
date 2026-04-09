import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { highlightText } from '@/app/core/utils/search.utils';

@Pipe({
    name: 'highlightSearch',
    standalone: true
})
export class HighlightSearchPipe implements PipeTransform {
    constructor(private sanitizer: DomSanitizer) { }

    transform(value: string | undefined | null, search: string): SafeHtml {
        if (!value) return '';
        if (!search) {
            return this.sanitizer.bypassSecurityTrustHtml(value);
        }
        const highlighted = highlightText(value, search);
        return this.sanitizer.bypassSecurityTrustHtml(highlighted);
    }
}
