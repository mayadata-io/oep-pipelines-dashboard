import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from "rxjs/operators";
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PipelineDetailService {
  public backendData: any;
  commitData: any;
  awsURL: any;
  konvoyURL: any;
  rancherURL: any;
  buildDetail: any;
  openebsBaseBuildURL: any;
  openebsBaseReleaseURL: any;
  restItems;
  host: any;
  items;

  constructor(private http: HttpClient, private router: Router) {
    this.host = window.location.host;
    if ((this.host.toString().indexOf("localhost") + 1) && this.host.toString().indexOf(":")) {
      this.awsURL = "http://localhost:3000/api/aws";
      this.konvoyURL = "http://localhost:3000/api/konvoy";
      this.rancherURL = "http://localhost:3000/api/rancher";


    } else if (this.host == "0.0.0.0:4200") {
      this.awsURL = "https://oep-pipelines.mayadata.io/api/aws";
      this.konvoyURL = "https://oep-pipelines.mayadata.io/api/konvoy";
      this.rancherURL = "https://oep-pipelines.mayadata.io/api/rancher";

    } else {
      this.awsURL = "/api/aws";
      this.konvoyURL = "/api/konvoy";
      this.rancherURL = "/api/rancher";
    }
  }

  genApiURL(preURL:string, platform:string) {
    let getPage = sessionStorage.getItem(platform + 'Page')
    if (getPage != null) {
      return preURL + '?page=' + getPage
    } else {
      return preURL
    }
  }


  async getPipelinesData(backend) {
    if (backend == "aws") {
      this.backendData = await this.http.get<any>(this.genApiURL(this.awsURL, backend)).toPromise();      
      return this.backendData;
    }
    else if (backend == "konvoy") {
      this.backendData = await this.http.get<any>(this.genApiURL(this.konvoyURL, backend)).toPromise();
      return this.backendData;
    }
    else if (backend == "rancher") {
      this.backendData = await this.http.get<any>(this.genApiURL(this.rancherURL, backend)).toPromise();
      return this.backendData;
    }
  }

  // Dev mode :
  // async getPipelineMetrics(platform , start ,end){
  //   try {
  //     // https://oep-pipelines.mayadata.io/api/metrics?platform=rancher_pipelines&start='2020-06-01'&end='2020-06-06'
  //     let GenURL = `/api/metrics?platform=${platform}&start='${start}'&end='${end}'`
  //     // const headerDict = {
  //     //   // 'Content-Type': 'application/json',
  //     //   // 'Accept': 'application/json',
  //     //   // 'Access-Control-Allow-Headers': 'Content-Type',
  //     //   'Access-Control-Allow-Origin':'*',
  //     //   'Access-Control-Expose-Headers':'Authorization',
  //     //   'Access-Control-Allow-Headers': 'Accept, Content-Type, Content-Length, Accept-Encoding, Authorization,X-CSRF-Token',

  //     // }
  //     // const requestOptions = {                                                                                                                                                                                 
  //     //   headers: new HttpHeaders(headerDict), 
  //     // };
  //      let data =   await this.http.get<any>(GenURL).toPromise();
  //      return data;
  //   } catch (error) {
  //     console.log("metrics Error  :  - - -- -  ", error);

  //   }
  // }
}
