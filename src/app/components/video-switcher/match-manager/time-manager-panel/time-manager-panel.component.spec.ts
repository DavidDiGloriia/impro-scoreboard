import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeManagerPanelComponent } from './time-manager-panel.component';

describe('TimeManagerPanelComponent', () => {
  let component: TimeManagerPanelComponent;
  let fixture: ComponentFixture<TimeManagerPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimeManagerPanelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TimeManagerPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
