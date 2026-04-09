import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { SharedModule } from '@/app/shared/shared.module';
import { AppComponent } from '@/app/app.component';
import { LeftNavComponent } from '@/app/layout/left-nav/left-nav.component';
import { AppHeaderComponent } from '@/app/layout/app-header/app-header.component';
import { ClickOutsideDirective } from '@/app/shared/directives/click-outside.directive';
import { NotificationComponent } from '@/app/shared/components/notification/notification.component';

const routes: Routes = [
    { path: '', redirectTo: 'messages', pathMatch: 'full' },
    {
        path: 'messages',
        loadChildren: () => import('@/app/features/messages/messages.module').then(m => m.MessagesModule)
    },
    {
        path: 'announcements',
        loadChildren: () => import('@/app/features/announcements/announcements.module').then(m => m.AnnouncementsModule)
    },
    // Simple check for settings route to avoid crash if clicked
    { path: 'settings', redirectTo: 'messages' },
    { path: '**', redirectTo: 'messages' }
];

@NgModule({
    declarations: [
        AppComponent,
        LeftNavComponent,
        AppHeaderComponent,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule, // Added animations module
        HttpClientModule,
        SharedModule,
        NotificationComponent,
        RouterModule.forRoot(routes)
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
