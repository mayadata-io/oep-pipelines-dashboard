import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PipelineDashboardComponent } from './pipeline-dashboard.component';

describe('PipelineDashboardComponent', () => {
  let component: PipelineDashboardComponent;
  let fixture: ComponentFixture<PipelineDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PipelineDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PipelineDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
