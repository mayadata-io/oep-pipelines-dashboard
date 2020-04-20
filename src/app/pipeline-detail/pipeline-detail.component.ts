import { Component, OnInit, OnChanges } from '@angular/core';
import { PipelineDetailService } from '../pipeline-detail.service'
import { Router } from '@angular/router';
import { from } from 'rxjs';
import { GithubUrlService } from '../services/urlService.service';
import * as moment from 'moment';
import { Chart } from 'chart.js';
import * as $ from 'jquery';
import { Meta, Title } from '@angular/platform-browser';



@Component({
  selector: 'app-pipeline-detail',
  templateUrl: './pipeline-detail.component.html',
  styleUrls: ['./pipeline-detail.component.scss'],
})
export class PipelineDetailComponent implements OnInit {


  pipeline: any;
  pipeline_id: any;
  app_name: any;
  platform: any;

  constructor(private meta: Meta, private titleService: Title, private pipelineDetailService: PipelineDetailService, private router: Router, private githubUrlService: GithubUrlService) {
    let router_details = this.router.url.trim().split("/");
    this.platform = router_details[router_details.length - 1]
    this.pipeline_id = router_details[router_details.length - 3]
    this.app_name = router_details[router_details.length - 4]
    this.titleService.setTitle(this.pipeline_id + " | " + this.app_name);
  }

  public doughnutChartLabels = ['failed', 'Success', 'cancel', 'skipped'];
  public doughnutChartData = [];
  public doughnutAutomatedChartData = [];
  public doughnutChartType = 'doughnut';
  data: any;
  jobsDetail: any;
  successJobs: any;
  failedJobs: any;
  canceledJobs: any;
  skippedJobs: any;
  hide: Boolean = false;
  btnIcon: any = "fas fa-angle-right shadow-txt text-primary";

  ngOnInit() {
    this.pipelineDetailService.getPipelinesData(this.platform).then(res => {
      this.data = res.dashboard.filter(data => data.pipelineid == this.pipeline_id)[0]
      this.jobsDetail = this.getJobDetails(this.data)
      this.failedJobs = this.data.jobs.filter(data => data.status == 'failed').length
      this.doughnutChartData.push(this.failedJobs);
      this.doughnutAutomatedChartData.push(this.data.jobs.filter(d => d.status == 'failed').filter(j => j.name.includes('tcid')).length);
      this.successJobs = this.data.jobs.filter(data => data.status == 'success').length
      this.doughnutChartData.push(this.successJobs);
      this.doughnutAutomatedChartData.push(this.data.jobs.filter(d => d.status == 'success').filter(j => j.name.includes('tcid')).length);

      this.canceledJobs = this.data.jobs.filter(data => data.status == 'canceled').length
      this.doughnutChartData.push(this.canceledJobs);
      this.doughnutAutomatedChartData.push(this.data.jobs.filter(d => d.status == 'canceled').filter(j => j.name.includes('tcid')).length);

      this.skippedJobs = this.data.jobs.filter(data => data.status == 'skipped').length
      this.doughnutChartData.push(this.skippedJobs);
      this.doughnutAutomatedChartData.push(this.data.jobs.filter(d => d.status == 'skipped').filter(j => j.name.includes('tcid')).length);

      this.barChart(this.data)

    })

  }

  genReadmeURL(stage, job) {
    // example === https://github.com/mayadata-io/gui-automation/blob/master/testcases/gui-dashboard-alerts-check.md
    if (stage == 'DIRECTOR-GUI-CHECK') {
      let host = "https://github.com/mayadata-io/gui-automation/tree/master/testcases"
      return host + '/' + job + '.md'
    } else {
      let host = "https://github.com/mayadata-io/oep-e2e/tree/master/litmus/director/"
      return host + job + '/' + 'README.md'
    }
  }
  genStageName(stage) {
    switch (stage) {
      case 'CLUSTER-SETUP':
        return '1-cluster-setup'
      case 'PROVIDER-INFRA-SETUP':
        return '2-provider-infra-setup'
      case 'DIRECTOR-HEALTH-CHECK':
        return '3-director-sanity-check'
      case 'DIRECTOR-FUNCTIONALITY-CHECK':
        return '4-director-functionality-check'
      case 'CLUSTER-CLEANUP':
        return '5-cluster-cleanup'
      default:
        return 'n/a'
    }
  }
  statusButton(status) {
    switch (status) {
      case 'success':
        return 'badge badge-pill badge-success'
      case 'failed':
        return 'badge badge-pill badge-danger'
      case 'skipped':
        return 'badge badge-pill badge-secondary'
      case 'Running':
        return 'badge badge-pill badge-primary'
      case 'canceled':
        return 'badge badge-pill badge-warning'
      default:
        return 'n/a'
    }
  }

