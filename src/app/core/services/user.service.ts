import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { BASE_URL } from '../utils/constant';
import { ServiceMapping } from '../utils/service.mapping';

@Injectable()
export class UserService {

  constructor(private http: HttpClient) { }

  private buildQuery(query): String {
    return query ? ['?'].concat(Object.keys(query)).reduce((p, qKey, index)=>`${p}${index===1?'':'&'}${qKey}=${query[qKey]}`) : '';
  }

  searchAllUser(query): Observable<any> {
    const queries = this.buildQuery(query);
    const url = BASE_URL + ServiceMapping.SEARCH_ALL_USER + queries;
    return this.http.get(url);
  }

  getProfile(): Observable<any> {
    const url = BASE_URL + ServiceMapping.GET_USER_BY_TOKEN_URL;
    return this.http.get(url);
  }

  getProfileToken(token): Observable<any> {
    const url = BASE_URL + ServiceMapping.GET_USER_BY_TOKEN_URL;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': token
      })
    }
    return this.http.get(url, httpOptions);
  }

  getApplications(page: string, entries: string): Observable<any> {
    const url = BASE_URL + ServiceMapping.GET_APPLICATION_BY_TOKEN_URL;
    const httpOptions = {
      params: new HttpParams()
      .set('page', page)
      .set('entries', entries)
    };

    return this.http.get(url, httpOptions);
  }

  uploadDocument(documentType: string, file: File): Observable<any> {
    const url = BASE_URL + ServiceMapping.POST_DOCUMENT_URL + documentType;

    const formData = new FormData();
    formData.append('file', file, file.name);

    return this.http.post(url, formData);
  }

  deleteDocument(documentType: string): Observable<any> {
    const url = BASE_URL + ServiceMapping.DELETE_DOCUMENT_URL + documentType;

    return this.http.delete(url);
  }

  /**
   * Get document candidate
   * @param type - cv, portfolio, educert, transcript, birthcert,
   * idcard, familycard, marriagecert, bpjs, npwp, bankaccount, refletter, skck
   * @param id - applicant ID
   */
  getDocument(type: string, id?: string): Observable<Blob> {
    const url = BASE_URL + ServiceMapping.GET_DOCUMENT_URL + type;

    if (id === undefined) {
      return this.http.get(url, { responseType: 'blob' as 'blob' });
    } else {
      const httpOptions = {
        responseType: 'blob' as 'blob',
        params: new HttpParams()
          .set('id', id)
      };

     return this.http.get(url, httpOptions);
    }
  }

  getUserById(id:string) {
    const url = BASE_URL + `${ServiceMapping.GET_USER_BY_ID_URL}/${id}`;
    return this.http.get(url);
  }

  getUserSearchByJobId(id: string, page: string, entries: string, status: string, recruiters: string): Observable<any> {
    const url = BASE_URL + ServiceMapping.SEARCH_USER_BY_JOB_ID_URL;
    let httpOptions: any;

    if (recruiters !== null) {
      httpOptions = {
        params: new HttpParams()
        .set('id', id)
        .set('page', page)
        .set('entries', entries)
        .set('status', status)
        .set('recruiters', recruiters)
      };
    } else {
      httpOptions = {
        params: new HttpParams()
        .set('id', id)
        .set('page', page)
        .set('entries', entries)
        .set('status', status)
      };
    }

    return this.http.get(url, httpOptions);
  }

  toggleUserPotential(id: string): Observable<any> {
    const url = BASE_URL + ServiceMapping.TOGGLE_POTENTIAL + id;

    return this.http.get(url);
  }

  /**
   * Update candidate's data.
   * @param data - name, email, contact, language, degree,
   * experience, selfDesc, qualification
   */
  updateUser(data: any): Observable<any> {
      const url = BASE_URL + ServiceMapping.UPDATE_USER_URL;
      const body = JSON.stringify(data);

      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      };

      return this.http.put(url, body, httpOptions);
  }

  getProfilePic(id: string): Observable<Blob> {
    const url = BASE_URL + ServiceMapping.GET_PROFILE_PICTURE_BY_ID_URL + id;
    return this.http.get(url, { responseType: 'blob' });
  }

  postProfilePic(theFile: File) {
    const url = BASE_URL + ServiceMapping.UPDATE_PROFILE_PICTURE_URL;

    const formData = new FormData();
    formData.append('file', theFile, theFile.name);

    return this.http.post(url, formData);
  }

  createUser(data: any) {
    const url = BASE_URL + ServiceMapping.CREATE_NEW_USER_URL;

    const payload = new FormData();
    payload.append('name', data.name);
    payload.append('email', data.email);
    payload.append('contact', data.contact);
    payload.append('language', data.language);
    payload.append('degree', data.degree);
    payload.append('experience', data.experience);
    payload.append('selfDesc', data.selfDesc);
    payload.append('university', data.university);
    payload.append('majorField', data.majorField);
    payload.append('domicile', data.domicile);
    payload.append('companyName', data.companyName);
    payload.append('position', data.position);
    payload.append('jobdesk', data.jobdesk);
    payload.append('startPeriod', data.startPeriod);
    payload.append('endPeriod', data.endPeriod);
    payload.append('qualification', data.qualification);
    payload.append('password', data.password);

    if (data.pic !== undefined) {
      payload.append('pic', data.pic);
    }
    if (data.cv !== null) {
      payload.append('cv', data.cv);
    }
    if (data.portfolio !== null) {
      payload.append('portfolio', data.portfolio);
    }

    return this.http.post(url, payload);
  }

  generateDocument(param){
    let url = BASE_URL + ServiceMapping.GENERATE_EXCEL + '?';
    let beginning = true;
    
    if(param.userName !== '' && param.userName !== undefined){
      if(beginning){
        url += 'userName=' + param.userName;
        beginning = false;
      }else{
        url += '&userName=' + param.userName;
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
    if(param.jobID !== '' && param.jobID !== undefined){
      if(beginning){
        url += 'jobID=' + param.jobID;
        beginning = false;
      }else{
        url += '&jobID=' + param.jobID;
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
        url += 'degree=' + param.education;
        beginning = false;
      }else{
        url += '&degree=' + param.education;
      }
    }
    if(param.userStatus !== '' && param.userStatus !== undefined){
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
    if(param.recruiterID !== '' && param.recruiterID !== undefined){
      if(beginning){
        url += 'recruiterID=' + param.recruiterID;
        beginning = false;
      }else{
        url += '&recruiterID=' + param.recruiterID;
      }
    }
    return this.http.post(url, '');
  }

  getBlueForm(blueformID:any, token:any): Observable<any> {
    const url = BASE_URL + ServiceMapping.BLUEFORM + '?blueformID=' + blueformID;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': token
      })
    };
    return this.http.get(url, httpOptions);
  }

  getBlueFormByUserId(userId: string): Observable<any> {
    const url = BASE_URL + ServiceMapping.BLUEFORM + '?userID=' + userId;
    return this.http.get(url);
  }

  createBlueForm(data: any, token: any) {
    const url = BASE_URL + ServiceMapping.BLUEFORM;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': token
      })
    };

    return this.http.post(url, data, httpOptions);
  }

  updateBlueForm(blueformID:any, data: any, token: any) {
    const url = BASE_URL + ServiceMapping.BLUEFORM + '?blueformID=' + blueformID;;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': token
      })
    };

    return this.http.put(url, data, httpOptions);
  }

  sendBlueForm(data: FormData) {
    const url = BASE_URL + ServiceMapping.SEND_BLUEFORM;
    return this.http.post(url, data);
  }

  downloadBlueForm(userID:any): Observable<Blob> {
    const url = BASE_URL + ServiceMapping.DOWNLOAD_BLUEFORM + '?userID=' + userID;
    return this.http.get(url, { responseType: 'blob' as 'blob' });
  }

  sendOnboardFormWithInvite(data: FormData) {
    const url = BASE_URL + ServiceMapping.SEND_ONBOARDFORM;
    return this.http.post(url, data);
  }
  
  getOnBoardingForm(onBoardingID:any, token:any): Observable<any> {
    const url = BASE_URL +ServiceMapping.ONBOARDING_FORM + '?onboardingFormID=' + onBoardingID;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': token
      })
    };
    return this.http.get(url, httpOptions);
  }

  createOnBoardingForm(data: any) {
    const url = BASE_URL + ServiceMapping.ONBOARDING_FORM;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.post(url, data, httpOptions);
  }

  submitOnBoardingForm(id: any, data:any) {
    const url = BASE_URL + ServiceMapping.ONBOARDING_FORM + '?Onboarding_formID=' + id;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        // 'x-access-token': token
      })
    };

    return this.http.put(url, data, httpOptions);
  }

  inviteToApply(data: {jobId: string, email: string[]}): Observable<any> {
    const url = BASE_URL + ServiceMapping.INVITE_APPLY_EXTERNAL;
    return this.http.post(url, data)
  }


}