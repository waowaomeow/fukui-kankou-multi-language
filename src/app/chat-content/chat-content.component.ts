import { AfterViewChecked, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { ViewMessage } from '../interface/chat-interface';
import { CommonModule } from '@angular/common';
import { NzSpinModule } from 'ng-zorro-antd/spin';
@Component({
  selector: 'app-chat-content',
  standalone: true,
  imports: [CommonModule,NzSpinModule],
  templateUrl: './chat-content.component.html',
  styleUrl: './chat-content.component.css'
})
export class ChatContentComponent implements AfterViewChecked{

  @Input() messages!:Array<ViewMessage>
  @ViewChild('chatMessageContainer') private chatMessageContainer!:ElementRef
  isloading = false

  show(){
    console.log(this.messages)
  }
  convertNewlinesToHtml(text: string): string {
    return text.replace(/\n/g, '<br>')
  }

  ngAfterViewChecked() {
    this.addContentAndScroll()
  }

  messageContentscrollToBottom(): void {
    this.chatMessageContainer.nativeElement.scroll({
      top: this.chatMessageContainer.nativeElement.scrollHeight,
      left: 0,
      behavior: 'smooth'
    })
  }

  addContentAndScroll(): void {
    // 添加内容的逻辑...
    // 确保内容已经渲染
    setTimeout(() => this.messageContentscrollToBottom(), 0)
  }
}
