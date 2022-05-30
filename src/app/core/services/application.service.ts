import { Injectable, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BASE_URL } from '../utils/constant';
import { ServiceMapping } from '../utils/service.mapping';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {
  private filterCandidateEventEmitter: EventEmitter<any> = new EventEmitter();
  constructor(private http: HttpClient) { }

  /**
   * Cancel application, withdraw by candidate OR eliminate by recruiter.
   * @param - id (applicationId)
   */
  private filterEventEmitter: EventEmitter<any> = new EventEmitter();
  private cleanFilterEventEmitter: EventEmitter<any> = new EventEmitter();

  onInitFilterEmitter() {
    return this.filterEventEmitter;
  }
  cleanFilterEmitter() {
    return this.cleanFilterEventEmitter;
  }

  cancelApplication(id: string, status?: string, remarks?: string): Observable<any> {
    const url = BASE_URL + ServiceMapping.CANCEL_APPLICATION_BY_ID_URL + id + '?'
          + `${status ? `status=${status}` : ""}` + '&'
          + `${remarks ? `remarks=${remarks}` : ""}`;
    return this.http.post(url, null);
  }

  /**
   * Create application (apply a job) by candidate and
   * sign up the candidate as well.
   * @param data - jobID, expSalary, isNegotiable, comments, pic, cv, portfolio, user
   */
  createApplication(data: any): Observable<any> {
    const url = BASE_URL + ServiceMapping.CREATE_NEW_APPLICATION_URL;

    const payload = new FormData();
    const user = JSON.stringify(data.user);

    payload.append('jobID', data.jobID);
    payload.append('expSalary', data.expSalary);
    payload.append('isNegotiable', data.isNegotiable);
    payload.append('comments', data.comments);

    // Append pic, cv, portfolio, user
    // if user object exists.
    if (user !== undefined) {
      payload.append('pic', data.pic);
      payload.append('cv', data.cv);
      payload.append('portfolio', data.portfolio);
      payload.append('user', user);
    }

    return this.http.post(url, payload);
  }

  getApplicationById(applicationID: string): Observable<any> {
    const url = BASE_URL + ServiceMapping.GET_APPLICATION_BY_ID_URL + applicationID;
    return this.http.get(url);
  }

  getApplicationCalender(date: string): Observable<any> {
    const url = BASE_URL + ServiceMapping.GET_APPLICATION_CALENDER_URL + date;
    return this.http.get(url);
  }

  getApplicationByDate(date: string): Observable<any> {
    const url = BASE_URL + ServiceMapping.GET_APPLICATION_BY_DATE_URL + date;
    return this.http.get(url);
  }

  getApplicantFilter(param: any): Observable<any> {
    let url = BASE_URL + ServiceMapping.GET_APPLICANT_BY_FILTER + '?';
    let beginning = true;
    if(param.sortBy !== '' && param.sortBy !== undefined){
      if(beginning){
        url += 'sortBy=' + param.sortBy;
        beginning = false;
      }else{
        url += '&sortBy=' + param.sortBy;
      }
    }
    if(param.sortType !== '' && param.sortType !== undefined){
      if(beginning){
        url += 'sortType=' + param.sortType;
        beginning = false;
      }else{
        url += '&sortType=' + param.sortType;
      }
    }
    if(param.jobTitle !== '' && param.jobTitle !== undefined){
      if(beginning){
        url += 'jobTitle=' + param.jobTitle;
        beginning = false;
      }else{
        url += '&jobTitle=' + param.jobTitle;
      }
    }
    if(param.jobId !== '' && param.jobId !== undefined){
      if(beginning){
        url += 'jobID=' + param.jobId;
        beginning = false;
      }else{
        url += '&jobID=' + param.jobId;
      }
    }
    if(param.userName !== '' && param.userName !== undefined){
      if(beginning){
        url += 'userName=' + param.userName;
        beginning = false;
      }else{
        url += '&userName=' + param.userName;
      }
    }
    if(param.minSalary !== undefined && param.maxSalary !== null){
      if(beginning){
        url += 'minSalary=' + param.minSalary;
        beginning = false;
      }else{
        url += '&minSalary=' + param.minSalary;
      }
    }
    if(param.maxSalary !== undefined && param.maxSalary !== null){
      if(beginning){
        url += 'maxSalary=' + param.maxSalary;
        beginning = false;
      }else{
        url += '&maxSalary=' + param.maxSalary;
      }
    }
    if(param.experience !== ''){
      if(beginning){
        url += 'experience=' + param.experience;
        beginning = false;
      }else{
        url += '&experience=' + param.experience;
      }
    }
    if(param.language !== ''){
      if(beginning){
        url += 'language=' + param.language;
        beginning = false;
      }else{
        url += '&language=' + param.language;
      }
    }
    if(param.education !== ''){
      if(beginning){
        url += 'education=' + param.education;
        beginning = false;
      }else{
        url += '&education=' + param.education;
      }
    }
    if(param.userStatus !== ''){
      if(beginning){
        url += 'userStatus=' + param.userStatus;
        beginning = false;
      }else{
        url += '&userStatus=' + param.userStatus;
      }
    }
    if(param.applicationStatus !== '' && param.applicationStatus !== undefined){
      if(beginning){
        url += 'applicationStatus=' + param.applicationStatus;
        beginning = false;
      }else{
        url += '&applicationStatus=' + param.applicationStatus;
      }
    }
    if(param.collaborators !== ''){
      if(beginning){
        url += 'collaborators=' + param.collaborators;
        beginning = false;
      }else{
        url += '&collaborators=' + param.collaborators;
      }
    }
    if(param.page !== undefined){
      if(beginning){
        url += 'page=' + param.page;
        beginning = false;
      }else{
        url += '&page=' + param.page;
      }
    }
    if(param.entries !== undefined){
      if(beginning){
        url += 'entries=' + param.entries;
        beginning = false;
      }else{
        url += '&entries=' + param.entries;
      }
    }

    return this.http.get(url);
  }

  getFilterCandidateEventEmitter() {
    // console.log('filter jalan');
    return this.filterCandidateEventEmitter;
  }

  /**
   * Invite candidate to Test, Interview I, Interview II, or On Board.
   * @param type - string (test, inter1, inter2, onboard)
   * @param data - appliID, inviteTime, inviteLocation
   */
  inviteCandidate(type: string, data: FormData): Observable<any> {
    const url = BASE_URL + ServiceMapping.INVITE_APPLICANT + type;
    return this.http.post(url, data);
  }


}
