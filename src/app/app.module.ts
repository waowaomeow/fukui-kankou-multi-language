import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MarkdownModule } from 'ngx-markdown';

import { AppComponent } from './app.component'; // 确保路径正确
import { RouterOutlet } from '@angular/router';
import { ChatPageComponent } from './chat-page/chat-page.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { HttpClientModule } from '@angular/common/http';
import { NzModalModule } from 'ng-zorro-antd/modal';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    MarkdownModule.forRoot(),RouterOutlet,ChatPageComponent,CommonModule,FormsModule,NzIconModule,NzDividerModule,HttpClientModule,NzModalModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }