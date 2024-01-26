// job-list.component.ts

import { Component, OnInit } from '@angular/core';
import { JobService } from 'src/app/service/job.service';
import { UserService } from 'src/app/service/user/user.service';

@Component({
  selector: 'app-job-list',
  templateUrl: './job-list.component.html',
  styleUrls: ['./job-list.component.css'],
})
export class JobListComponent implements OnInit {
  jobs: any[] = [];

  constructor(
    private userService: UserService,
    private jobService: JobService
  ) {}

  ngOnInit() {
    // Fetch the list of jobs from your job service (replace 'getJobs()' with your actual method)
    this.userService.getJobs().subscribe(
      (response) => {
        this.jobs = response;
      },
      (error) => {
        console.error('Error fetching jobs:', error);
      }
    );
  }

  deleteJob(jobId: number) {
    this.jobService.deleteJob(jobId).subscribe(
      (response) => {
        this.jobs = this.jobs.filter((job) => job.id !== jobId);
        console.log('Job deleted successfully:', response);
      },
      (error) => {
        console.error('Error deleting job:', error);
      }
    );
  }
}
