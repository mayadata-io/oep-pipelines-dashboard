import { Injectable } from "@angular/core";

import { HttpClient } from "@angular/common/http";

import { Observable } from "rxjs/Observable";

@Injectable()
export class GithubUrlService {
  private apiurl: string;
  host: string;
  constructor(private http: HttpClient) {
    this.host = window.location.host;
    if ((this.host.toString().indexOf("localhost") + 1) && this.host.toString().indexOf(":")) {
     this.apiurl = 'http://localhost:3001/'
    } else {
      this.apiurl = '/'
    }
  }

  getGithubUrl(repoName: string, jobID: string) {
    const gitlabDetails= {
      repoName: repoName,
      jobId: jobID,
    };
    return new Promise((resolve, reject) => {
     this.http.get<any>(this.apiurl + 'github/url', { params: gitlabDetails}).subscribe(
      data => {
       resolve(data)
     },
      error => {
       reject(error);
     }, );
}); }
}
