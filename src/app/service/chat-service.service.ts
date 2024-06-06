import { Injectable } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Token } from '@angular/compiler';
import { Message, ChatEvent, ChatResponse, ViewMessage } from '../interface/chat-interface';

export enum LanguageModal{
  GPT4_Turbo = 'GPT-4Turbo',
  GPT4_32k = 'gpt-4-32k',
  GPT35_Turbo = 'gpt-35-turbo'
  
}

const token = "ac0eb75113cb4cf3843bce89ee94f2d6"
const host = "api.coze.com"
const bot_id = "7356846038512844818"
const user = "29032201862555"
const urlBase = "https://openai-tourism.openai.azure.com/openai/deployments/"
const urlEnd  = "/chat/completions?api-version=2024-02-01"
@Injectable({
  providedIn: 'root'
})

export class ChatServiceService {

  constructor(private http: HttpClient) { }

  sendQuery(messages: Array<ViewMessage>,modalType:LanguageModal){
    let headers = new Headers();
    headers.append('api-key', token)
    headers.append('Content-Type', 'application/json')
    let sendMessages = new Array<Message>
    console.log(modalType)
    let url = urlBase + modalType + urlEnd
    for(let message of messages){
      sendMessages.push({role:message.role,content:message.content})
    }
    let jsonbody:ChatEvent = new ChatEvent(sendMessages)
    return this.http.post(url,jsonbody,{headers:{"api-key":token,"Content-Type":"application/json"}})

  }

}
