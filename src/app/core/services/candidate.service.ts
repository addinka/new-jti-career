import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { BASE_URL } from '../utils/constant';
import { ServiceMapping } from '../utils/service.mapping';

@Injectable({
  providedIn: 'root'
})
export class CandidateService {

  constructor(private http: HttpClient) { }

  getCandidateList(): Observable<any> {
    const url = BASE_URL + ServiceMapping.GET_ALL_APPLICATION_URL;
    return this.http.get(url);
  }
}
