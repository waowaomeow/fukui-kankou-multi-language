import { Component, Input } from '@angular/core';
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
export class ChatContentComponent {

  @Input() messages!:Array<ViewMessage>
  isloading = false

  show(){
    console.log(this.messages)
  }
}
