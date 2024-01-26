import { Component, Input, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';

import { CommonModule } from '@angular/common';
import { ScheduleService } from 'src/app/service/schedule/schedule.service';
import { UserService } from 'src/app/service/user/user.service';
import { FormService } from 'src/app/service/form.service';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class ScheduleComponent implements OnInit {
  schedules: any[] = [];
  weekdays: string[] = [];
  dates: string[] = [];
  distinctJobTitles: any[] = [];
  currentDate: Date;
  approvedSchedules: any[] = [];
  unapprovedSchedules: any[] = [];

  @Input() isAdmin: boolean = false;
  constructor(
    private scheduleService: ScheduleService,
    private userService: UserService,
    private formService: FormService
  ) {
    this.currentDate = new Date();
  }
  ngOnInit(): void {
    this.loadData();
    this.loadUnapprovedSchedules();
    this.scheduleService.getRefreshScheduleObservable().subscribe(() => {
      this.loadData();
      this.loadUnapprovedSchedules();
    });
  }

  // openDelRequest(shift: any) {
  //   this.notificationService.showModal('del-request', shift);
  // }

  showComponent = false;

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
        this.distinctJobTitles = jobOptions as any[];
        this.generateWeekdaysAndDates();
        this.generateWeekTitle();
        console.log(this.distinctJobTitles);
      } else {
        console.error('Error 404');
      }

      this.showComponent = true;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  private generateWeekdaysAndDates(): void {
    this.weekdays = [];
    this.dates = [];
    const today = this.currentDate.getDay();
    for (let i = 0; i < 7; i++) {
      const dayOffset = ((i + 7 - today) % 7) - 2;
      const date = new Date(this.currentDate);
      date.setDate(this.currentDate.getDate() + dayOffset);
      this.weekdays.push(this.getDayOfWeek(date.getDay()));
      this.dates.push(this.formatDate(date));
    }
    this.dates.sort((a, b) => {
      const dateA = new Date(a);
      const dateB = new Date(b);
      return dateA.getTime() - dateB.getTime();
    });
  }

  private getDayOfWeek(day: number): string {
    const days = [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ];
    return days[day];
  }

  private formatDate(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
      month: 'short',
      day: 'numeric',
      weekday: 'long',
    };
    return date.toLocaleDateString('en-US', options);
  }

  getShiftForJobTitleAndDate(
    jobTitle: string,
    date: string
  ): { shifts: string[] } {
    const schedulesForJobTitle = this.approvedSchedules.filter(
      (schedule) => schedule.jobTitle === jobTitle
    );

    const uniqueShifts: { [key: string]: string } = {};

    schedulesForJobTitle
      .filter(
        (schedule) => this.formatDate(new Date(schedule.startTime)) === date
      )
      .sort(
        (a, b) =>
          new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
      )
      .forEach((schedule) => {
        const shiftType = this.getShift(schedule.startTime);
        const key = `${shiftType}-${schedule.firstName}-${schedule.lastName}`;

        if (!uniqueShifts[key]) {
          uniqueShifts[
            key
          ] = `${schedule.id}+${shiftType} - ${schedule.firstName} ${schedule.lastName}`;
        }
      });
    const morningShifts = Object.values(uniqueShifts).filter((shift) =>
      shift.includes('Morning')
    );
    const eveningShifts = Object.values(uniqueShifts).filter((shift) =>
      shift.includes('Evening')
    );
    const shifts = [...morningShifts, ...eveningShifts];
    return { shifts };
  }

  public getShift(startTime: string): string {
    const scheduleTime = new Date(startTime);
    const morningShiftStart = new Date(scheduleTime);
    morningShiftStart.setHours(8, 0, 0, 0);
    const eveningShiftStart = new Date(scheduleTime);
    eveningShiftStart.setHours(16, 0, 0, 0);
    if (scheduleTime >= morningShiftStart && scheduleTime < eveningShiftStart) {
      return 'Morning';
    } else {
      return 'Evening';
    }
  }
  goForward(): void {
    this.currentDate.setDate(this.currentDate.getDate() + 7);
    this.generateWeekdaysAndDates();
  }
  goBackward(): void {
    this.currentDate.setDate(this.currentDate.getDate() - 7);
    this.generateWeekdaysAndDates();
  }

  generateWeekTitle(): string {
    if (!this.dates || this.dates.length === 0) {
      return 'No Dates Available';
    }

    const startDate = this.dates[0];
    const endDate = this.dates[this.dates.length - 1];

    if (!startDate || !endDate) {
      return 'Invalid Date Format';
    }

    const startDateParts = startDate.split(' ');
    const endDateParts = endDate.split(' ');

    const startMonth = this.getMonthAbbreviation(startDateParts[1]);
    const endMonth = this.getMonthAbbreviation(endDateParts[1]);

    if (!startMonth || !endMonth) {
      return 'Invalid Date Format';
    }

    const weekNumber = this.getWeekNumber(new Date(this.currentDate));
    return `Week N${weekNumber} | ${startMonth} ${startDateParts[2]} - ${endMonth} ${endDateParts[2]}`;
  }

  private getMonthAbbreviation(fullMonth: string): string {
    return fullMonth.substring(0, 3);
  }

  private getWeekNumber(date: Date): number {
    const day = date.getUTCDay() || 7;
    date.setUTCDate(date.getUTCDate() + 4 - day);
    const startOfYear = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
    return Math.ceil(
      ((date.getTime() - startOfYear.getTime()) / 86400000 + 1) / 7
    );
  }

  loadUnapprovedSchedules(): void {
    this.unapprovedSchedules = this.getUnapprovedSchedules();
    this.formService.setUnapprovedSchedules(this.unapprovedSchedules);
  }

  getUnapprovedSchedules(): any[] {
    if (!this.unapprovedSchedules || this.unapprovedSchedules.length === 0) {
      return [];
    }

    return this.unapprovedSchedules.map((schedule) => {
      const { id, firstName, lastName, jobTitle, startTime } = schedule;
      const shift = this.getShift(startTime);
      const date = this.formatDate(new Date(startTime));
      return {
        id,
        firstName,
        lastName,
        jobTitle,
        shift,
        date,
      };
    });
  }
}
