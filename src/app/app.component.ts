import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationComponent } from './shared/components/notification/notification.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Commsuite';

  onNewMessage() {
    console.log('New message clicked in header');
  }
}
