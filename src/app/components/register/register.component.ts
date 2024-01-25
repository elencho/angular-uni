// register.component.ts

import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms'; // Import the necessary modules
import { Router } from '@angular/router';
import { UserService } from 'src/app/service/user/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  registrationForm!: FormGroup; // Declare a FormGroup
  jobOptions: any[] = [];
  mounted = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService
  ) {
    this.createForm(); // Call the function to initialize the form
  }
  ngOnInit(): void {
    this.userService.getJobs().subscribe(
      (data) => {
        const arr = Object.values(data);
        this.jobOptions = arr;
        this.mounted = true;
      },
      (error) => {
        console.error('Error fetching jobs:', error);
      }
    );
  }

  createForm() {
    this.registrationForm = this.fb.group(
      {
        firstname: ['', Validators.required],
        lastname: ['', Validators.required],
        email: ['', Validators.required],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirm: ['', Validators.required],
        job: ['', Validators.required],
      },
      {
        validator: this.passwordMatchValidator, // Add custom validator for password matching
      }
    );
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirm')?.value;

    return password === confirmPassword ? null : { passwordMismatch: true };
  }
  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  onSubmit() {
    if (this?.registrationForm?.valid) {
      // {
      //   firstName: firstName,
      //   lastName: lastName,
      //   email: email,
      //   password: password,
      //   jobId: jobId,
      // },
      const firstname = this.registrationForm.get('firstname')?.value;
      const lastname = this.registrationForm.get('lastname')?.value;
      const email = this.registrationForm.get('email')?.value;
      const password = this.registrationForm.get('password')?.value;
      const jobId = this.registrationForm.get('jobId')?.value as number | null;
      this.userService
        .register(firstname, lastname, email, password, jobId)
        .subscribe(
          (data) => {
            // navigate to main
          },
          (error) => {
            console.error('Error fetching jobs:', error);
          }
        );
    } else {
      console.log('Form is invalid. Please check the fields.');
    }
  }
}
