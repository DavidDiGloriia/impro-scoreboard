import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamsParametersComponent } from './teams-parameters.component';

describe('TeamsParametersComponent', () => {
  let component: TeamsParametersComponent;
  let fixture: ComponentFixture<TeamsParametersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeamsParametersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeamsParametersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
