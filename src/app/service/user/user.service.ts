import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from '../api.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient, private apiService: ApiService) {}

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.apiService.apiUrl + 'User/users');
  }

  getJobs(): Observable<any[]> {
    return this.http.get<any[]>(this.apiService.apiUrl + 'User/jobs');
  }

  getDashboard() {
    return this.http.get(this.apiService.apiUrl + 'User/dashboard');
  }

  addScheduleRequest(scheduleData: any): Observable<any> {
    return this.http.post(
      this.apiService.apiUrl + 'Worker/add-schedule-request',
      scheduleData
    );
  }
  login(
    email: string | undefined,
    password: string | undefined
  ): Observable<any> {
    return this.http.post(
      this.apiService.apiUrl + 'User/login',
      {
        email: email,
        password: password,
      },
      {
        responseType: 'text',
        headers: {
          'Content-type': 'application/json',
        },
      }
    );
  }

  //Sign up handler
  register(
    firstName: string | undefined,
    lastName: string | undefined,
    email: string | undefined,
    password: string | undefined,
    jobId: number | null
  ): Observable<any> {
    return this.http.post(
      this.apiService.apiUrl + 'User/register',
      {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
        jobId: jobId,
      },
      {
        headers: {
          'Content-type': 'application/json',
        },
      }
    );
  }
}
