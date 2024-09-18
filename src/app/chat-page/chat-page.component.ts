import { ChangeDetectorRef, Component, ElementRef, Input, Renderer2, ViewChild, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { ChatContentComponent } from '../chat-content/chat-content.component';
import { ChatServiceService, LanguageModal } from '../service/chat-service.service';
import { ChatCompletion, ChatResponse, Message, ViewMessage } from '../interface/chat-interface';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { CommonModule } from '@angular/common';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { HistoryPageComponent } from '../history-page/history-page.component';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzSelectModule } from 'ng-zorro-antd/select';

enum LanguageType{
  GPT4_Turbo = '1',
  GPT35_Turbo = '2',
  GPT4_32k = '3'
}
@Component({
  selector: 'app-chat-page',
  standalone: true,
  imports: [FormsModule, NzButtonModule, NzInputModule, ChatContentComponent, NzIconModule, CommonModule, NzDividerModule, NzDrawerModule, HistoryPageComponent, NzMessageModule, NzRadioModule, NzSelectModule],
  templateUrl: './chat-page.component.html',
  styleUrl: './chat-page.component.css'
})
export class ChatPageComponent {

  @ViewChild('inputarea') inputArea!: ElementRef
  @ViewChild(ChatContentComponent) private chatContent!: ChatContentComponent
  @Input() query: string = ''


  constructor(private renderer: Renderer2, private chatService: ChatServiceService, private errorMessage: NzMessageService, private cdr: ChangeDetectorRef) { }

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

  languageModal= LanguageType.GPT4_Turbo
  currentAssisText:string = ''

  sendQuery() {
    if (this.query.trim()) {
      console.log('query start');
      let queryContent = this.query;
      this.query = '';
      this.messages.push({content: queryContent,role: 'user',sort: this.sort++});
      this.chatContent.isloading = true;
      let modalType = LanguageModal.GPT4_Turbo;
      console.log(this.languageModal);
      if (this.languageModal == LanguageType.GPT4_Turbo) {
        modalType = LanguageModal.GPT4_Turbo;
      } else if (this.languageModal == LanguageType.GPT35_Turbo) {
        modalType = LanguageModal.GPT35_Turbo;
      } else if (this.languageModal == LanguageType.GPT4_32k) {
        modalType = LanguageModal.GPT4_32k;
      }
      this.chatService.sendQuery(this.messages, modalType).subscribe({
        next: (res: ChatCompletion) => {
          let data = res;
          this.chatContent.isloading = false;
          this.messages.push({
            content: data.choices[0].message.content,
            role: data.choices[0].message.role,
            sort: this.sort++,
          });
          this.currentAssisText = data.choices[0].message.content;
          this.speechStart();
        },
        error: (err) => {
          this.chatContent.isloading = false;
          this.errorMessage.error(err.error.error.message, {
            nzDuration: 5000,
          });
          console.log(err);
        },
      });
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

  recognition = new ((window as any).webkitSpeechRecognition)()
  speechSynth = window.speechSynthesis
  isRecognit = false
  langSetting = 'zh-CN'

  speechStart(){
    if('speechSynthesis' in window){
      const utterance = new SpeechSynthesisUtterance(this.currentAssisText);
      this.speechSynth.speak(utterance);
    }
  }

  langSetChange() {
    this.recognition.stop();
  }

  final_transcript = ''
  interim_transcript = ''

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

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            this.final_transcript += event.results[i][0].transcript;
            this.query = this.final_transcript
          } else {
            this.interim_transcript += event.results[i][0].transcript;
            this.query = this.interim_transcript
          }
        }
        this.cdr.detectChanges();
      };

      // 处理错误
      this.recognition.onerror = (event: any) => {
        console.error(event);
      };

      // 监听结束事件
      this.recognition.onend = () => {
        // 你可以在这里重新启动识别器或进行其他操作
        console.log('Speech recognition service disconnected');

        this.final_transcript = ''
        this.interim_transcript = ''
        this.isRecognit = false
      };
    } else {
      console.error('此浏览器不支持 Web Speech API');
      this.isRecognit = false
    }
  }

  recogStop() {
    this.recognition.stop()
    this.final_transcript = ''
    this.interim_transcript = ''
    this.isRecognit = false
  }

}
