import { Routes, RouterModule } from "@angular/router";

import { TableComponent } from "./table/table.component";
import { OverviewComponent } from "./overview/overview.component";
import { DetailPipelineComponent } from './detail-pipeline/detail-pipeline.component';
import { PipelineDashboardComponent } from './pipeline-dashboard/pipeline-dashboard.component'
import { PipelineDetailComponent } from './pipeline-detail/pipeline-detail.component'

const routes: Routes = [
  //routes with out header and footer
  { path: "", component: PipelineDashboardComponent },
  // { path: "overview", component: OverviewComponent },
  // { path: "detail-pipeline/:app/:id", component: DetailPipelineComponent },
  { path: "pipeline/:project/:id/platform/:platform", component: PipelineDetailComponent}
];

export const Routing = RouterModule.forRoot(routes);
