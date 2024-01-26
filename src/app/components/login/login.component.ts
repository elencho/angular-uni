// login.component.ts

import { Component } from '@angular/core';
import { Router } from '@angular/router'; // Import the Router module
import { TokenService } from 'src/app/service/token/token.service';
import { UserService } from 'src/app/service/user/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  username: string | undefined;
  password: string | undefined;

  constructor(
    private router: Router,
    private userService: UserService,
    private tokenService: TokenService
  ) {}

  ngOnInit() {
    if (this.tokenService.getToken()) {
      const role = this.tokenService.getUser().role;
      if (role === '1') {
        this.router.navigate(['/admin']);
      } else {
        this.router.navigate(['/worker']);
      }
    }
  }

  onSubmit() {
    this.userService.login(this.username, this.password).subscribe(
      (data) => {
        this.tokenService.saveToken(data);
        switch (this.tokenService.getUser().role) {
          case '1':
            this.router.navigate(['/admin']);
            break;
          case '2':
            this.router.navigate(['/worker']);
            break;
          default:
            console.error('Incorrect user role');
        }
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
