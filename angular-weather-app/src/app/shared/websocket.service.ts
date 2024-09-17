import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private socket!: WebSocket;
  private messageSubject = new Subject<any>();
  private messagesSubject = new BehaviorSubject<any[]>([]);
  public messages$ = this.messagesSubject.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { 
    if (isPlatformBrowser(this.platformId)) {
      this.initWebSocket();
    }
  }

  private initWebSocket(): void {
    this.socket = new WebSocket('/socket');

    this.socket.onmessage = (event) => {
      this.messageSubject.next(JSON.parse(event.data));
    };

    this.socket.onopen = () => {
      console.log('WebSocket connection opened');
    };

    this.socket.onclose = () => {
      console.log('WebSocket connection closed');
    };
  }

  get messages() {
    return this.messageSubject.asObservable();
  }
}