import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiService } from '../api.service';
@Injectable({
  providedIn: 'root',
})
export class ScheduleService {
  constructor(private http: HttpClient, private apiService: ApiService) {}

  getAllSchedules(): Observable<any[]> {
    return this.http.get<any[]>(this.apiService.apiUrl + 'User/dashboard');
  }
  private refreshScheduleSubject: BehaviorSubject<{}> = new BehaviorSubject<{}>(
    {}
  );

  refreshSchedule(): void {
    this.refreshScheduleSubject.next({});
  }
  getRefreshScheduleObservable(): Observable<{}> {
    return this.refreshScheduleSubject.asObservable();
  }

  //schedule form refresher
  private refreshScheduleFormSubject: BehaviorSubject<{}> =
    new BehaviorSubject<{}>({});
  refreshScheduleForm(): void {
    this.refreshScheduleFormSubject.next({});
  }
  getRefreshScheduleFormObservable(): Observable<{}> {
    return this.refreshScheduleFormSubject.asObservable();
  }
  addScheduleRequest(
    startTime: string,
    endTime: string,
    userId: number
  ): Observable<any> {
    return this.http.post(
      `${this.apiService.apiUrl}Worker/add-schedule-request`,
      {
        startTime: startTime,
        endTime: endTime,
        userId: userId,
      }
    );
  }
  // approveScheduleRequest(scheduleId: number): Observable<any> {
  //   return this.http.post(
  //     `${this.apiService.apiUrl}Admin/approve-schedule-request`,
  //     {
  //       scheduleId: scheduleId,
  //     }
  //   );
  // }
  approveSchedule(scheduleId: number): Observable<any> {
    const params = { scheduleId: scheduleId.toString() };
    return this.http.post(
      `${this.apiService.apiUrl}Admin/approve-schedule-request`,
      null,
      {
        params,
      }
    );
  }
}
