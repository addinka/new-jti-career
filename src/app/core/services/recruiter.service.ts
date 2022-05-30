import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BASE_URL } from '../utils/constant';
import { ServiceMapping } from '../utils/service.mapping';

@Injectable()
export class RecruiterService {

    constructor(private http: HttpClient) { }

    getRecruiters(): Observable<any> {
        const url = BASE_URL + ServiceMapping.GET_ALL_RECRUITER_URL;
        return this.http.get(url);
    }

    /**
     * Change admin status of recruiter
     * @param id - email
     */
    toogleAdmin(id: string): Observable<any> {
        const url = BASE_URL + ServiceMapping.CHANGE_ADMIN_STATUS_URL + id;
        return this.http.get(url);
    }

    /**
     * Create a new recruiter member.
     * @param data - name, email, title, profpic
     */
    createRecruiter(data: any) {
        const url = BASE_URL + ServiceMapping.CREATE_NEW_RECRUITER_URL;
        const body = JSON.stringify(data);

        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };

        return this.http.post(url, body, httpOptions);
    }

    /**
     * Delete recruiter account.
     * @param id - email
     */
    deleteRecruiter(id: string): Observable<any> {
        const url = BASE_URL + ServiceMapping.DELETE_RECRUITER_BY_ID_URL + id;
        return this.http.delete(url);
    }

    /**
     * Activate or deactivate recruiter status.
     * @param id - email
     */
    toogleActive(id: string): Observable<any> {
        const url = BASE_URL + ServiceMapping.CHANGE_ADMIN_ACTIVE_STATUS_URL + id;
        return this.http.get(url);
    }
}
