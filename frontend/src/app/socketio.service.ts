import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import * as io from 'socket.io-client'
import { BehaviorSubject } from 'rxjs';

interface Message {
  name: string
  datetime: Date 
  message: string
}

@Injectable({
  providedIn: 'root'
})
export class SocketioService {

  private messages: Array<Message>
  public observableMessages: BehaviorSubject<Message[]>

  private previous_messages: Array<Message>
  public observablePreviousMessages: BehaviorSubject<Message[]>

  socket

  constructor() {
    this.messages = new Array<Message>()
    this.observableMessages = new BehaviorSubject<Message[]>(this.messages)

    this.previous_messages = new Array<Message>()
    this.observablePreviousMessages = new BehaviorSubject<Message[]>(this.previous_messages)
  }

  public setupSocketConnection() {
    this.socket = io(environment.SOCKET_ENDPOINT)

    this.socket.on('previousMessages', previousMessages => {
      this.previous_messages = previousMessages
      this.observablePreviousMessages.next(this.previous_messages)
    })

    this.socket.on('my broadcast', (messagesArray: Message[]) => {
      this.messages = [...messagesArray]
      this.observableMessages.next(this.messages)
    });
  }

  public sendMessage(message: Message): void {
    this.socket.emit('my message', message)
  }
}
