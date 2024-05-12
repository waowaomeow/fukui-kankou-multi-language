import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ViewMessage } from '../interface/chat-interface';
import { NzListModule } from 'ng-zorro-antd/list';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-history-page',
  standalone: true,
  imports: [NzListModule,CommonModule],
  templateUrl: './history-page.component.html',
  styleUrl: './history-page.component.css'
})
export class HistoryPageComponent {
  @Input() historyMessages!:Array<Array<ViewMessage>>
  @Output() messageLoadEvent = new EventEmitter<number>()
  historyLoad(index:number){
    this.messageLoadEvent.emit(index)
  }
}
