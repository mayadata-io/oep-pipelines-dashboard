import { Component, OnInit } from '@angular/core';
import { timer } from "rxjs";
import * as $ from 'jquery';
import { Meta, Title } from '@angular/platform-browser';
import { PipelineDetailService } from '../pipeline-detail.service';
import * as moment from 'moment';
import * as dateformat from 'dateformat';
import { SELECT_PANEL_INDENT_PADDING_X } from '@angular/material';
import { compileFactoryFunction } from '@angular/compiler/src/render3/r3_factory';




@Component({
  selector: 'app-pipeline-dashboard',
  templateUrl: './pipeline-dashboard.component.html',
  styleUrls: ['./pipeline-dashboard.component.scss']
})
export class PipelineDashboardComponent implements OnInit {
  id: any;
  // projects = ['maya-ui', 'maya-io-server', 'maya-kibana', 'maya-chatops', 'Grafana', 'graph-reporter', 'cloud-agent', 'director-vendor'];
  dashboardCommitData: any;
  pipelineData: any;
  konvoyPipelineData: any;
  rancherPipelineData: any;
  buildData: any;
  subscribe = false;
  awsData: any;
  activePlatform = 'none';
  ifInit = false;
  awsPipelinesCount: number = 0;
  konvoyPipelinesCount: number = 0;
  rancherPipelinesCount: number = 0;




  constructor(private meta: Meta, private titleService: Title, private pipelineDetailService: PipelineDetailService) {
    this.meta.addTag({ name: 'description', content: 'OEP is the CI and E2E portal for Mayadata github PR`s. Using this portal, Mayadata community uses this portal to find the build quality against each PR that is merged.' });
    this.meta.addTag({ name: 'keywords', content: 'mayadata,oep,ci,e2e' });
    this.titleService.setTitle("CI/E2E dashboard for OEP");
  }

  ngOnInit() {
    this.getApiData(); //get api data from service , every 10s data will refresh .
  }
  getApiData() {
    this.id = timer(0, 10000).subscribe(x => {
      this.pipelineDetailService.getPipelinesData('aws').then(res => {
        this.awsPipelinesCount = res.pipelineCount
        this.awsData = res.dashboard
      })
      this.pipelineDetailService.getPipelinesData('konvoy').then(res => {
        this.konvoyPipelinesCount = res.pipelineCount
        this.konvoyPipelineData = res.dashboard
        if (!this.ifInit) {
          this.platformChange('konvoy');
          this.ifInit = true;
        }
      })
      this.pipelineDetailService.getPipelinesData('rancher').then(res => {
        this.rancherPipelinesCount = res.pipelineCount
        this.rancherPipelineData = res.dashboard
      })
    })
  }

  platformChange(platform) {
    this.activePlatform = "none";
    switch (platform) {
      case "aws":
        this.pipelineData = this.awsData
        this.activePlatform = platform;
        break;

      case "konvoy":
        this.pipelineData = this.konvoyPipelineData
        this.activePlatform = platform;
        break;

      case "rancher":
        this.pipelineData = this.rancherPipelineData
        this.activePlatform = platform;
        break;

    }
  }
  platformBtn(activePlatform, btnPlatform) {
    if (activePlatform == btnPlatform) {
      return 'activePlatformBtn shadow'
    } else {
      return 'deactivePlatformBtn border bg-light border-primary rounded text-secondary'
    }
  }
  versionFunc(ver) {
    console.log('version', ver);
  }
  coverageTooltip(data) {
    let pipeline = data;
    return " Automated : " + pipeline.valid_test_count + " \n Total :" + pipeline.total_coverage_count
  }

  pipelineTooltip(index) {
    try {
      let data = index
      let jobs = data.jobs.filter(job => job.name.includes("tcid") || job.name.includes("TCID"));
      if (data.status == "running") {
        return "running"
      } else if (data.status == "none") {
        return ""
      } else {
        var passedJobs = this.passed(jobs)
        var failedJobs = this.failed(jobs)
        var skippedJobs = this.skipped(jobs)

        return "Passed: " + passedJobs + "\n Failed: " + failedJobs + "\n Skipped: " + skippedJobs;
      }
    } catch (e) {
      return "n/a"
    }
  }
  passed(data) {
    var passed = 0;
    for (var i = 0; i < data.length; i++) {
      if (data[i].status === ("success")) {
        passed = passed + 1;
      }
    }
    return passed;
  }

