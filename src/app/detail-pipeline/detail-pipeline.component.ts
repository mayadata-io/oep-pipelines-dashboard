import { Component, OnInit, OnChanges } from '@angular/core';
import { PipelineDetailService } from '../pipeline-detail.service'
import { Router } from '@angular/router';
import { from } from 'rxjs';
import { GithubUrlService } from '../services/urlService.service';
import * as moment from 'moment';

@Component({
  selector: 'app-detail-pipeline',
  templateUrl: './detail-pipeline.component.html',
  styleUrls: ['./detail-pipeline.component.css']
})
export class DetailPipelineComponent implements OnInit {
  public commitMessage;
  public commitUser;
  commitId;
  dashboard;
  pipeline_id: any;
  app_name: any;
  pipeline;
  platformImage: any;
  githubUrl: any;
  successJobs: any;
  failedJobs: any;
  executedJobs: any;
  gitlabWebURL: any;
  logURL: any;
  pipelineStartedAt: any;
  pipelineFinishedAt: any;
  stages = [];
  stagesName = ["CLUSTER-SETUP", "OPENEBS-SETUP", "FUNCTIONAL", "CHAOS", "INFRA-CHAOS", "OPENEBS-CLEANUP", "CLUSTER-CLEANUP"];
  constructor(private pipelineDetailService: PipelineDetailService, private router: Router, private githubUrlService: GithubUrlService) {
    let router_details = this.router.url.trim().split("/");
    this.pipeline_id = router_details[router_details.length - 1]
    this.app_name = router_details[router_details.length - 2]
  }
  ngOnInit() {
    try {
      this.pipelineDetailService.getPipelinesData(this.app_name).then(res => {
        this.dashboard = res;
        const data = this.getPipelineData(this.app_name, res)
        this.pipeline = data[0];
        this.platformImage = this.getPipelineImageURL(this.pipeline.ref);
        this.githubUrl = this.getGithubURL(this.pipeline.sha);
        this.commitUser = this.getCommitUser(this.app_name);
        this.commitId = this.pipeline.sha.substr(0, 8);
        this.commitMessage = this.getCommitMessage(this.app_name);
        this.successJobs = this.getJobsCount(this.pipeline.jobs, "success");
        this.failedJobs = this.getJobsCount(this.pipeline.jobs, "failed");
        this.executedJobs = this.successJobs + this.failedJobs;
        this.gitlabWebURL = this.pipeline.web_url;
        this.logURL = this.getLogUrl(this.app_name);
        this.pipelineStartedAt = this.timeConverter(this.pipeline.jobs[0].started_at);
        this.pipelineFinishedAt = this.FinishedPipelineStatus(this.pipeline)
        for (let i = 0; i < this.stagesName.length; i++) {
          this.stages.push(this.getStageDetails(this.pipeline.jobs, this.stagesName[i]));
        }
      });
    } catch (e) {
      console.log('error' + e);
    }
  }
  getGithubURL(commit) {
    return `https://github.com/openebs/e2e-openshift/commit/${commit}`
  }
  getPipelineImageURL(platform) {
    if (platform == "release-branch") {
      return `assets/images/icons-name/OpenEBS-base.svg`
    } else {
      return `assets/images/icons-name/${platform}.svg`
    }
  }
  getJobsCount(jobs, status) {
    return jobs.filter(job => job.status === status).length
  }
  buttonURL(url) {
    window.open(url, "_blank");
  }
  getStageDetails(jobs, stage) {
    const stageObj = {
      stageName: stage,
      allJobs: jobs.filter(job => job.stage == stage),
      noOfSuccessJobs: jobs.filter(job => job.stage == stage).filter(job => job.status == "success").length,
      noOfFailedJobs: jobs.filter(job => job.stage == stage).filter(job => job.status == "failed").length
    };

    for (let i = 0; i < stageObj.allJobs.length; i++) {
      this.githubUrlService.getGithubUrl('36', `${stageObj.allJobs[i].id}`).then(res => stageObj.allJobs[i].githuburl = res);
    }
    return stageObj;
  }

  getPipelineData(app, data) {
    if (app == "OpenEBS-base" || app == "release-branch") {
      return data.dashboard.filter(pipeline => pipeline.id == this.pipeline_id);
    }
    else {
      let index = data.dashboard.pipelines.findIndex(pipeline => pipeline[0].ref == app);
      return data.dashboard.pipelines[index].filter(pipeline => pipeline.id == this.pipeline_id);
    }
  }
  getPipelineIndex(app, data) {
    if (app == "OpenEBS-base" || app == "release-branch") {
      return data.dashboard.findIndex(pipeline => pipeline.ref == app);
    }
    else {
      data.dashboard.pipelines.findIndex(pipeline => pipeline[0].ref == app);
    }
  }
  getCommitUser(app) {
    if (app == "OpenEBS-base" || app == "release-branch") {
      return this.pipeline.jobs[0].author_name;
    }
    else {
      return this.pipeline.jobs[0].commit.committer_name;
    }
  }
  getCommitMessage(app) {
    if (app == "OpenEBS-base" || app == "release-branch") {
      return this.pipeline.jobs[0].message;
    }
    else {
      return this.pipeline.jobs[0].commit.message;
    }
  }
  getLogUrl(app) {
    if (app == "OpenEBS-base" || app == "release-branch") {
      return this.pipeline.kibana_url;
    }
    else {
      return this.pipeline.log_link;
    }
  }
  duration(finish, start, status) {
    try {
      var startedAt = moment(start, 'YYYY-M-DD,HH:mm:ss');
      var finishedAt = moment(finish, 'YYYY-M-DD,HH:mm:ss');
      var difference = moment.duration((finishedAt.diff(startedAt, 'second')), "second");
      var days = difference.days();
      var hours = difference.hours();
      var minutes = difference.minutes();
      var seconds = difference.seconds();
      if (status == 'success' || status == 'failed') {
        if (days != 0) {
          return days + "d :" + hours + "h :" + minutes + "m :" + seconds + "sec";
        } else if (hours != 0) {
          return hours + "h :" + minutes + "m :" + seconds + "sec";
        }
        return minutes + "m :" + seconds + "sec";
      } else if (status == 'canceled') { return 'Cancelled' }
      else if (status == 'running') { return 'Running' }
      return "_"
    } catch (e) {
      console.log('error' + e);
    }
  }
  timeConverter(time) {
    return moment.utc(time, 'YYYY-M-DD,HH:mm:ss').local().calendar();
  }
  FinishedPipelineStatus(pipeline) {
    if (pipeline.status == 'success' || pipeline.status == 'failed') {
      return 'Finished_at :' + this.timeConverter(pipeline.jobs[pipeline.jobs.length - 1].finished_at);
    } else if (pipeline.status == 'canceled') {
      return '~ Pipeline Cancelled ~'
    } else if (pipeline.status == 'running') {
      return 'running'
    } else 'N/A'
  }
}
