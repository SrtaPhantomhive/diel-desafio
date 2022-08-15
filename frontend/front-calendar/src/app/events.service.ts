import { Injectable } from '@angular/core';
import { catchError, EMPTY, map, Observable } from 'rxjs';
import { Events } from './events.model';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class EventsService {
  url = "http://localhost:3301/eventos"
  constructor(private http: HttpClient) { }
  create(events: Events): Observable<Events> {
    return this.http.post<Events>(this.url, events).pipe(
      map(obj => obj)
      // catchError(e => return EMPTY)
    );
  }

  delete(id: any): Observable<Events> {
    return this.http.delete<Events>(this.url + "/" + id).pipe(map(obj => obj));
  }

  read(): Observable<Events[]> {
    return this.http.get<Events[]>(this.url);
  }

  update(id: any, object: any): Observable<Events> {
    return this.http.put<Events>(this.url + "/" + id, object).pipe(map(obj => obj));
  }
}