  failed(data) {
    var failed = 0;
    for (var i = 0; i < data.length; i++) {
      if (data[i].status === ("failed")) {
        failed = failed + 1;
      }
    }
    return failed;
  }
  skipped(data) {
    var skippedCount = 0;
    data.forEach(job => {
      if (job.status === ("skipped") || job.status === ("canceled")) {
        skippedCount = skippedCount + 1;
      }
    });
    return skippedCount;
  }
  getJobPercentForSkippedPipeline(i) {
    try {
      var pipeline = i;
      let jobs = pipeline.jobs.filter(job => job.name.includes("tcid") || job.name.includes("TCID")); //coverageJobs only consider in home dashboard
      if (jobs.length == 0) {
        return "100 0";
      } else if (pipeline.status == "failed" || pipeline.status == "canceled" || pipeline.status == "skipped") {
        var count = 0;
        jobs.forEach(job => {
          if (job.status == "skipped" || job.status == "canceled") {
            count++;
          }
        })
        var percentage = (count / jobs.length) * 100;
        return `${percentage} ${100 - percentage}`
      } else {
        return "0 0";
      }
    }
    catch {
      return "0 0";
    }

  }

  getJobPercentForPipeline(index) {
    try {
      var pipeline = index;
      let jobs = pipeline.jobs.filter(job => job.name.includes("tcid") || job.name.includes("TCID"));
      if (jobs.length == 0) {
        return "0 100";
      } else if (pipeline.status == "pending") {
        return "0 0";
      }
      else if (pipeline.status == "failed" || pipeline.status == "canceled" || pipeline.status == "success") {
        var count = 0;
        jobs.forEach(job => {
          if (job.status == "success") {
            count++;
          }
        })
        var percentage = (count / jobs.length) * 95;
        return `${percentage} ${95 - percentage}`
      }
      else if (pipeline.status == "running") {
        return "95 5";
      }
    }
    catch {
      return "0 0";
    }
  }

  getCoveragePercentage(percentage) {
    if (percentage != "NA") {
      let percentageString = percentage.replace(/[^\w\s]/gi, '')
      let value = parseInt(percentageString)
      return value + "%";
    } else {
      return percentage;
    }
  }

  getProject(id) {
    switch (id) {
      case 6:
        return 'maya-ui'
      case 5:
        return "oep-e2e-gcp"
      case 1:
        return "maya-io-server"
      case 16:
        return "maya-kibana"
      case 15:
        return "maya-chatops"
      case 18:
        return "Grafana"
      case 17:
        return "graph-reporter"
      case 14:
        return "cloud-agent"
      case 38:
        return "director-vendor"
      default:
        return "n/a"
    }
  }

  buildJobURL(projectID, jobID) {
    let getProject = this.getProject(projectID)
    let genURL = "https://gitlab.mayadata.io/oep/" + getProject + "/-/jobs/" + jobID
    window.open(genURL, "_blank");
  }

  getTriggerTime(commitTime) {
    var now = moment(dateformat((new Date()), "UTC:yyyy-mm-dd'T'HH:MM:ss"), 'YYYY-M-DD,HH:mm:ss');
    var buildTime = moment(commitTime, 'YYYY-M-DD,HH:mm:ss');
    var difference = moment.duration((now.diff(buildTime, 'second')), "second");
    var days = difference.days();
    var hours = difference.hours();
    var minutes = difference.minutes();
    var seconds = difference.seconds();
    if (days != 0) {
      return days + "d :" + hours + "h ";
    } else if (hours != 0) {
      return hours + "h :" + minutes + "m";
    }
    return minutes + "m :" + seconds + "sec";


  }

  statusButton(status) {
    switch (status) {
      case 'created':
        return 'far fa-dot-circle text-secondary font-size-23'
      case 'success':
        return 'far fa-check-circle text-success font-size-23'
      case 'failed':
        return 'far fa-times-circle text-danger font-size-23'
      case 'canceled':
        return 'far fa-dot-circle text-warning font-size-23'
      case 'running':
        return 'fas fa-circle-notch text-primary font-size-23 fa-spin'
      case 'skipped':
        return 'fas fa-chevron-circle-right text-secondary font-size-23'
      default:
        return 'n/a'
    }
  }


  genPages(platform: string, rowsPerPage: number): number[] {
    let cal;
    let n: number;

    switch (platform) {
      case 'aws':
        cal = this.awsPipelinesCount / rowsPerPage
        n = Math.trunc(cal + 1)
        // console.log(n);
        return [...Array(n)];
      case 'konvoy':
        cal = this.konvoyPipelinesCount / rowsPerPage
        n = Math.trunc(cal + 1)
        // console.log(n);
        return [...Array(n)];
      case 'rancher':
        cal = this.rancherPipelinesCount / rowsPerPage
        n = Math.trunc(cal + 1)
        // console.log(n);
        return [...Array(n)];
    }
  }
  async setPageInSession(key: string, value: string) {
    sessionStorage.setItem(key + 'Page', value)
    await this.clearfunc()
    this.getApiData();
    this.platformChange(key);
  }
  clearfunc() {
    this.id.unsubscribe();
    // this.awsData == {};
    this.pipelineData = {};
    this.activePlatform = "none";
  }

  getActivePage() {
    let get = (sessionStorage.getItem(this.activePlatform+'Page'))
    if (get != null){
      return get
    }
    else {
      return '00'
    }
  }
}
