import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
      this.awsData = "http://localhost:3000/api/aws";
      this.konvoyPipelineData = "http://localhost:3000/api/konvoy";
      this.rancherPipelineData = "http://localhost:3000/api/rancher";


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
}
