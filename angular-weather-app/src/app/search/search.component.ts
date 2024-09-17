import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

import { SearchService } from '../shared/search.service';
import { WebsocketService } from '../shared/websocket.service';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent implements OnInit {

  histories: any[] = []

  constructor (
    private searchServ: SearchService,
    private websocketService: WebsocketService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.loadSearch()
    if (isPlatformBrowser(this.platformId)) {
      // initialize websocket only in browser
      this.websocketService.messages.subscribe((data: any) => {
        this.histories.push(data);
      });
    }
  }

  loadSearch() {
    this.searchServ.getSearches().subscribe(data => {
      this.histories = data as any[]
    }, error => {
      console.log(error);
      console.error('Error fetching data:', error);
    })
  }
}
