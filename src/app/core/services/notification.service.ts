import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { BASE_URL } from '../utils/constant';
import { ServiceMapping } from '../utils/service.mapping';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private http: HttpClient) { }

  getUserNotifications(): Observable<any> {
    const url = BASE_URL + ServiceMapping.GET_USER_NOTIFICATIONS;
    return this.http.get(url);
  }

  readNotification(id: string): Observable<any> {
    const url = BASE_URL + ServiceMapping.SET_NOTIFICATION_AS_READ + id;
    return this.http.post(url, { 'id': id });
  }
}
