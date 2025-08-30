import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayTeamManagerComponent } from './display-team-manager.component';

describe('DisplayTeamManagerComponent', () => {
  let component: DisplayTeamManagerComponent;
  let fixture: ComponentFixture<DisplayTeamManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisplayTeamManagerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisplayTeamManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
