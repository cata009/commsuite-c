import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { ClickOutsideDirective } from '../../shared/directives/click-outside.directive';

import { MessagesComponent } from './messages.component';
import { MessageListComponent } from './message-list/message-list.component';
import { ConversationDetailComponent } from './conversation-detail/conversation-detail.component';
import { NewMessageComponent } from './new-message/new-message.component';
import { ForwardConversationComponent } from './forward-conversation/forward-conversation.component';
import { TodoMessagesSectionComponent } from './conversation-detail/components/todo-messages-section/todo-messages-section.component';
import { FilterPanelComponent } from './message-list/components/filter-panel/filter-panel.component';
import { CheckboxComponent } from '@/app/shared/components/checkbox/checkbox.component';
import { CompanyDisplayComponent } from '@/app/shared/components/company-display/company-display.component';

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
        ForwardConversationComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        FormsModule,
        RouterModule.forChild(routes),
        TodoMessagesSectionComponent,
        FilterPanelComponent,
        CheckboxComponent,
        CompanyDisplayComponent
    ],
    exports: [MessagesComponent]
})
export class MessagesModule { }
