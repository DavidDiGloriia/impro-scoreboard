import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScoreboardTeamComponent } from './scoreboard-team.component';

describe('ScoreboardTeamComponent', () => {
  let component: ScoreboardTeamComponent;
  let fixture: ComponentFixture<ScoreboardTeamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScoreboardTeamComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScoreboardTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
