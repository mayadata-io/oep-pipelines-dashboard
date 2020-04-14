import { BrowserModule, Meta, Title } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { RouterModule, RouterLinkActive } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { Routing } from './app.routing';

import { AgileService } from './services/agile.services';
import { PipelineDetailService } from './pipeline-detail.service';
import { GithubUrlService } from './services/urlService.service';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { TableComponent } from './table/table.component';
import { ChartComponent } from './components/chart/chart.component';
import { BannerComponent } from './components/banner/banner.component';
import { OverviewComponent } from './overview/overview.component';
import { LoddingSpinnersComponent } from './components/lodding-spinners/lodding-spinners.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { DetailPipelineComponent } from './detail-pipeline/detail-pipeline.component';
import { CookieService } from 'ngx-cookie-service';
import { PipelineDashboardComponent } from './pipeline-dashboard/pipeline-dashboard.component';
import { FooterComponent } from './footer/footer.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PipelineDetailComponent } from './pipeline-detail/pipeline-detail.component';
import {
  MatButtonModule,
  MatFormFieldModule,
  MatRippleModule,
  MatToolbarModule, 
  MatSidenavModule,
  MatListModule ,
  MatIconModule,
  MatInputModule,
  MatStepperModule,
} from '@angular/material';
import { ChartsModule } from 'ng2-charts';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    TableComponent,
    ChartComponent,
    BannerComponent,
    OverviewComponent,
    LoddingSpinnersComponent,
    SidenavComponent,
    DetailPipelineComponent,
    PipelineDashboardComponent,
    FooterComponent,
    PipelineDetailComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    Routing,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatStepperModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatRippleModule,
    MatToolbarModule, 
    MatSidenavModule,
    MatListModule ,
    ChartsModule,
    ],
  providers: [
    HttpClient,
    Meta,
    Title,
    AgileService,
    PipelineDetailService,
    GithubUrlService,
    CookieService
  ],
  bootstrap: [AppComponent],
  exports: [RouterModule, RouterLinkActive,
    MatInputModule,]
})
export class AppModule { }
