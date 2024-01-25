// api.service.ts

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  apiUrl: string = 'http://lukabudagovi-001-site1.atempurl.com/api/';
}
