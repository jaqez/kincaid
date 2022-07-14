import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

// MODELS
import { APIData } from '../models/api.interface';

@Injectable({
  providedIn: 'root'
})

export class KincaidHttpService {
  
  APIURL: string = environment.apiEndpoint;

  errorMessage: any;

  constructor(private http: HttpClient) { }

  // Http Options
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }  
    
  getData(): Observable<APIData> {
    return this.http
      .get<APIData>(`${this.APIURL}`)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
  }

  // HANDLE ERRORs 
  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // CLIENT ERROR
      this.errorMessage = `An error occurred: ${error.error}`;
    } 
    else {
      // BACKEND ERROR (400, 401, 403, 404, 413, 429, 500, 502, 503)
      switch(error.status) {
        case 401: // Unauthorized
          // this.router.navigateByUrl('/login');
          break;
        case 403: // Forbidden
          // this.router.navigateByUrl('/unauthorized');
          break;
        case 404: // Not Found
        case 413: // Payload Too Large
        case 429: // Too Many Requests
        case 500: // Internal Server Error
        case 502: // Bad Gateway
        case 503: // Service Unavailable (Strict Origin when Cross Origin)
          break;
      }
      this.errorMessage = `Status Code: ${error.status}: There was a problem completing the API request.`;
    }

    // RETURN OBSERVABLE MESSAGE
    return throwError(this.errorMessage);
  }

}
