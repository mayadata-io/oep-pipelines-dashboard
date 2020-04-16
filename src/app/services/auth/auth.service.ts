import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // constructor(private http: HttpClient, private cookieService: CookieService) { }
  // getAuthProviders() {
  //   const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Accept': 'application/json' })
  //   return this.http.get('/v3/token', {
  //     headers: headers, responseType: 'json'
  //   })
  // }

  // getUserDetails() {
  //   const headers = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //     'Accept': 'application/json'
  //   })
  //   return this.http.get('v3/identity', {
  //     params: { CSRF: this.cookieService.get('CSRF') },
  //     headers
  //   })
  // }

  // testAuthToken(data: any): boolean {
  //   const response = data;
  //   const currentAuth = response.data.filter(res => res.authProvider === this.cookieService.get('authProvider'));
  //   const isValidCookieAndAuthProvider = (
  //     (currentAuth[0].authProvider === this.cookieService.get('authProvider')) &&
  //     (currentAuth[0].jwt === this.cookieService.get('token'))
  //   );
  //   return isValidCookieAndAuthProvider;
  // }

}
