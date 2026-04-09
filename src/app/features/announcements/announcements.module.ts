import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { ClickOutsideDirective } from '../../shared/directives/click-outside.directive';
import { CheckboxComponent } from '@/app/shared/components/checkbox/checkbox.component';
import { CompanyDisplayComponent } from '@/app/shared/components/company-display/company-display.component';
import { ListHeaderComponent } from '@/app/shared/components/list-header/list-header.component';

import { AnnouncementsComponent } from './announcements.component';
import { AnnouncementListComponent } from './announcement-list/announcement-list.component';
import { AnnouncementDetailComponent } from './announcement-detail/announcement-detail.component';
import { FilterPanelComponent } from '../messages/message-list/components/filter-panel/filter-panel.component';

const routes: Routes = [
    {
        path: '',
        component: AnnouncementsComponent,
        children: [
            { path: ':id', component: AnnouncementsComponent }
        ]
    }
];

@NgModule({
    declarations: [
        AnnouncementsComponent,
        AnnouncementListComponent,
        AnnouncementDetailComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        FormsModule,
        RouterModule.forChild(routes),
        CheckboxComponent,
        CompanyDisplayComponent,
        CompanyDisplayComponent,
        FilterPanelComponent,
        ListHeaderComponent
    ],
    exports: [AnnouncementsComponent]
})
export class AnnouncementsModule { }
