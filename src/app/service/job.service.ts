import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class JobService {
  constructor(private http: HttpClient, private apiService: ApiService) {}
  addJob(jobTitle: string): Observable<any> {
    return this.http.post(
      `${this.apiService.apiUrl}Admin/add-new-job`,
      {
        title: jobTitle,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
  deleteJob(jobId: number): Observable<any> {
    return this.http.delete(`${this.apiService.apiUrl}Admin/delete-job/${jobId}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
