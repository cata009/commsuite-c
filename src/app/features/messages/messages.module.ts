import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '@/app/shared/shared.module';
import { ClickOutsideDirective } from '@/app/shared/directives/click-outside.directive';
import { RichTextEditorComponent } from '@/app/shared/components/rich-text-editor/rich-text-editor.component';

import { MessagesComponent } from '@/app/features/messages/messages.component';
import { MessageListComponent } from '@/app/features/messages/message-list/message-list.component';
import { ConversationDetailComponent } from '@/app/features/messages/conversation-detail/conversation-detail.component';
import { NewMessageComponent } from '@/app/features/messages/new-message/new-message.component';
import { ForwardConversationComponent } from '@/app/features/messages/forward-conversation/forward-conversation.component';
import { TodoMessagesSectionComponent } from '@/app/features/messages/conversation-detail/components/todo-messages-section/todo-messages-section.component';
import { FilterPanelComponent } from '@/app/features/messages/message-list/components/filter-panel/filter-panel.component';
import { CheckboxComponent } from '@/app/shared/components/checkbox/checkbox.component';
import { CompanyDisplayComponent } from '@/app/shared/components/company-display/company-display.component';
import { RecipientPickerComponent } from '@/app/shared/components/recipient-picker/recipient-picker.component';
import { ListHeaderComponent } from '@/app/shared/components/list-header/list-header.component';
import { AttachmentStripComponent } from '@/app/shared/components/attachment-strip/attachment-strip.component';

const routes: Routes = [
    { path: '', component: MessagesComponent },
    { path: 'new', component: NewMessageComponent },
    { path: 'forward/:id', component: MessagesComponent, data: { mode: 'forward' } },
    { path: ':id', component: MessagesComponent }
];

@NgModule({
    declarations: [
        MessagesComponent,
        MessageListComponent,
        ConversationDetailComponent,
        NewMessageComponent,

    ],
    imports: [
        CommonModule,
        SharedModule,
        FormsModule,
        RouterModule.forChild(routes),
        TodoMessagesSectionComponent,
        FilterPanelComponent,
        CheckboxComponent,
        CompanyDisplayComponent,
        CompanyDisplayComponent,
        RichTextEditorComponent,
        ForwardConversationComponent,
        RecipientPickerComponent,
        ListHeaderComponent,
        AttachmentStripComponent
    ],
    exports: [MessagesComponent]
})
export class MessagesModule { }
