import { AfterViewChecked, Component, ElementRef, Input, SimpleChanges, ViewChild } from '@angular/core';
import { ViewMessage } from '../interface/chat-interface';
import { CommonModule } from '@angular/common';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { MarkdownModule } from 'ngx-markdown';

@Component({
  selector: 'app-chat-content',
  standalone: true,
  imports: [CommonModule, NzSpinModule, MarkdownModule],
  templateUrl: './chat-content.component.html',
  styleUrls: ['./chat-content.component.css']
})
export class ChatContentComponent implements AfterViewChecked {
  @Input() messages!: Array<ViewMessage>;
  @ViewChild('chatMessageContainer') private chatMessageContainer!: ElementRef;
  isloading = false;

  show() {
    console.log(this.messages);
  }

  convertNewlinesToHtml(text: string): string {
    return text.replace(/\n/g, '<br>');
  }

  ngAfterViewChecked() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['messages'] && !changes['messages'].firstChange) {
      this.addContentAndScroll();
    }
  }

  messageContentscrollToBottom(): void {
    this.chatMessageContainer.nativeElement.scroll({
      top: this.chatMessageContainer.nativeElement.scrollHeight,
      left: 0,
      behavior: 'smooth'
    });
  }

  addContentAndScroll(): void {
    setTimeout(() => this.messageContentscrollToBottom(), 0);
  }
}
