// schedule-request.component.ts

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ScheduleService } from 'src/app/service/schedule/schedule.service';
import { TokenService } from 'src/app/service/token/token.service';

@Component({
  selector: 'app-schedule-request',
  templateUrl: './schedule-request.component.html',
  styleUrls: ['./schedule-request.component.css'],
})
export class ScheduleRequestComponent implements OnInit {
  requestForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private scheduleService: ScheduleService,
    private getUser: TokenService
  ) {}

  ngOnInit() {
    this.requestForm = this.formBuilder.group({
      selectedDate: ['', [Validators.required]],
      shiftType: ['morning', [Validators.required]], // Default to morning shift

      // Add more form controls as needed
    });
  }

  setShiftType(shift: string) {
    this.formControls['shiftType'].setValue(shift);
  }

  get formControls() {
    return this.requestForm.controls;
  }

  onSubmit() {
    const initialDate = new Date(this.formControls['selectedDate'].value);
    if (this.formControls['shiftType'].value == 'morning') {
      initialDate.setUTCHours(8, 0, 0, 0);
    } else {
      initialDate.setUTCHours(17, 0, 0, 0);
    }
    let formattedDateString = initialDate.toISOString();
    const userId = this.getUser.getUser().userId;
    if (this.requestForm.valid) {
      this.scheduleService
        .addScheduleRequest(formattedDateString, formattedDateString, userId)
        .subscribe(
          (response) => {
            // Handle successful creation, e.g., show a success message
            console.log('Schedule request created successfully:', response);
          },
          (error) => {
            // Handle error, e.g., show an error message
            console.error('Error creating schedule request:', error);
          }
        );
    }
  }
}
