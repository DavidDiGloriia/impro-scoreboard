import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectionHandlingComponent } from './projection-handling.component';

describe('ProjectionHandlingComponent', () => {
  let component: ProjectionHandlingComponent;
  let fixture: ComponentFixture<ProjectionHandlingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectionHandlingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectionHandlingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
