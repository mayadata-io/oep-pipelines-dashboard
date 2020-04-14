import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailPipelineComponent } from './detail-pipeline.component';

describe('DetailPipelineComponent', () => {
  let component: DetailPipelineComponent;
  let fixture: ComponentFixture<DetailPipelineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailPipelineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailPipelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
