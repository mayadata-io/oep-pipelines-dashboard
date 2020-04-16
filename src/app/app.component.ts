import { Component } from '@angular/core';
import { AuthService } from './services/auth/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { UtilsService } from './services/utils/utils.service';
import { DomSanitizer } from '@angular/platform-browser';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'dashboard-ci';
  logOutUrl: any;
  userProfileUrl: string;
  loginUrl: string;
  signupUrl: string;
  myPortal: string;
  routerUrl: boolean;
  safeLogOutUrl: any;
  domain: string;
  toggle = false;
  isUserAvatarLoading = true;
  isLoggedInSuccessfully = false;
  userData;
  userDetails;
  routePath;

  constructor( private cookieService: CookieService,
    private authService: AuthService, private utils: UtilsService, private sanitizer: DomSanitizer ) { }
  ngOnInit(): void {
    this.routePath = document.location.pathname
    this.userProfileUrl = `${this.utils.websites().portalUrl}/profile`;
    this.myPortal = this.utils.websites().portalUrl;
    this.logOutUrl = `${this.utils.websites().accountUrl}/logout`;
    this.loginUrl = `${this.utils.websites().accountUrl}/login`;
    this.signupUrl = `${this.utils.websites().accountUrl}/signup`;
    this.safeLogOutUrl = this.sanitizer.bypassSecurityTrustUrl(this.logOutUrl);
    // this.authService.getAuthProviders().subscribe();    
    // if ((this.cookieService.check('token')) && (this.cookieService.check('authProvider'))) {

    //   this.authService.getAuthProviders().subscribe(res => {
    //     const isTokenValid = this.authService.testAuthToken(res);
    //     if (isTokenValid) {
    //       this.authService.getUserDetails().subscribe(res => {
    //         this.userData = res;
    //         console.log(this.userData,'userData');
    //         this.isUserAvatarLoading = false;
    //         this.isLoggedInSuccessfully = true;
    //         this.userDetails = this.userData.data.filter(data => data.externalIdType === 'github_user')[0] || this.userData.data.filter(data => data.externalIdType === 'google_user')[0] || this.userData.data.filter(data => data.externalIdType === 'rancher_id')[0];
    //         console.log('userDetails',this.userDetails);
    //       });
    //     } else {
    //       this.isUserAvatarLoading = false;
    //       console.log('Token is expired!!!')
    //       // window.location.href = this.loginUrl;
    //     }
    //   })
    // } else {
    //   this.isUserAvatarLoading = false;
    //   // window.location.href = this.loginUrl;
    // }

    // setInterval(() => {
    //   this.routePath = document.location.pathname
    //   if ((this.cookieService.check('token')) && (this.cookieService.check('authProvider'))) {
    //     this.authService.getAuthProviders().subscribe(res => {
    //       const isTokenValid = this.authService.testAuthToken(res);
    //       if (isTokenValid) {
    //         if (!this.isLoggedInSuccessfully) {
    //           this.isUserAvatarLoading = false;
    //           location.reload();
    //         }
    //       } else {
    //         if (this.isLoggedInSuccessfully) {
    //           this.isUserAvatarLoading = false;
    //           location.reload();
    //         }
    //       }
    //     })
    //   } else {
    //     if (this.isLoggedInSuccessfully) {
    //       this.isUserAvatarLoading = false;
    //       location.reload();
    //     }
    //   }
    // }, 5000)
  }
}
