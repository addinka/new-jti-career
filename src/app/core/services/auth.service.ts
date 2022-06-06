import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { BASE_URL,SSO_URL } from '../utils/constant';
import { ServiceMapping } from '../utils/service.mapping';
import * as jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public currentToken = new Subject();
  public currentRole = new Subject();
  public currentName = new Subject();
  public currentProfilePicture = new Subject();

  constructor(private http: HttpClient) { }

  /**
   * Login as candidate or recruiter.
   * @param credentials - email, password
   */
  login(credentials: any): Observable<any> {
    const url = BASE_URL + ServiceMapping.LOGIN_URL;
    const body = JSON.stringify(credentials);

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.post(url, body, httpOptions);
  }
  
  loginjti(credentials: any): Observable<any> {
    const url = SSO_URL + ServiceMapping.LOGIN_URL;
    const body = JSON.stringify(credentials);

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.post(url, body, httpOptions);
  }

  /**
   * Request new password by send url reset to inputed email.
   * @param email - string
   */
  requestResetPassword(email: string): Observable<any> {
    const url = BASE_URL + ServiceMapping.REQUEST_RESET_USER_PASSWORD_URL;

    let body = new HttpParams();
    body = body.set('email', email);

    return this.http.post(url, body);
  }

  attemptChangePass(newPassword: any, token: string): Boolean {
    const tokenConverted = this.getDecodedAccessToken(token);
    const flag: Boolean = !(tokenConverted.type === 'reset_password');
    return flag;
  }

  setPassword(newPassword: any, token: string): Observable<any> {
    const url = BASE_URL + ServiceMapping.SET_RECRUITER_PASSWORD_URL;

    let body = new HttpParams();
    body = body.set('newPassword', newPassword);

    const httpOptions = {
      params: new HttpParams()
        .set('token', token)
    };

    return this.http.post(url, body, httpOptions);
  }

  changePassword(newPassword: any, token: string): Observable<any> {
    const url = BASE_URL + ServiceMapping.RESET_USER_PASSWORD_URL;

    let body = new HttpParams();
    body = body.set('newPassword', newPassword);

    const httpOptions = {
      params: new HttpParams()
        .set('token', token)
    };

    return this.http.post(url, body, httpOptions);
  }

  getCurrentToken(): Observable<any> {
    return this.currentToken.asObservable();
  }

  setSession(token: string) {
    this.currentToken.next(token);
    localStorage.setItem('token', token);

    this.updateData(token);
  }

  getCurrentRole(): Observable<any> {
    return this.currentRole.asObservable();
  }

  getCurrentName(): Observable<any> {
    return this.currentName.asObservable();
  }

  getCurrentProfilePicture(): Observable<any> {
    return this.currentProfilePicture.asObservable();
  }

  setCurrentName(name: string) {
    this.currentName.next(name);
    localStorage.setItem('name', name);
  }

  updateData(token: string) {
    const tokenDecoded = this.getDecodedAccessToken(token);
    const role = tokenDecoded.type;
    const id = tokenDecoded.id;
    const name = tokenDecoded.name;
    const profilePicture = tokenDecoded.profpic;
    const exp = tokenDecoded.exp;
    let isAdmin = 'false';
    let isSuperAdmin = 'false';

    if (role === 'Recruiter') {
      isAdmin = tokenDecoded.isAdmin.toString();
      isSuperAdmin = tokenDecoded.isSuperAdmin.toString();
    }

    // console.log(id);

    this.currentRole.next(role);
    this.currentName.next(name);
    this.currentProfilePicture.next(profilePicture);

    localStorage.setItem('role', role);
    localStorage.setItem('name', name);
    localStorage.setItem('id', id);
    localStorage.setItem('profilePicture', profilePicture);
    localStorage.setItem('exp', exp);
    localStorage.setItem('isAdmin', isAdmin);
    localStorage.setItem('isSuperAdmin', isSuperAdmin);
  }

  logout() {
    this.currentToken.next(null);
    this.currentRole.next(null);
    this.currentName.next(null);
    this.currentProfilePicture.next(null);

    localStorage.clear();
  }

  getDecodedAccessToken(token: string): any {
    try {
      return jwt_decode(token);
    } catch (Error) {
      return null;
    }
  }
}
