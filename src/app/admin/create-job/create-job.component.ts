// create-job.component.ts

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; // Import necessary modules
import { JobService } from 'src/app/service/job.service';

@Component({
  selector: 'app-create-job',
  templateUrl: './create-job.component.html',
  styleUrls: ['./create-job.component.css'],
})
export class CreateJobComponent implements OnInit {
  jobForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private jobService: JobService
  ) {}

  ngOnInit() {
    this.jobForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      // Add more form controls as needed
    });
  }

  get formControls() {
    return this.jobForm.controls;
  }

  onSubmit() {
    console.log(this.jobForm.value);

    // Send the job data to your job service for creation (replace 'createJob()' with your actual method)
    this.jobService.addJob(this.jobForm.value.name).subscribe(
      (response) => {
        // Handle successful creation, e.g., show a success message, navigate to job list, etc.
        console.log('Job created successfully:', response);
      },
      (error) => {
        // Handle error, e.g., show an error message
        console.error('Error creating job:', error);
      }
    );
  }
}
