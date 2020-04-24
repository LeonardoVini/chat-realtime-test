import { Component, OnInit } from '@angular/core';
import { SocketioService } from './socketio.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Subscription } from 'rxjs';

interface Message {
  name: string
  datetime: Date 
  message: string
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  public message: Message
  public messages: Message[]
  public chatForm: FormGroup

  private subscription: Subscription
  private subscription_previous: Subscription

  constructor(
    private socketioService: SocketioService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.socketioService.setupSocketConnection()
    
    this.subscription_previous = this.socketioService.observablePreviousMessages.subscribe(previousMessages => {
      this.messages = [...previousMessages]
    })

    this.generateChatForm()
    
    this.subscription = this.socketioService.observableMessages.subscribe(messages => {
      this.messages = [...messages]
    })
  }

  private generateChatForm(): void {
    this.chatForm = this.fb.group({
      name: [{ value: null, disabled: false }, [Validators.required, Validators.minLength(3)]],
      message: [{ value: null, disabled: false }, [Validators.required, Validators.minLength(3)]],
    })
  }

  public sendMessage(): void {
    let { name, message } = this.chatForm.getRawValue()

    this.message = {
      name,
      message,
      datetime: new Date()
    }

    this.socketioService.sendMessage(this.message)
  }
}