  showHide() {
    if (this.hide == false) {
      document.getElementById("commit_div").classList.remove('d-none');
      document.getElementById("commit_div").classList.add('col-md-3');
      document.getElementById("content_div").classList.remove('col-md-9');
      document.getElementById("content_div").classList.add('col-md-6');
      this.btnIcon = "fas fa-times shadow-txt text-primary";
      this.hide = true;
    } else {
      document.getElementById("commit_div").classList.remove('col-md-3');
      document.getElementById("commit_div").classList.add('d-none');
      document.getElementById("content_div").classList.remove('col-md-6');
      document.getElementById("content_div").classList.add('col-md-9');
      this.btnIcon = "fas fa-angle-right shadow-txt text-primary"
      this.hide = false;
    }

  }
  genGitHubURL(sha) {
    let host = 'https://github.com/mayadata-io/'
    let repo = this.app_name;
    return host + repo + '/commit/' + sha
  }
  genJobLogLink(id) {
    let host = 'https://gitlab.mayadata.io/'
    let genURL = host + 'oep/oep-e2e-'+this.platform+'/-/jobs/' + id
    return genURL

  }

  dateFormat(date) {
    return moment(date).format('MMMM Do YYYY, h:mm a')
  }
  dateDiff(start, end) {
    var now = moment(end, 'YYYY-M-DD,HH:mm:ss');
    var buildTime = moment(start, 'YYYY-M-DD,HH:mm:ss');
    var difference = moment.duration((now.diff(buildTime, 'second')), "second");
    var days = difference.days();
    var hours = difference.hours();
    var minutes = difference.minutes();
    var seconds = difference.seconds();
    if (days != 0) {
      return days + "d :" + hours + "h ";
    } else if (hours != 0) {
      return hours + "h :" + minutes + "m :" + seconds + "sec";
    }
    return minutes + "m :" + seconds + "sec";

  }
  buttonURL(url) {
    window.open(url, "_blank");
  }
  getProject(id) {
    switch (id) {
      case 6:
        return 'maya-ui'
      case 5:
        return "oep-e2e-gcp"
      case 1:
        return "maya-io-server"
      default:
        return "n/a"
    }
  }
  getJobDetails(pipeline) {
    // console.log(pipeline);
    var stages = [];
    var obj = [];
    pipeline.jobs.forEach(job => {
      if (!stages.includes(job.stage)) {
        stages.push(job.stage);
      }
    });
    stages.forEach(stage => {
      const stageObj = {
        stageName: stage,
        allJobs: pipeline.jobs.filter(job => job.stage == stage),
        status: this.stageStatusForObj(stage, pipeline.jobs),
        noOfSuccessJobs: pipeline.jobs.filter(job => job.stage == stage).filter(job => job.status == "success").length,
        noOfFailedJobs: pipeline.jobs.filter(job => job.stage == stage).filter(job => job.status == "failed").length
      };
      obj.push(stageObj);
    })
    return obj
  }

  stageStatusForObj(stage, jobs) {
    let stageJobs = jobs.filter(job => job.stage == stage);
    // console.log('forStageObj',stageJobs);
    let successJ = stageJobs.filter(j => j.status == "success").length
    let failedLength = stageJobs.filter(j => j.status == "failed").length
    let canceledLength = stageJobs.filter(j => j.status == "canceled").length
    let runningLength = stageJobs.filter(j => j.status == "running").length
    let skippedLength = stageJobs.filter(j => j.status == "skipped").length
    if (runningLength) {
      return "running"
    } else if (canceledLength) {
      return "canceled"
    } else if (skippedLength) {
      return "skipped"
    } else if (failedLength) {
      return "failed"
    } else {
      return 'success'
    }
  }

  genStageStatus(state) {
    switch (state) {
      case "success":
        return 'stageSuccess'
      case "failed":
        return 'stageFailed'
      case "skipped":
        return 'stageSkipped'
      case "canceled":
        return 'stageCanceled'

    }

  }

