import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppIconComponent } from './components/icons/app-icon.component';
import { CompanyDisplayComponent } from './components/company-display/company-display.component';
import { MessageListSkeletonComponent } from './components/skeletons/message-list-skeleton.component';
import { AnnouncementListSkeletonComponent } from './components/skeletons/announcement-list-skeleton.component';
import { DropdownMenuComponent } from './components/dropdown-menu/dropdown-menu.component';
import { RichTextEditorComponent } from './components/rich-text-editor/rich-text-editor.component';

import { ClickOutsideDirective } from './directives/click-outside.directive';

@NgModule({
    imports: [
        CommonModule,
        AppIconComponent,
        CompanyDisplayComponent,
        MessageListSkeletonComponent,
        RichTextEditorComponent,
        ClickOutsideDirective
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
        ClickOutsideDirective
    ]
})
export class SharedModule { }
