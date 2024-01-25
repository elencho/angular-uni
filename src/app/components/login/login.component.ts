// login.component.ts

import { Component } from '@angular/core';
import { Router } from '@angular/router'; // Import the Router module
import { UserService } from 'src/app/service/user/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  username: string | undefined;
  password: string | undefined;

  constructor(private router: Router, private userService: UserService) {}

  onSubmit() {
    this.userService.login(this.username, this.password).subscribe(
      (data) => {
        // navigate to main
      },
      (error) => {
        console.error('Error fetching jobs:', error);
      }
    );
  }
  navigateToRegister() {
    console.log('login');
    this.router.navigate(['/register']);
  }
}
