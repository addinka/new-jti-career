import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BASE_URL } from '../utils/constant';
import { ServiceMapping } from '../utils/service.mapping';

@Injectable()
export class TestimonyService {

  constructor(private http: HttpClient) { }

  getTestimony(entries: string): Observable<any> {
    const url = BASE_URL + ServiceMapping.GET_ALL_TESTIMONY_URL;
    const httpOptions = {
      params: new HttpParams()
      .set('entries', entries)
    };

    return this.http.get(url, httpOptions);
  }

  createTestimony(testimonyData: any): Observable<any> {
    const url = BASE_URL + ServiceMapping.CREATE_NEW_TESTIMONY_URL;
    const formData = new FormData();

    formData.append('applicantName', testimonyData.applicantName);
    formData.append('role', testimonyData.role);
    formData.append('testimonyContent', testimonyData.testimonyContent);
    formData.append('testimonyIndex', testimonyData.testimonyIndex);

    if (testimonyData.file !== {}) {
      formData.append('file', testimonyData.file);
    }
    else {
      formData.append('file', '{}');
    }

    return this.http.post(url, formData);
  }

  updateTestimony(testimonyData: any): Observable<any> {
    const url = BASE_URL + ServiceMapping.UPDATE_TESTIMONY_URL;
    const formData = new FormData();

    formData.append('id', testimonyData.id);
    formData.append('applicantName', testimonyData.applicantName);
    formData.append('role', testimonyData.role);
    formData.append('testimonyContent', testimonyData.testimonyContent);
    formData.append('testimonyIndex', testimonyData.testimonyIndex);
    
    if (testimonyData.file !== {}) {
      formData.append('file', testimonyData.file);
    }

    return this.http.put(url, formData);
  }

  deleteTestimony(id: string): Observable<any> {
    const url = BASE_URL + ServiceMapping.DELETE_TESTIMONY_BY_ID_URL + id;
    return this.http.delete(url);
  }

  getTestimonyPic(id: string): Observable<any> {
    const url = BASE_URL + ServiceMapping.GET_TESTIMONY_PICTURE_BY_ID_URL + id;
    return this.http.get(url, {responseType: 'blob'});
  }
}
