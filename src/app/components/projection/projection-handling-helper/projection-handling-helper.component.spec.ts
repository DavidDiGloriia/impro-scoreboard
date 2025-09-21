import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectionHandlingHelperComponent } from './projection-handling-helper.component';

describe('ProjectionHandlingHelperComponent', () => {
  let component: ProjectionHandlingHelperComponent;
  let fixture: ComponentFixture<ProjectionHandlingHelperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectionHandlingHelperComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectionHandlingHelperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
