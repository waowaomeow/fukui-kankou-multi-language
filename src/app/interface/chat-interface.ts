export interface Message{
  role:string,
  content:string
}
export interface ViewMessage {
  sort: number,
  content: string,
  role: string
}
interface ChatChoice{
  content_filter_results:any,
  finish_reason:string,
  index:number,
  message:Message
}


export interface ChatResponse{
  choices:Array<ChatChoice>,
  created: number,
  id: string,
  model: string,
  object: string
}
export class ChatEvent{
  constructor(
    public messages:Array<Message>
  ){

  }
}
