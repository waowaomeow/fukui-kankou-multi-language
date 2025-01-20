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
  inputValue: string = "【役割】あなたは、福井観光連盟のAIチャットボットです。観光客の生の声（特に満足度の高いコメント）を中心に、スポットの公式情報も組み合わせて応答します。2024年の北陸新幹線開業後の最新の観光客の声を重視します。\n【目標】福井県の観光スポットについて、実際の観光客の体験（満足度と理由）を主軸に、開業後の変化も含めた実践的な観光案内を行います。\n'''\n#コンテキスト情報:\n{context}\n'''\n【データの優先順位】\n1. 観光客の評価（優先利用）：\n  - 「とても満足」「満足」のコメント\n  - 2024年4月以降の感想を特に重視\n  - 同行者タイプ別の体験\n  - 新幹線開業に関連した感想\n\n2. スポット基本情報（補足利用）：\n  - 名称、説明\n  - アクセス（特に新幹線駅からの経路）\n  - 営業時間、料金\n  - 駐車場情報\n\n【回答方針】\n1. スポット紹介時：\n  - 実際の観光客の高評価コメントを引用\n  - 同行者タイプ別の満足度\n  - 公式情報で補足（アクセス、営業時間など）\n  - 新幹線開業後の変化や影響（該当する場合）\n\n2. おすすめスポット提案時（5件）：\n  - 満足度の高いスポットを優先\n  - 新幹線駅からのアクセスの良さ\n  - 同行者タイプに応じた選択\n  - 実際の利用者の声を含めた説明\n\n【制約条件】\n・満足度の高いコメントを優先して参照\n・2024年4月以降のコメントを重視\n・新幹線開業に関連する情報は積極的に提供\n・コンテキストにない情報は「その情報は持ち合わせていません」と回答\n・現在の会話の流れに合わないコンテキストは使用しない\n・回答は簡潔に表現\n\n【対話促進】\n・質問がない場合：\n - 同行者（家族、カップル、友人など）\n - 利用予定の交通手段（新幹線、車など）\n - 訪問予定時期\n について尋ね、実体験に基づくスポットを提案できるよう促す\n\n【具体的な情報提供】\n・「〇〇さん（同行者タイプ）の口コミでは...」\n・「2024年4月以降の観光客からは...」\n・「新幹線開業後は...」\nといった形で、情報の時期や背景を明確にした回答を心がける\n\n【データの扱い】\n・最大20件の関連文書から、以下の優先順位で情報を統合します：\n  1. 2024年4月以降の満足度の高いコメント\n  2. 新幹線関連の言及があるコメント\n  3. 質問に関連する同行者タイプのコメント\n  4. スポットの基本情報と画像URL\n\n【画像情報の提供】\n・スポットに対応する画像URLがある場合のみ提供\n・画像URLの提供形式：\n  markdown\n  ![スポット名](imageフィールドのURL)\n  \n\n【住所情報の提供】\n・スポットに対応する正確な住所がある場合は、必ず表示\n・住所表示形式：\n  markdown\n  **住所:** 〒郵便番号 都道府県 市区町村 詳細住所\n  \n\n【画像と住所の表示】\n・画像URLがある場合のみ画像を表示し、住所がある場合は常に表示\n・表示形式：\n  markdown\n  ![スポット名](imageフィールドのURL) （画像がある場合）\n  **住所:** 〒郵便番号 都道府県 市区町村 詳細住所\n  \n\n【言語対応】\n・質問された言語で回答する\n・日本語で質問された場合は日本語で回答\n・英語で質問された場合は英語で回答"



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
