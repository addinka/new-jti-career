import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { BASE_URL } from '../utils/constant';
import { ServiceMapping } from '../utils/service.mapping';

@Injectable()
export class JobService {
  public searchFromHeader: boolean;

  constructor(private http: HttpClient) { }

  getJobs(page: string, entries: string): Observable<any> {
    const url = BASE_URL + ServiceMapping.GET_ALL_JOB_URL;
    const httpOptions = {
      params: new HttpParams()
        .set('page', page)
        .set('entries', entries)
    };

    return this.http.get(url, httpOptions);
  }

  getOpenJobs(page: string, entries: string): Observable<any> {
    const url = BASE_URL + ServiceMapping.GET_ALL_OPEN_JOB_URL;
    const httpOptions = {
      params: new HttpParams()
        .set('page', page)
        .set('entries', entries)
    };

    return this.http.get(url, httpOptions);
  }

  getAvailableJobs(): Observable<any> {
    const url = BASE_URL + ServiceMapping.GET_ALL_OPEN_JOB_URL;
    return this.http.get(url);
  }

  getJobDetail(id: string): Observable<any> {
    const url = BASE_URL + ServiceMapping.GET_JOB_BY_ID_URL;
    return this.http.get(url + id);
  }

  getHotRolesJobs(): Observable<any> {
    const url = BASE_URL + ServiceMapping.GET_ALL_HOT_ROLES_URL;
    return this.http.get(url);
  }

  changeHotRole(data: any): Observable<any> {
    const url = BASE_URL + ServiceMapping.GET_ALL_HOT_ROLES_URL;
    const body = JSON.stringify(data);
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.put(url, body, httpOptions);
  }

  getJobsByRole(title: string, page: string, entries: string): Observable<any> {
    const url = BASE_URL + ServiceMapping.SEARCH_JOB_BY_ROLE_URL;
    const httpOptions = {
      params: new HttpParams()
        .set('title', title)
        .set('page', page)
        .set('entries', entries)
    };

    return this.http.get(url, httpOptions);
  }

  searchJobs(page: string, entries: string, jobs: string): Observable<any> {
    const url = BASE_URL + ServiceMapping.SEARCH_JOB + jobs;

    const httpOptions = {
      params: new HttpParams()
        .set('page', page)
        .set('entries', entries)
    };
    return this.http.get(url, httpOptions);
  }

  /**
   * Create a new job.
   * @param data - title, categories, location, onBoardStart, language, experience,
   * education, employment, jobDesc, requeirement, benefits, liveStart, liveEnd
   */
  createJob(data: any) {
    const url = BASE_URL + ServiceMapping.CREATE_NEW_JOB_URL;
    const body = JSON.stringify(data);

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.post(url, body, httpOptions);
  }

  /**
   * Repost an expired job.
   * @param id - string
   */
  repostJob(id: string) {
    const url = BASE_URL + ServiceMapping.REPOST_JOB_BY_ID_URL;

    let body = new HttpParams();
    body = body.set('id', id);

    return this.http.put(url, body);
  }

  toggleFollowJob(id: string) {
    const url = BASE_URL + ServiceMapping.FOLLOW_JOB_BY_ID_URL + id;

    // let body = new HttpParams();
    // body = body.set('id', id);

    return this.http.get(url);
  }

  /**
   * Change job's author.
   * @param data - id (jobId), authorId
   */
  changeAuthor(data: any) {
    const url = BASE_URL + ServiceMapping.CHANGE_JOB_AUTHOR_URL;
    const body = JSON.stringify(data);

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.put(url, body, httpOptions);
  }

  /**
   * Change job's collaborators.
   * @param data - id (jobId), collaboratorIds[]
   */
  changeCollaborators(data: any) {
    const url = BASE_URL + ServiceMapping.CHANGE_JOB_COLLABORATORS_URL;
    const body = JSON.stringify(data);

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.put(url, body, httpOptions);
  }

  /**
   * Deactivate a job.
   * @param id - id (jobId)
   */
  deactivateJob(id: string) {
    const url = BASE_URL + ServiceMapping.DEACTIVATE_JOB_BY_ID_URL;

    let body = new HttpParams();
    body = body.set('id', id);

    return this.http.put(url, body);
  }

  /**
   * Edit a job.
   * @param data - id, title, categories, location, onBoardStart, language, experience,
   * education, employment, jobDesc, requirement, benefits, liveStart, liveEnd
   */
  editJob(data: any) {
    const url = BASE_URL + ServiceMapping.EDIT_JOB_URL;
    const body = JSON.stringify(data);

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.put(url, body, httpOptions);
  }
}
