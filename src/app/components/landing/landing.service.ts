import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class LandingService {
  constructor(private httpClient: HttpClient) { }

  private apiURL = "https://web.aarco.com.mx/api-examen/api/examen/sepomex/";


  httpOptions = {
     headers: new HttpHeaders({
       'Content-Type': 'application/json'
     })
  }


  get(zip: any): Observable<any> {
   return this.httpClient.get<any>(this.apiURL+zip)
   .pipe(
     catchError(this.errorHandler)
   )
 }

 errorHandler(error: any) {
   let errorMessage = '';
   if(error.error instanceof ErrorEvent) {
     errorMessage = error.error.message;
   } else {
     errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
   }
   return throwError(error);
 }

}
