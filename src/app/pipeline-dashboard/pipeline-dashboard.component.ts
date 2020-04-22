import { Component, OnInit } from '@angular/core';
import { timer } from "rxjs";
import * as $ from 'jquery';
import { Meta, Title } from '@angular/platform-browser';
import { PipelineDetailService } from '../pipeline-detail.service';
import * as moment from 'moment';
import * as dateformat from 'dateformat';




@Component({
  selector: 'app-pipeline-dashboard',
  templateUrl: './pipeline-dashboard.component.html',
  styleUrls: ['./pipeline-dashboard.component.scss']
})
export class PipelineDashboardComponent implements OnInit {
  id: any;
  projects = ['maya-ui', 'maya-io-server', 'maya-kibana', 'maya-chatops', 'Grafana', 'graph-reporter', 'cloud-agent', 'director-vendor'];
  dashboardCommitData: any;
  pipelineData: any;
  konvoyPipelineData: any;
  rancherPipelineData: any;
  buildData: any;
  subscribe = false;


  constructor(private meta: Meta, private titleService: Title, private pipelineDetailService: PipelineDetailService) {
    this.meta.addTag({ name: 'description', content: 'OEP is the CI and E2E portal for Mayadata github PR`s. Using this portal, Mayadata community uses this portal to find the build quality against each PR that is merged.' });
    this.meta.addTag({ name: 'keywords', content: 'mayadata,oep,ci,e2e' });
    this.titleService.setTitle("CI/E2E dashboard for OEP");
  }

  ngOnInit() {
    this.getApiData(); //get api data from service , every 10s data will refresh .

    $(function () {
      $('input[type="checkbox"]').change(function () {
        // We check if one or more checkboxes are selected
        // If one or more is selected, we perform filtering
        if ($('input[type="checkbox"]:checked').length > 0) {
          // Get values all checked boxes
          var vals = $('input[type="checkbox"]:checked').map(function () {
            return this.value;
          }).get();
          // two things to table rows
          // 1. We hide all
          // 2. Then we filter, show those project whose value in second  <td> and class of project-name matches checkbox value
          $('table tr')
            .hide()    // 1
            .filter(function () {
              // display row which have checkbox value and .project-name value
              return vals.indexOf($(this).find('td .project-name').text()) > -1;
            }).show();
        } else {
          // Show all
          $('table tr').show();
        }
      });
    });
  }
  getApiData() {

    this.id = timer(0, 10000).subscribe(x => {
      // this.pipelineDetailService.getPipelinesData('commit').then(res => {
      //   this.dashboardCommitData = res.dashboard
      // })
      // this.pipelineDetailService.getPipelinesData('build').then(res => {
      //   this.buildData = res.dashboard
      // })
      // this.pipelineDetailService.getPipelinesData('gcp').then(res => {
      //   this.pipelineData = res.dashboard
      // })
      // this.pipelineDetailService.getPipelinesData('konvoy').then(res => {
      //   this.konvoyPipelineData = res.dashboard
      // })
      this.pipelineDetailService.getPipelinesData('rancher').then(res => {
        this.rancherPipelineData = res.dashboard
        console.log(this.rancherPipelineData);

      })
      
    })
  }

  stopTimer() {
    if (this.subscribe) {
      this.getApiData();
      this.subscribe = false;
      $('input[type="checkbox"]:checkbox').prop('checked', false);
    } else {
      this.id.unsubscribe();
      this.subscribe = true;
    }
  }
  versionFunc(ver) {
    console.log('version', ver);
  }
  coverageTooltip(data) {
    let pipeline = data;
    let coverageJobs = pipeline.jobs.filter(job => job.name.includes("tcid"));
    let nonAutomatedJobs = pipeline.jobs.length - coverageJobs.length
    return " Automated : " + coverageJobs.length + " \n Total :" + pipeline.total_coverage_count
  }

  pipelineTooltip(index) {
    try {
      let data = index
      let jobs = data.jobs.filter(job => job.name.includes("tcid"));
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
      let jobs = pipeline.jobs.filter(job => job.name.includes("tcid")); //coverageJobs only consider in home dashboard
      if (jobs.length == 0) {
        return "100 0";
      }else if (pipeline.status == "failed" || pipeline.status == "canceled" || pipeline.status == "skipped") {
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
      let jobs = pipeline.jobs.filter(job => job.name.includes("tcid"));
      if (jobs.length == 0) {
        return "0 100";
      }else if (pipeline.status == "pending") {
        return "0 0";
      }
      else if (pipeline.status == "failed" || pipeline.status == "canceled" || pipeline.status == "success") {
        var count = 0;
        jobs.forEach(job => {
          if (job.status == "success") {
            count++;
          }
        })
        var percentage = (count / jobs.length) * 100;
        return `${percentage} ${100 - percentage}`
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
      console.log("percentage",percentage);
      
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
      return hours + "h :" + minutes + "m" ;
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



}
