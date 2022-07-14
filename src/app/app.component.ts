import { Component, OnInit } from '@angular/core';
import { KincaidHttpService } from './services/kincaid-http.service';
import { HttpErrorResponse } from '@angular/common/http';
import { APIData } from './models/api.interface';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  
  loadingData: boolean = false;
  apiData: APIData | undefined;
  apiEnvironment: string | undefined;
  apiUpdateDate: number | undefined;
  apiVersion: string | undefined;
  
  constructor(private kincaidHttpService: KincaidHttpService) {}

  ngOnInit(): void {

    this.loadingData = true;

    this.apiData = {
      environment: '',
      update_date: 0,
      version: '',
    }
    
    // Make initial API request
    this.loadData();
   
  } // END: NGOnInit


  loadData() {

    this.kincaidHttpService
    .getData()
    .subscribe((data: any) => {

      if (data) {
        // convert object to array
        let arr: any[] = [];  
        arr.push(data)  
        
        this.apiData = {
          environment: arr[0].environment,
          update_date: Date.parse(arr[0].updateDate),
          version: arr[0].version,
        }

      } 
      else {

        // stop the loading indicator and display 0 (ZERO)
        // this.loadingData = false;

      }
      setTimeout(() => {
        this.loadingData = false;
      }, 1000);
      
    
    },
    (error: HttpErrorResponse) => {

      // this.searchState.error = error;
      // this.searchState.count = 0;

    });
    
  } // loadData()

}
