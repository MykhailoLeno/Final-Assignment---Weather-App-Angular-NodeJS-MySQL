import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(
    private http: HttpClient,
  ) { }

  addSearch(query: any, timestamp: string): Observable<any> {
    const body = { 
      ...query, 
      timestamp 
    };

    return this.http.post("api/search-history", body)    
  }
  
  getSearches(): Observable<any[]> {
    return this.http.get<any>("api/search-history");
  }
}
