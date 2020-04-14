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
  pipelineData: any;
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
      this.commitData = "http://localhost:3000/api/commit";
      this.buildDetail = "http://localhost:3000/api/build";
      this.pipelineData = "http://localhost:3000/api/pipelines/gcp";
      this.konvoyPipelineData = "http://localhost:3000/api/pipelines/konvoy";
      this.rancherPipelineData = "http://localhost:3000/api/pipelines/rancher";


    } else if(this.host == "0.0.0.0:4200") {
      this.commitData = "https://ci.mayadatastaging.io/api/commit";
      this.buildDetail = "http://ci.mayadatastaging.io/api/build";
      this.pipelineData = "https://ci.mayadatastaging.io/api/pipelines/gcp";
      this.konvoyPipelineData = "https://ci.mayadatastaging.io/api/pipelines/konvoy";
      this.rancherPipelineData = "https://ci.mayadatastaging.io/api/pipelines/rancher";

    }else {
      this.commitData = "/api/commit";
      this.buildDetail = "/api/build";
      this.pipelineData = "/api/pipelines/gcp";
      this.konvoyPipelineData = "/api/pipelines/konvoy";
      this.rancherPipelineData = "/api/pipelines/rancher";

    }
  }


  async getPipelinesData(backend) {
    if (backend == "commit") {
      this.backendData = await this.http.get<any>(this.commitData).toPromise();
      return this.backendData;
    }
    else if (backend == "gcp") {
      this.backendData = await this.http.get<any>(this.pipelineData).toPromise();
      return this.backendData;
    }
    else if (backend == "build") {
      this.backendData = await this.http.get<any>(this.buildDetail).toPromise();
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
