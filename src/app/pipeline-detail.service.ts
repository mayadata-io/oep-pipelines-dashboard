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
  awsData: any;
  konvoyPipelineData: any;
  rancherPipelineData: any;
  buildDetail: any;
  openebsBaseBuildURL: any;
  openebsBaseReleaseURL: any;
  restItems;
  host: any;
  items;

  constructor(private http: HttpClient, private router: Router) {
    this.host = window.location.host;
    if ((this.host.toString().indexOf("localhost") + 1) && this.host.toString().indexOf(":")) {
      this.awsData = "https://oep-pipelines.mayadata.io/api/aws";
      this.konvoyPipelineData = "https://oep-pipelines.mayadata.io/api/konvoy";
      this.rancherPipelineData = "https://oep-pipelines.mayadata.io/api/rancher";


    } else if (this.host == "0.0.0.0:4200") {
      this.awsData = "https://oep-pipelines.mayadata.io/api/aws";
      this.konvoyPipelineData = "https://oep-pipelines.mayadata.io/api/konvoy";
      this.rancherPipelineData = "https://oep-pipelines.mayadata.io/api/rancher";

    } else {
      this.awsData = "/api/aws";
      this.konvoyPipelineData = "/api/konvoy";
      this.rancherPipelineData = "/api/rancher";
    }
  }


  async getPipelinesData(backend) {
    if (backend == "aws") {
      this.backendData = await this.http.get<any>(this.awsData).toPromise();
      return this.backendData;
    }
    else if (backend == "konvoy") {
      this.backendData = await this.http.get<any>(this.konvoyPipelineData).toPromise();
      return this.backendData;
    }
    else if (backend == "rancher") {
      this.backendData = await this.http.get<any>(this.rancherPipelineData).toPromise();
      return this.backendData;
    }
  }
  async getPipelineMetrics(platform , start ,end){
    try {
      // https://oep-pipelines.mayadata.io/api/metrics?platform=rancher_pipelines&start='2020-06-01'&end='2020-06-06'
      let GenURL = `http://localhost:3000/api/metrics?platform=${platform}&start='${start}'&end='${end}'`
      // const headerDict = {
      //   // 'Content-Type': 'application/json',
      //   // 'Accept': 'application/json',
      //   // 'Access-Control-Allow-Headers': 'Content-Type',
      //   'Access-Control-Allow-Origin':'*',
      //   'Access-Control-Expose-Headers':'Authorization',
      //   'Access-Control-Allow-Headers': 'Accept, Content-Type, Content-Length, Accept-Encoding, Authorization,X-CSRF-Token',

      // }
      // const requestOptions = {                                                                                                                                                                                 
      //   headers: new HttpHeaders(headerDict), 
      // };
       let data =   await this.http.get<any>(GenURL).toPromise();
       return data;
    } catch (error) {
      console.log("metrics Error  :  - - -- -  ", error);
      
    }
  }
}
