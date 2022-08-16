import { Injectable } from '@angular/core';
import { catchError, EMPTY, map, Observable } from 'rxjs';
import { Events } from './events.model';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';


@Injectable({
  providedIn: 'root'
})
export class EventsService {
  url = "http://localhost:3301/eventos"
  constructor(private http: HttpClient) { }
  create(events: Events): Observable<Events> {
    return this.http.post<Events>(this.url, events).pipe(map(obj => obj),
      catchError(e => this.handleWithError(e)));
  }

  delete(id: any): Observable<Events> {
    return this.http.delete<Events>(this.url + "/" + id).pipe(map(obj => obj),
      catchError(e => this.handleWithError(e)));
  }

  read(): Observable<Events[]> {
    return this.http.get<Events[]>(this.url);
  }

  update(id: any, object: any): Observable<Events> {
    return this.http.put<Events>(this.url + "/" + id, object).pipe(map(obj => obj),
    catchError(e => this.handleWithError(e)));
  }

  handleWithError(error: any): Observable<any> {
    Swal.fire({
      title: 'Houve um erro!',
      text: 'Por favor, verifique a sua conexão ou entre em contato com um administrador.',
      icon: 'error',
      confirmButtonText: 'Ok',
      confirmButtonColor: '#0DD2A5'
    });
    return EMPTY;
  }
}
