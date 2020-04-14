import { Injectable, isDevMode } from '@angular/core';
import { authAccount } from '../../model/data.model';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  domain: string;
  constructor() {
    this.domain = window.location.hostname.split('.')[1];
  }

  websites(): authAccount {
    if (isDevMode()) {
      return {
        "marketingUrl": 'http://localhost:3000',
        "portalUrl": 'http://localhost:5000',
        "productUrl": 'http://localhost:8080',
        "accountUrl": 'https://0.0.0.0:8000'
      }
    } else {
      return {
        "marketingUrl": `https://${this.domain}.io`,
        "portalUrl": `https://portal.${this.domain}.io`,
        "productUrl": `https://director.${this.domain}.io`,
        "accountUrl": `https://account.${this.domain}.io`
      }
    }
  }
}
