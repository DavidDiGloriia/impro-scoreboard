import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BothTeamsPresentationComponent } from './both-teams-presentation.component';

describe('BothTeamsPresentationComponent', () => {
  let component: BothTeamsPresentationComponent;
  let fixture: ComponentFixture<BothTeamsPresentationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BothTeamsPresentationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BothTeamsPresentationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
