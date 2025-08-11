import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamManagerPanelComponent } from './team-manager-panel.component';

describe('TeamManagerPanelComponent', () => {
  let component: TeamManagerPanelComponent;
  let fixture: ComponentFixture<TeamManagerPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeamManagerPanelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeamManagerPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
