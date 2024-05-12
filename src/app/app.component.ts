import { Component,Input } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ChatPageComponent } from './chat-page/chat-page.component';
import { CommonModule } from '@angular/common';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzDividerModule } from 'ng-zorro-antd/divider';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,ChatPageComponent,CommonModule,FormsModule,NzIconModule,NzDividerModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'test-app';
}
