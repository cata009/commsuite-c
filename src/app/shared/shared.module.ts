import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppIconComponent } from '@/app/shared/components/icons/app-icon.component';
import { CompanyDisplayComponent } from '@/app/shared/components/company-display/company-display.component';
import { MessageListSkeletonComponent } from '@/app/shared/components/skeletons/message-list-skeleton.component';
import { AnnouncementListSkeletonComponent } from '@/app/shared/components/skeletons/announcement-list-skeleton.component';
import { DropdownMenuComponent } from '@/app/shared/components/dropdown-menu/dropdown-menu.component';
import { RichTextEditorComponent } from '@/app/shared/components/rich-text-editor/rich-text-editor.component';

import { ClickOutsideDirective } from '@/app/shared/directives/click-outside.directive';
import { HighlightSearchPipe } from '@/app/shared/pipes/highlight-search.pipe';

@NgModule({
    imports: [
        CommonModule,
        AppIconComponent,
        CompanyDisplayComponent,
        MessageListSkeletonComponent,
        RichTextEditorComponent,
        ClickOutsideDirective,
        HighlightSearchPipe
    ],
    declarations: [
        AnnouncementListSkeletonComponent,
        DropdownMenuComponent
    ],
    exports: [
        AppIconComponent,
        CompanyDisplayComponent,
        MessageListSkeletonComponent,
        AnnouncementListSkeletonComponent,
        DropdownMenuComponent,
        RichTextEditorComponent,
        ClickOutsideDirective,
        HighlightSearchPipe
    ]
})
export class SharedModule { }