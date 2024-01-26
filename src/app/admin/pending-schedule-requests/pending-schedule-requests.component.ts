// pending-schedule-requests.component.ts

import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { FormService } from 'src/app/service/form.service';
import { ScheduleService } from 'src/app/service/schedule/schedule.service';
import { UserService } from 'src/app/service/user/user.service';

@Component({
  selector: 'app-pending-schedule-requests',
  templateUrl: './pending-schedule-requests.component.html',
  styleUrls: ['./pending-schedule-requests.component.css'],
})
export class PendingScheduleRequestsComponent implements OnInit {
  pendingRequests: any[] = [];
  approvedSchedules: any[] = [];
  unapprovedSchedules: any[] = [];

  constructor(
    private scheduleService: ScheduleService,
    private userService: UserService,
    private formService: FormService
  ) {}
  async loadData() {
    try {
      const result = await forkJoin([
        this.scheduleService.getAllSchedules(),
        this.userService.getJobs(),
      ]).toPromise();
      if (result && result.length === 2) {
        const [schedules, jobOptions] = result;
        this.approvedSchedules = schedules.filter(
          (schedule) => schedule.isApproved
        );
        this.unapprovedSchedules = schedules.filter(
          (schedule) => !schedule.isApproved
        );
        this.formService.setUnapprovedSchedules(this.unapprovedSchedules);
        // this.distinctJobTitles = jobOptions as any[];
        // this.generateWeekdaysAndDates();
        // this.generateWeekTitle();
        // console.log(this.distinctJobTitles);
      } else {
        console.error('Error 404');
      }

      // this.showComponent = true;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
  ngOnInit() {
    this.loadData();
  }
  approveScheduleRequest(requestId: number) {
    this.scheduleService
      .approveSchedule(requestId)
      .subscribe((result) => {
        
      });
  }
}
