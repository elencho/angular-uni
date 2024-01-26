import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from 'src/app/service/token/token.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {
  firstname!: string;
  lastname!: string;

  constructor(private router: Router, private tokenService: TokenService) {}

  ngOnInit() {
    // Fetch worker data from the service (replace 'getWorkerData()' with your actual method)
    // const workerData = this.workerService.getWorkerData();
    // this.firstname = ; // Default to 'Guest Worker' if worker data is not available
  }

  logout() {
    this.tokenService.logOut();

    this.router.navigate(['/login']);
  }
}
