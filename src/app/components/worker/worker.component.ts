import { Component, OnInit } from '@angular/core';
import { Route, Router } from '@angular/router';
import { TokenService } from 'src/app/service/token/token.service';
import { UserService } from 'src/app/service/user/user.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './worker.component.html',
  styleUrls: ['./worker.component.css'],
})
export class WorkerComponent implements OnInit {
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
