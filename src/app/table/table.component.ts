import { Component, OnInit, Pipe } from '@angular/core';
import { Subscription, Observable, timer, from } from "rxjs";
import { Chart } from 'chart.js'
import * as moment from 'moment';
import * as dateformat from 'dateformat';
import * as $ from 'jquery';
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { Meta, Title } from '@angular/platform-browser';
import { PipelineDetailService } from '../pipeline-detail.service';

const PIPELINE_MAP = {
  openshift: 0,
  gcp: 1,
  aws: 2
};

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {
  id: any;
  host: any;
  items = [];
  itemsrc2 = [];
  itemsrc3 = [];
  restItems: any;
  det: string = "detail-Pannel";
  restItemsrc2: any;
  restItemsrc3: any;
  restItemsRelease: any;
  initialCount = 0;
  isHideShow: boolean = true;
  public showSpinnerTable: boolean = true;
  public showSpinnerDetails: boolean = true;
  public name: any;
  public image: any;
  public gitlabPipelineUrl: any;
  public log_url: any;
  public totalJobs: any;
  public executedJobs: any;
  public passedJobs: any;
  public failedJobs: any;
  public commitMessage: any;
  public commitUser: any;
  public baseline: any;
  public litmus: any;
  public rating: any;
  public pullRequest: any;
  public status: any;
  public clusterSetupStatus: any;
  public providerInfraSetup: any;
  public statefulAppDeploy: any;
  public appFunctionTest: any;
  public appChaosTest: any;
  public clusterCleanup: any;
  public appDeprovision: any;
  public kubernetesVersion: any;


  toggleHideShow() {
    this.isHideShow = !this.isHideShow;
  }
  constructor(private http: HttpClient, private meta: Meta, private titleService: Title, private pipelineDetailService: PipelineDetailService) {
    this.meta.addTag({ name: 'description', content: 'Mdapci is the CI and E2E portal for OpenEBS github PRs. Using this portal, OpenEBS community uses this portal to find the build quality against each PR that is merged.' });
    this.meta.addTag({ name: 'keywords', content: 'Mdap,e2e' });
    this.titleService.setTitle("CI/E2E dashboard for Mdapci");
  }

  ngOnInit() {
    this.id = timer(0, 5000).subscribe(x => {
      this.pipelineDetailService.getPipelinesData('OpenEBS-base').then(res => {
        this.restItemsrc3 = res.dashboard.filter(data => data.status !== "skipped").filter((arr, index, self) =>
        index === self.findIndex((t) => (t.id === arr.id)));
        this.showSpinnerTable = false;
        this.showSpinnerDetails = false;
      })
      this.pipelineDetailService.getPipelinesData('build').then(res => {
        this.restItemsrc2 = res.dashboard.filter(data => data.status !== "skipped").reverse().filter((arr, index, self) =>
        index === self.findIndex((t) => (t.openshift_pid === arr.openshift_pid))).reverse()
        this.showSpinnerTable = false;
        this.showSpinnerDetails = false;
      })
      this.pipelineDetailService.getPipelinesData('release-branch').then(res => {
        this.restItemsRelease = res.dashboard.filter(data => data.status !== "skipped");
        this.showSpinnerTable = false;
        this.showSpinnerDetails = false;
      })
      this.pipelineDetailService.getPipelinesData('allApps').then(res => {
        this.restItems = res;
        this.showSpinnerTable = false;
        this.showSpinnerDetails = false;
      })
    });
  }

  rowCount() {
    var rowValue = localStorage.getItem('row');
    if (rowValue == null) {
      rowValue = (this.initialCount).toString();
    }
    return rowValue;
  }
  ngOnDestroy() {
    if (this.id) {
      clearInterval(this.id);
    }
  }

  // getCommitName returns commit name
  getCommitName(index, commits) {
    try {
      return commits[index].name;
    } catch (e) {
      return "n/a";
    }
  }

  //Get master build count
  masterBuildsCount(data) {
    var buildCount = 0;
    for (var i = 0; i < data.length; i++) {
      if (data[i].jobs != undefined) {
        var now = moment(dateformat((new Date()), "UTC:yyyy-mm-dd'T'HH:MM:ss"), 'YYYY-M-DD,HH:mm:ss');
        var buildTime = moment(data[i].jobs[0].created_at, 'YYYY-M-DD,HH:mm:ss');
        var difference = moment.duration((now.diff(buildTime, 'second')), "second").days();
        if (difference < 7) {
          buildCount++;
        }
      }
    }
    return buildCount;
  }

  // getCommit returns commit id
  getCommit(index, commits) {
    try {
      if (commits[index].sha) {
        var test = (commits[index].sha)
        return test;
      } else {
        return "n/a";
      }
    } catch (e) {
      return "n/a";
    }
  }

  // getCommit returns commit url
  commitUrl(index, commits) {
    try {
      if (commits[index].commit_url) {
        return commits[index].commit_url;
      } else {
        return "#";
      }
    } catch (e) {
      return "#";
    }
  }

  // Updated returns commit id
  updated(index, data) {
    try {
      var now = moment(dateformat((new Date()), "UTC:yyyy-mm-dd'T'HH:MM:ss"), 'YYYY-M-DD,HH:mm:ss');
      var buildTime = moment(data[index].jobs[0].created_at, 'YYYY-M-DD,HH:mm:ss');
      var difference = moment.duration((now.diff(buildTime, 'second')), "second");
      var days = difference.days();
      var hours = difference.hours();
      var minutes = difference.hours();
      if (days != 0) {
        return days + "d " + hours + "h" + " ago";
      }
      return hours + "h " + minutes + "m" + " ago";
    } catch (e) {
      return "_";
    }
  }
  iconClass(status) {
    if (status == "success") return "fa fa-check-circle";
    else if (status == "canceled") return "fa fa-ban";
    else if (status == "pending") return "fa fa-clock-o";
    else if (status == "failed") return "fa fa-exclamation-triangle";
    else if (status == "running") return "fa fa-circle-o-notch fa-spin";
  }

  buttonStatusClass(status) {
    if (status == "success") return "btn btn-txt btn-outline-success";
    else if (status == "pending")
      return "btn btn-txt btn-outline-warning";
    else if (status == "canceled")
      return "btn btn-txt btn-outline-secondary";
    else if (status == "failed")
      return "btn btn-txt btn-outline-danger";
    else if (status == "running")
      return "btn btn-txt btn-outline-primary";
    else if (status == "n/a")
      return "btn btn-txt btn-outline-secondary";
  }

  buildTooltip(index, build) {
    try {
      if (build[index].status == "success") {
        var sort_id = (build[index].sha).slice(0, 8)
        if (build[index].project == "maya") {
          var name = "m-apiserver"
        }
        if (build[index].project == "jiva") {
          var name = "jiva"
        }
        if (build[index].project == "cStor") {
          var name = "cstor-pool"
        }
        if (build[index].project == "istgt") {
          var name = "cstor-istgt"
        }
        return "Docker Image:-" + name + ":" + sort_id
      } else if (build[index].status == "failed") {
        return "Build failed";
      }
    } catch (e) {
      return "n/a"
    }
  }

  pipelineTooltip(index, data) {
    try {
      if (data[index].status == "running") {
        return "running"
      } else if (data[index].status == "none") {
        return ""
      } else if (data[index].status == "canceled") {
        return "canceled"
      } else {
        var passedJobs = this.passed(data[index].jobs)
        var failedJobs = this.failed(data[index].jobs)
        return "Passed: " + passedJobs + " Failed: " + failedJobs;
      }
    } catch (e) {
      return "n/a"
    }
  }

  // This function extracts the Run status in GCP pipeline using current index
  buildStatus(index, buildItems) {
    try {
      return buildItems[index].status;
    } catch (e) {
      return "n/a";
    }
  }
  buildWeburl(index, buildItems) {
    try {
      if (buildItems[index].web_url) {
        var generatedURL = buildItems[index].web_url.replace("openebs.ci", "mayaonline.io");
        return generatedURL;
      } else {
        return "#";
      }
    } catch (e) {
      return "#";
    }
  }

  getJobPercentFromPipeline(i, dashboard, pipe) {
    try {
      // if(dashboard.build[i].status == "success") {
      var pipeline = dashboard.pipelines[pipe];
      if (pipeline[i].status == "success") {
        return "95 5";
      }
      else if (pipeline[i].status == "canceled") {
        return "0 0";
      }
      else if (pipeline[i].status == "pending") {
        return "0 0";
      }
      else if (pipeline[i].status == "failed") {
        var count = 0;
        for (var j = 0; j < pipeline[i].jobs.length; j++) {
          if (pipeline[i].jobs[j].status == "success") {
            count++;
          }
        }
        var percentage = (count / pipeline[i].jobs.length) * 100;
        return `${percentage} ${100 - percentage}`
      }
      else if (pipeline[i].status == "running") {
        return "95 5";
      }
    }
    catch {
      return "0 0";
    }
  }
  getJobPercentForGoPipeline(i, dashboard, pipe) {
    try {
      // if(dashboard.build[i].status == "success") {
      var pipeline = dashboard;
      if (pipeline[i].status == "success") {
        return "95 5";
      }
      else if (pipeline[i].status == "canceled") {
        return "0 0";
      }
      else if (pipeline[i].status == "pending") {
        return "0 0";
      }
      else if (pipeline[i].status == "failed") {
        var count = 0;
        for (var j = 0; j < pipeline[i].jobs.length; j++) {
          if (pipeline[i].jobs[j].status == "success") {
            count++;
          }
        }
        var percentage = (count / pipeline[i].jobs.length) * 100;
        return `${percentage} ${100 - percentage}`
      }
      else if (pipeline[i].status == "running") {
        return "95 5";
      }
    }
    catch {
      return "0 0";
    }
  }

  gitlabStageBuildClass(status) {
    if (status === "Success") {
      return "gitlab_stage_build_success";
    }
    else if (status === "CANCELED" || status === "Skipped") {
      return "gitlab_stage_build_skipped";
    }
    else if (status === "Pending") {
      return "gitlab_stage_build_pending";
    }
    else if (status === "Running") {
      return "gitlab_stage_build_running";
    }
    else if (status === "Failed") {
      return "gitlab_stage_build_failed";
    }
  }

  clickit(url) {
    window.open(url, "_blank");
  }

  detailPannel(cloud, index, data) {
    this.showSpinnerDetails = true;
    setTimeout(() => {
      this.showSpinnerDetails = false;
    }, 500);
    if (cloud == 'openshift') {
      this.image = 'openshift.png'
      this.name = cloud;
      this.kubernetesVersion = "1.10.0";
      if (data != undefined) {
        if (data.build[index].jobs != undefined && data['pipelines'][0][index].jobs != undefined) {
          var pipelineData = data['pipelines'][0]
          this.status = 4;
          this.detailsDatas(index, pipelineData, data)
        }
      }
    }
    else if (cloud == 'GCP') {
      this.image = 'gcp.svg'
      this.name = cloud;
      this.kubernetesVersion = "1.11.1";
      if (data != undefined) {
        if (data.build[index].jobs != undefined && data['pipelines'][1][index].jobs != undefined) {
          var pipelineData = data['pipelines'][1]
          this.status = 5;
          this.detailsDatas(index, pipelineData, data)
        }
      }
    }

    else if (cloud == 'AWS') {
      this.image = 'aws.svg'
      this.name = cloud;
      this.kubernetesVersion = "1.10.0";
      if (data != undefined) {
        if (data.build[index].jobs != undefined && data['pipelines'][2][index].jobs != undefined) {
          var pipelineData = data['pipelines'][2]
          this.status = 6;
          this.detailsDatas(index, pipelineData, data)
        }
      }
    }
  }

  detailsDatas(index, pipelineData, data) {
    this.commitMessage = this.commitMess(data.build[index].jobs[0].commit)
    this.pullRequest = data.build[index].commit_url
    this.commitUser = this.commitUsr(data.build[index].jobs[0].commit)
    this.rating = this.ratingCalculation(pipelineData[index].jobs)
    this.gitlabPipelineUrl = this.gitlabpipeURL(pipelineData[index].web_url)
    this.log_url = pipelineData[index].log_link;
    this.totalJobs = pipelineData[index].jobs.length;
    this.executedJobs = this.executed(pipelineData[index].jobs)
    this.passedJobs = this.passed(pipelineData[index].jobs)
    this.failedJobs = this.failed(pipelineData[index].jobs)
    this.clusterSetupStatus = this.getClusterSetupStatus(pipelineData[index].jobs)
    this.providerInfraSetup = this.getProviderInfraSetupStatus(pipelineData[index].jobs)
    this.statefulAppDeploy = this.getStatefulAppDeployStatus(pipelineData[index].jobs)
    this.appFunctionTest = this.getAppFunctionTestStatus(pipelineData[index].jobs)
    this.appChaosTest = this.getAppChaosTestStatus(pipelineData[index].jobs)
    this.appDeprovision = this.getAppDeprovisionStatus(pipelineData[index].jobs)
    this.clusterCleanup = this.getClusterCleanupStatus(pipelineData[index].jobs)
  }
  gitlabpipeURL(url) {
    return url.replace("openebs.ci", "mayaonline.io");
  }

  ratingCalculation(data) {
    var executed = this.executed(data);
    var passed = this.passed(data);
    var rating = ((passed / executed) * 100);
    return rating + "%"
  }

  executed(data) {
    var executed = 0;
    for (var i = 0; i < data.length; i++) {
      if (data[i].status == "success" || data[i].status == "failed") {
        executed = executed + 1;
      }
    }
    return executed;
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

  commitUsr(data) {
    var commitId = data.short_id;
    var username = data.author_name;
    return commitId + '  @' + username;
  }

  commitMess(data) {
    var message = data.message;
    return message;
  }

  getClusterSetupStatus(data) {
    var statusObj = {
      status: "",
      successJobCount: 0,
      failedJobCount: 0,
      skippedJobCount: 0,
      jobCount: 0
    }
    for (var i = 0; i < data.length; i++) {
      if (data[i].stage == "CLUSTER-SETUP") {
        statusObj.jobCount++;
      }
    }
    for (var i = 0; i < data.length; i++) {
      if (data[i].stage == "CLUSTER-SETUP" && data[i].status == "running") {
        statusObj.status = "Running"
      }
    }
    for (var i = 0; i < data.length; i++) {
      if (data[i].stage == "CLUSTER-SETUP" && data[i].status == "failed") {
        statusObj.failedJobCount++;
      }
    }
    for (var i = 0; i < data.length; i++) {
      if (data[i].stage == "CLUSTER-SETUP" && data[i].status == "skipped") {
        statusObj.skippedJobCount++;
      }
    }
    for (var i = 0; i < data.length; i++) {
      if (data[i].stage == "CLUSTER-SETUP" && data[i].status == "canceled") {
        statusObj.status = "CANCELLED"
      }
    }
    for (var i = 0; i < data.length; i++) {
      if (data[i].stage == "CLUSTER-SETUP") {
        if (data[i].status == "created" || data[i].status == "pending") {
          statusObj.status = "Pending"
        }
      }
    }
    for (var i = 0; i < data.length; i++) {
      if (data[i].stage == "CLUSTER-SETUP" && data[i].status == "success") {
        statusObj.successJobCount++;
      }

    }
    if (statusObj.successJobCount == statusObj.jobCount) {
      statusObj.status = "Success"
    } else if (statusObj.skippedJobCount == statusObj.jobCount) {
      statusObj.status = "Skipped"
    } else if (statusObj.failedJobCount > 0) {
      statusObj.status = "Failed"
    }
    return statusObj;
  }

  getProviderInfraSetupStatus(data) {
    var statusObj = {
      status: "",
      successJobCount: 0,
      failedJobCount: 0,
      skippedJobCount: 0,
      jobCount: 0
    }
    for (var i = 0; i < data.length; i++) {
      if (data[i].stage == "PROVIDER-INFRA-SETUP") {
        statusObj.jobCount++;
      }
    }
    for (var i = 0; i < data.length; i++) {
      if (data[i].stage == "PROVIDER-INFRA-SETUP" && data[i].status == "running") {
        statusObj.status = "Running"
      }
    }
    for (var i = 0; i < data.length; i++) {
      if (data[i].stage == "PROVIDER-INFRA-SETUP" && data[i].status == "failed") {
        statusObj.failedJobCount++;
      }
    }
    for (var i = 0; i < data.length; i++) {
      if (data[i].stage == "PROVIDER-INFRA-SETUP" && data[i].status == "skipped") {
        statusObj.skippedJobCount++;
      }
    }
    for (var i = 0; i < data.length; i++) {
      if (data[i].stage == "PROVIDER-INFRA-SETUP" && data[i].status == "canceled") {
        statusObj.status = "CANCELLED"
      }
    }
    for (var i = 0; i < data.length; i++) {
      if (data[i].stage == "PROVIDER-INFRA-SETUP") {
        if (data[i].status == "created" || data[i].status == "pending") {
          statusObj.status = "Pending"
        }
      }
    }
    for (var i = 0; i < data.length; i++) {
      if (data[i].stage == "PROVIDER-INFRA-SETUP" && data[i].status == "success") {
        statusObj.successJobCount++;
      }
    }

    if (statusObj.successJobCount == statusObj.jobCount) {
      statusObj.status = "Success"
    } else if (statusObj.skippedJobCount == statusObj.jobCount) {
      statusObj.status = "Skipped"
    } else if (statusObj.failedJobCount > 0) {
      statusObj.status = "Failed"
    }

    return statusObj;
  }

  getStatefulAppDeployStatus(data) {
    var statusObj = {
      status: "",
      successJobCount: 0,
      failedJobCount: 0,
      skippedJobCount: 0,
      jobCount: 0
    }
    for (var i = 0; i < data.length; i++) {
      if (data[i].stage == "STATEFUL-APP-DEPLOY") {
        statusObj.jobCount++;
      }
    }
    for (var i = 0; i < data.length; i++) {
      if (data[i].stage == "STATEFUL-APP-DEPLOY" && data[i].status == "running") {
        statusObj.status = "Running"
      }
    }
    for (var i = 0; i < data.length; i++) {
      if (data[i].stage == "STATEFUL-APP-DEPLOY" && data[i].status == "failed") {
        statusObj.failedJobCount++;
      }
    }
    for (var i = 0; i < data.length; i++) {
      if (data[i].stage == "STATEFUL-APP-DEPLOY" && data[i].status == "skipped") {
        statusObj.skippedJobCount++;
      }
    }
    for (var i = 0; i < data.length; i++) {
      if (data[i].stage == "STATEFUL-APP-DEPLOY" && data[i].status == "canceled") {
        statusObj.status = "CANCELLED"
      }
    }
    for (var i = 0; i < data.length; i++) {
      if (data[i].stage == "STATEFUL-APP-DEPLOY") {
        if (data[i].status == "created" || data[i].status == "pending") {
          statusObj.status = "Pending"
        }
      }
    }

    for (var i = 0; i < data.length; i++) {
      if (data[i].stage == "STATEFUL-APP-DEPLOY" && data[i].status == "success") {
        statusObj.successJobCount++;
      }
    }

    if (statusObj.successJobCount == statusObj.jobCount) {
      statusObj.status = "Success"
    } else if (statusObj.skippedJobCount == statusObj.jobCount) {
      statusObj.status = "Skipped"
    } else if (statusObj.failedJobCount > 0) {
      statusObj.status = "Failed"
    }
    return statusObj;
  }

  getAppFunctionTestStatus(data) {
    var statusObj = {
      status: "",
      successJobCount: 0,
      failedJobCount: 0,
      skippedJobCount: 0,
      jobCount: 0
    }
    for (var i = 0; i < data.length; i++) {
      if (data[i].stage == "APP-FUNC-TEST") {
        statusObj.jobCount++;
      }
    }
    for (var i = 0; i < data.length; i++) {
      if (data[i].stage == "APP-FUNC-TEST" && data[i].status == "running") {
        statusObj.status = "Running"
      }
    }
    for (var i = 0; i < data.length; i++) {
      if (data[i].stage == "APP-FUNC-TEST" && data[i].status == "failed") {
        statusObj.failedJobCount++;
      }
    }
    for (var i = 0; i < data.length; i++) {
      if (data[i].stage == "APP-FUNC-TEST" && data[i].status == "skipped") {
        statusObj.skippedJobCount++;
      }
    }
    for (var i = 0; i < data.length; i++) {
      if (data[i].stage == "APP-FUNC-TEST" && data[i].status == "canceled") {
        statusObj.status = "CANCELLED"
      }
    }
    for (var i = 0; i < data.length; i++) {
      if (data[i].stage == "APP-FUNC-TEST") {
        if (data[i].status == "created" || data[i].status == "pending") {
          statusObj.status = "Pending"
        }
      }
    }
    for (var i = 0; i < data.length; i++) {
      if (data[i].stage == "APP-FUNC-TEST" && data[i].status == "success") {
        statusObj.successJobCount++;
      }
    }

    if (statusObj.successJobCount == statusObj.jobCount) {
      statusObj.status = "Success"
    } else if (statusObj.skippedJobCount == statusObj.jobCount) {
      statusObj.status = "Skipped"
    } else if (statusObj.failedJobCount > 0) {
      statusObj.status = "Failed"
    }
    return statusObj;
  }

  getAppChaosTestStatus(data) {
    var statusObj = {
      status: "",
      successJobCount: 0,
      failedJobCount: 0,
      skippedJobCount: 0,
      jobCount: 0
    }
    for (var i = 0; i < data.length; i++) {
      if (data[i].stage == "APP-CHAOS-TEST") {
        statusObj.jobCount++;
      }
    }
    for (var i = 0; i < data.length; i++) {
      if (data[i].stage == "APP-CHAOS-TEST" && data[i].status == "running") {
        statusObj.status = "Running"
      }
    }
    for (var i = 0; i < data.length; i++) {
      if (data[i].stage == "APP-CHAOS-TEST" && data[i].status == "failed") {
        statusObj.failedJobCount++;
      }
    }
    for (var i = 0; i < data.length; i++) {
      if (data[i].stage == "APP-CHAOS-TEST" && data[i].status == "skipped") {
        statusObj.skippedJobCount++;
      }
    }
    for (var i = 0; i < data.length; i++) {
      if (data[i].stage == "APP-CHAOS-TEST" && data[i].status == "canceled") {
        statusObj.status = "CANCELLED"
      }
    }
    for (var i = 0; i < data.length; i++) {
      if (data[i].stage == "APP-CHAOS-TEST") {
        if (data[i].status == "created" || data[i].status == "pending") {
          statusObj.status = "Pending"
        }
      }
    }

    for (var i = 0; i < data.length; i++) {
      if (data[i].stage == "APP-CHAOS-TEST" && data[i].status == "success") {
        statusObj.successJobCount++;
      }
    }

    if (statusObj.successJobCount == statusObj.jobCount) {
      statusObj.status = "Success"
    } else if (statusObj.skippedJobCount == statusObj.jobCount) {
      statusObj.status = "Skipped"
    } else if (statusObj.failedJobCount > 0) {
      statusObj.status = "Failed"
    }
    return statusObj;
  }

  getAppDeprovisionStatus(data) {
    var statusObj = {
      status: "",
      successJobCount: 0,
      failedJobCount: 0,
      skippedJobCount: 0,
      jobCount: 0
    }
    for (var i = 0; i < data.length; i++) {
      if (data[i].stage == "APP-DEPROVISION") {
        statusObj.jobCount++;
      }
    }
    for (var i = 0; i < data.length; i++) {
      if (data[i].stage == "APP-DEPROVISION" && data[i].status == "running") {
        statusObj.status = "Running"
      }
    }
    for (var i = 0; i < data.length; i++) {
      if (data[i].stage == "APP-DEPROVISION" && data[i].status == "failed") {
        statusObj.failedJobCount++;
      }
    }
    for (var i = 0; i < data.length; i++) {
      if (data[i].stage == "APP-DEPROVISION" && data[i].status == "skipped") {
        statusObj.skippedJobCount++;
      }
    }
    for (var i = 0; i < data.length; i++) {
      if (data[i].stage == "APP-DEPROVISION" && data[i].status == "canceled") {
        statusObj.status = "CANCELLED"
      }
    }
    for (var i = 0; i < data.length; i++) {
      if (data[i].stage == "APP-DEPROVISION") {
        if (data[i].status == "created" || data[i].status == "pending") {
          statusObj.status = "Pending"
        }
      }
    }
    for (var i = 0; i < data.length; i++) {
      if (data[i].stage == "APP-DEPROVISION" && data[i].status == "success") {
        statusObj.successJobCount++;
      }
    }

    if (statusObj.successJobCount == statusObj.jobCount) {
      statusObj.status = "Success"
    } else if (statusObj.skippedJobCount == statusObj.jobCount) {
      statusObj.status = "Skipped"
    } else if (statusObj.failedJobCount > 0) {
      statusObj.status = "Failed"
    }
    return statusObj;
  }

  getClusterCleanupStatus(data) {
    var statusObj = {
      status: "",
      successJobCount: 0,
      failedJobCount: 0,
      skippedJobCount: 0,
      jobCount: 0
    }
    for (var i = 0; i < data.length; i++) {
      if (data[i].stage == "CLUSTER-CLEANUP") {
        statusObj.jobCount++;
      }
    }
    for (var i = 0; i < data.length; i++) {
      if (data[i].stage == "CLUSTER-CLEANUP" && data[i].status == "running") {
        statusObj.status = "Running"
      }
    }
    for (var i = 0; i < data.length; i++) {
      if (data[i].stage == "CLUSTER-CLEANUP" && data[i].status == "failed") {
        statusObj.failedJobCount++;
      }
    }
    for (var i = 0; i < data.length; i++) {
      if (data[i].stage == "CLUSTER-CLEANUP" && data[i].status == "skipped") {
        statusObj.skippedJobCount++;
      }
    }
    for (var i = 0; i < data.length; i++) {
      if (data[i].stage == "CLUSTER-CLEANUP" && data[i].status == "canceled") {
        statusObj.status = "CANCELLED"
      }
    }
    for (var i = 0; i < data.length; i++) {
      if (data[i].stage == "CLUSTER-CLEANUP") {
        if (data[i].status == "created" || data[i].status == "pending") {
          statusObj.status = "Pending"
        }
      }
    }
    for (var i = 0; i < data.length; i++) {
      if (data[i].stage == "CLUSTER-CLEANUP" && data[i].status == "success") {
        statusObj.successJobCount++;
      }
    }

    if (statusObj.successJobCount == statusObj.jobCount) {
      statusObj.status = "Success"
    } else if (statusObj.skippedJobCount == statusObj.jobCount) {
      statusObj.status = "Skipped"
    } else if (statusObj.failedJobCount > 0) {
      statusObj.status = "Failed"
    }
    return statusObj;
  }
  pipelineBranch(branch) {
    if (branch !== 'OpenEBS-base') {
      return 'OpenEBS-base';
    } else {
      return branch;
    }
  }

  // getReleaseName returns release_tag value
  getReleaseName(index, releaseData) {
    try {
      var name = releaseData[index].release_tag
      return name;
    } catch (e) {
      return "NA";
    }
  }
}
function toggle_visibility(id) {
  var e = document.getElementById(id);
  if (e.style.display == 'block')
    e.style.display = 'none';
  else
    e.style.display = 'block';
}