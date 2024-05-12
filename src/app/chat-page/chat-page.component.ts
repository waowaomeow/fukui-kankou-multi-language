import { ChangeDetectorRef, Component, ElementRef, Input, Renderer2, ViewChild, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { ChatContentComponent } from '../chat-content/chat-content.component';
import { ChatServiceService } from '../service/chat-service.service';
import { ChatResponse, Message, ViewMessage } from '../interface/chat-interface';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { CommonModule } from '@angular/common';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { HistoryPageComponent } from '../history-page/history-page.component';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzRadioModule } from 'ng-zorro-antd/radio';
@Component({
  selector: 'app-chat-page',
  standalone: true,
  imports: [FormsModule, NzButtonModule, NzInputModule, ChatContentComponent, NzIconModule, CommonModule, NzDividerModule, NzDrawerModule, HistoryPageComponent, NzMessageModule,NzRadioModule],
  templateUrl: './chat-page.component.html',
  styleUrl: './chat-page.component.css'
})
export class ChatPageComponent {

  @ViewChild('inputarea') inputArea!: ElementRef
  @ViewChild(ChatContentComponent) private chatContent!: ChatContentComponent
  @Input() query: string=''

  
  constructor(private renderer: Renderer2, private chatService: ChatServiceService, private errorMessage: NzMessageService,private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
  }

  messages = new Array<ViewMessage>
  historyMessages = new Array<Array<ViewMessage>>

  // 控制history内容可见
  visible = false;

  sort = 0

  inputAreaFocus() {
    console.log('1')
    this.renderer.setStyle(this.inputArea.nativeElement, 'background-color', 'white');
    this.renderer.setStyle(this.inputArea.nativeElement, 'box-shadow', '0 1px 4px #00000014');
    this.renderer.setStyle(this.inputArea.nativeElement, 'border-color', '#c4c4c4');
    this.renderer.setStyle(this.inputArea.nativeElement, 'border-style', 'solid');
    this.renderer.setStyle(this.inputArea.nativeElement, 'border-width', '1px');

  }

  inputAreaBlur() {
    this.renderer.setStyle(this.inputArea.nativeElement, 'background-color', '#f7f7f7');
    this.renderer.setStyle(this.inputArea.nativeElement, 'border-style', 'none');
  }

  sendQuery() {
    if (this.query.trim() !== '' && this.query.trim() !== null) {
      console.log('query start ')
      let queryContent = this.query
      this.query = ''
      this.messages.push({ content: queryContent, role: 'user', sort: this.sort++ })
      this.chatContent.isloading = true
      this.chatService.sendQuery(this.messages).subscribe({
        next: (res) => {
          let data = res as ChatResponse
          this.chatContent.isloading = false
          this.messages.push({ content: data.choices[0].message.content, role: data.choices[0].message.role, sort: this.sort++ })
        },
        error: err => {
          this.chatContent.isloading = false
          this.errorMessage.error(err.error.error.message, { nzDuration: 5000 })
          console.log(err)
        }
      }

      )
    }

  }

  handleKeyDown(event: KeyboardEvent) {
    // 如果按下的是回车键并且没有同时按下Alt键
    if (event.key === 'Enter' && !event.altKey) {
      // 阻止默认的回车键行为，即在这个例子中，阻止换行
      event.preventDefault()
      // 在这里执行回车键按下时需要做的事情
      console.log('Enter key pressed without Alt key.')
      this.sendQuery()
    }

    // 如果同时按下了Alt键和回车键
    if (event.key === 'Enter' && event.altKey) {
      // 执行换行或其他操作，但默认的textarea行为已经允许Alt+Enter换行，所以可能不需要额外操作
      console.log('Alt+Enter was pressed.')
    }
  }

  clear() {
    this.query = ''
    if (this.messages.length != 0) {
      this.historyMessages.push(this.messages)
    }
    this.messages = []
  }
  open(): void {
    this.visible = true
  }

  closeChatHistory(): void {
    this.visible = false
  }

  showChatHistory() {
    this.visible = true
  }

  loadHistoryMessage(index: number) {
    this.clear()
    this.messages = this.historyMessages[index]
    this.historyMessages.splice(index, 1)
  }

  recognition = new ((window as any).webkitSpeechRecognition )()
  isRecognit = false
  langSetting = 'zh-CN'

  langSetChange(){
    this.recognition.stop();
    this.recogStart()
  }

  recogStart() {
    // 检查浏览器是否支持 Web Speech API
    if ('webkitSpeechRecognition' in window) {
      console.log('recognition start')
      // 创建一个语音识别的实例
      this.isRecognit = true
      this.recognition.lang = this.langSetting
      this.recognition.continuous = true; // 或者设置为 true 以保持不断的监听
      this.recognition.interimResults = true; // 是否返回临时结果

      // 开始语音识别
      this.recognition.start();

      // 当识别到结果时
      this.recognition.onresult = (event: any) => {
        let transcript = ''
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript; // 获取结果
        }
        this.query = transcript
        this.cdr.detectChanges();
        console.log(transcript)
      };

      // 处理错误
      this.recognition.onerror = (event: any) => {
        console.error(event);
      };

      // 监听结束事件
      this.recognition.onend = () => {
        // 你可以在这里重新启动识别器或进行其他操作
        console.log('Speech recognition service disconnected');
        this.recogStop()
      };
    } else {
      console.error('此浏览器不支持 Web Speech API');
      this.isRecognit = false
    }
  }

  recogStop(){
    this.recognition.stop()
    this.isRecognit = false
  }

}
