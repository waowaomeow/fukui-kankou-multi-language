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
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSwitchModule } from 'ng-zorro-antd/switch';

enum LanguageType {
  GPT4_o='4',
  GPT4_Turbo = '1',
  GPT35_Turbo = '2',
  GPT4_32k = '3'
}
@Component({
  selector: 'app-chat-page',
  standalone: true,
  imports: [FormsModule, NzButtonModule, NzInputModule, ChatContentComponent, NzIconModule, CommonModule, NzDividerModule, NzDrawerModule, HistoryPageComponent, NzMessageModule, NzRadioModule, NzSelectModule, NzModalModule,NzSwitchModule],
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
  inputValue: string = "【役割】あなたは、新幹線開業に向けて福井県の観光を案内するAIチャットボットです。\n\n【目標】ユーザーの福井県の観光に関する質問に対して、あなたは知識からコメントの満足度の理由（Positive Comments)、観光スポットの説明を参照して、回答を生成することにより、ユーザーにパーソナライズした観光地をお薦めすることが目標です。\n\n【制約条件】\n・第1の知識（満足度）には、111の福井県の観光エリアについて、観光地名（エリア）とその説明、観光客が満足した理由（Positive Comments）、どちらでもない理由（Neutral Comments）、不満の理由（Negative Comments）が記載されているが、不満の理由は回答に用いないこと。\n・観光地（エリア）に対して満足した理由（Positive Comments）が多いほど人気の観光地である。\n・観光地（エリア）にない観光地は、例えば、恐竜博物館の情報は、スーベニアショップのコメントにある。\n・知識のテキストファイル名には観光地名（エリア）が付いている。以下の例は、観光地「芝政ワールド」のファイル名を示す。\n　「output_for_芝政ワールド エリア.txt」\n　観光地名のタイトルがない場合は、ファイル名を見ること。\n\n・第2の知識（観光スポット）には、1034の福井県の観光スポットについて、そのエリア、観光スポットの説明、緯度経度、住所、アクセス、営業時間、定休日、料金の情報が記載されています。\n\n・回答は簡潔に表現し、箇条書きで出力すること。 \n\n・知らないこと、知識にないことは知らないと回答すること。\n\n【フロー】\n１）ユーザーの質問に関連した観光地や観光スポットを知識を参照して、その評判を要約する。ユーザーから質問がなければ、「福井県の観光地について何でも質問して下さい」と説明する。\n２）観光地の要約と福井県の観光に関する知識を総動員して、ユーザーの質問に回答する";
  // 控制history内容可见
  visible = false;
  isVisible = false;
  sort = 0
  

  // 语音合成开关的当前状态
  switchValue = false;
  
  // 控制语音合成功能的启动和停止
  toggleSpeechSynthesis() {
    if (this.switchValue) {
      this.speechStart(); // 启动语音合成
    } else {
      this.speechStop();  // 停止语音合成
    }
  }

  // 启动语音合成的方法
speechStart() {
  if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(this.currentAssisText);
      utterance.lang = this.langSetting; // 动态设置语言
      const voices = window.speechSynthesis.getVoices(); // 获取支持的语音列表
      
      // 根据语言设置选择合适的语音
      const selectedVoice = voices.find(voice => voice.lang === this.langSetting);
      
      if (selectedVoice) {
          utterance.voice = selectedVoice; // 设置语音
      }
      
      window.speechSynthesis.speak(utterance);
  }
}

  // 停止语音合成的方法
  speechStop() {
    window.speechSynthesis.cancel();
  }

  role_information() {
    this.isVisible = true;
  }

  handleOk(): void {
    console.log('Button ok clicked!');
    this.isVisible = false;
  }

  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.isVisible = false;
  }

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

  languageModal = LanguageType.GPT4_o
  currentAssisText: string = ''

  sendQuery() {
    if (this.query.trim()) {
      console.log('query start');
      let queryContent = this.query;
      this.query = '';
      this.messages.push({ content: queryContent, role: 'user', sort: this.sort++ });
      this.chatContent.isloading = true;
      let modalType = LanguageModal.GPT4_Turbo;
      this.recogStop();
      console.log(this.languageModal);
      if (this.languageModal == LanguageType.GPT4_Turbo) {
        modalType = LanguageModal.GPT4_Turbo;
      } else if (this.languageModal == LanguageType.GPT35_Turbo) {
        modalType = LanguageModal.GPT35_Turbo;
      } else if (this.languageModal == LanguageType.GPT4_32k) {
        modalType = LanguageModal.GPT4_32k;
      }
      this.chatService.sendQuery(this.messages, modalType, this.inputValue).subscribe({
        next: (res: ChatCompletion) => {
          let data = JSON.parse(res.response);
          this.chatContent.isloading = false;
          this.messages.push({
            content: data.choices[0].message.content,
            role: 'assistant',
            sort: this.sort++,
          });
          this.currentAssisText = data.choices[0].message.content;
  
          // 仅在 switchValue 为 true 时启动语音合成
          if (this.switchValue) {
            this.speechStart();
          }
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
