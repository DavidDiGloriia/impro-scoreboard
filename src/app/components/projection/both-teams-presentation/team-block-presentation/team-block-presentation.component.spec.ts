import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamBlockPresentationComponent } from './team-block-presentation.component';

describe('TeamBlockPresentationComponent', () => {
  let component: TeamBlockPresentationComponent;
  let fixture: ComponentFixture<TeamBlockPresentationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeamBlockPresentationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeamBlockPresentationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