  stageStatus(state) {
    switch (state) {
      case 'success':
        return "fo-sz-16 fa fa-check text-success bg-white shadow-txt p-1 margin-status-icon border rounded-circle"
      case 'failed':
        return "fo-sz-16 fa fa-times text-danger  bg-white shadow-txt p-1 margin-status-icon border rounded-circle"
      case 'canceled':
        return "fo-sz-16 fa fa-ban text-warning bg-white shadow-txt p-1 margin-status-icon border rounded-circle"
      case 'created':
        return "fo-sz-16 far fa-dot-circle text-warning bg-white shadow-txt p-1 margin-status-icon border rounded-circle"
      case 'running':
        return "fo-sz-16 fa fa-circle-o-notch btn-txt fa-spin btn-outline-primary bg-white shadow-txt p-1 margin-status-icon border rounded-circle"
      case 'pending':
        return "fo-sz-16 fa fa-exclamation-triangle text-warning bg-white shadow-txt p-1 margin-status-icon border rounded-circle"
      case 'skipped':
        return "fo-sz-16 fas fa-angle-double-right text-secondary bg-white shadow-txt p-1 margin-status-icon border rounded-circle"

      default:
        break;
    }
  }


  barChart(pipeline) {
    $('#chart').empty();
    $('#chart').html('<canvas id="myChart"></canvas>'); // then load chart.
    var ctx = <HTMLCanvasElement>document.getElementById('myChart');
    var myChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.getJobsName(pipeline, 'labels'),
        datasets: [{
          label: '  PipelineID :  ' + pipeline.pipelineid + '  ',
          data: this.getJobsName(pipeline, 'data'),
          backgroundColor: this.getJobsName(pipeline, 'bgcolor'),
          borderColor: this.getJobsName(pipeline, 'bordercolor'),
          borderWidth: 2
        }]
      },
      options: {
        title: {
          display: true,
          text: 'Duration of Jobs'
        },
        responsive: true,
        // pointLabelFontSize: 5,
        tooltips: {
          mode: 'nearest'
        },
        scales: {
          yAxes: [{
            id: 'left-y-axis',
            type: 'linear',
            position: 'left',
            scaleLabel: {
              display: true,
              labelString: 'Time in Minutes'
            }
          }]
        }
      }
    });
    /**
     * Clicking Bar graphs open gitlab job logs page.
     */
    document.getElementById("myChart").onclick = function (evt) {
      try {
        // var activePoints = myChart.getElementsAtEvent(evt);
        // var firstPoint = activePoints[0];
        // console.log('firstPoint',firstPoint);

        // var label = myChart.data.labels[firstPoint._index];

        // var getJobId = pipeline.jobs.filter(job => job.name === label)[0]
        // var pipelineURL = pipeline.web_url.split('pipelines/')
        // var url = pipelineURL[0] + '-/jobs/' + getJobId.id
        // window.open(url, '_blank');
      } catch (error) {
        console.log('Got issue in fetching job URL', error)
      }
    };
  }

  getJobsName(pipeline, data) {
    let sampleArray = []
    let diff = [];
    let bgColor = [];
    let borderColor = [];
    sampleArray.length = 0;
    diff.length = 0;
    bgColor.length = 0;
    borderColor.length = 0;
    pipeline.jobs.forEach(job => {
      sampleArray.push(this.genJobName(job.name));
      var startedAt = moment(job.started_at, 'YYYY-M-DD,HH:mm:ss');
      var finishedAt = moment(job.finished_at, 'YYYY-M-DD,HH:mm:ss');
      var difference = moment.duration((finishedAt.diff(startedAt, 'second')), "second").asMinutes();
      diff.push(difference.toFixed(2));
      let color;
      if (job.status == "success") {
        color = "138,177,255";
      }
      else if (job.status == "failed") {
        color = "255,184,189";
      }
      else if (job.status == "skipped") {
        color = "169,169,169";
      } else {
        color = "35,36,35"
      }
      //  Gradient colour for bar graph
      var ctx = <HTMLCanvasElement>document.getElementById('myChart');
      var ctxx = ctx.getContext("2d");
      var gradientFill = ctxx.createLinearGradient(0, 297, 24, 0);
      gradientFill.addColorStop(0, `rgba(${color},0.3)`);
      gradientFill.addColorStop(1, `rgba(${color},1)`);
      bgColor.push(gradientFill);
      borderColor.push(gradientFill)

    });
    if (data == 'labels') {
      return sampleArray
    } else if (data == 'data') {
      return diff
    } else if (data == 'bgcolor') {
      return bgColor
    } else if (data == 'bordercolor') {
      return borderColor
    } else 'N/A'
  }
  genJobName(name) {
    return name;
  }
}
