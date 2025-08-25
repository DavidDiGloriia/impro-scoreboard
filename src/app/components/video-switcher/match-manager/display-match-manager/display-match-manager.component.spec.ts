import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayMatchManagerComponent } from './display-match-manager.component';

describe('DisplayMatchManagerComponent', () => {
  let component: DisplayMatchManagerComponent;
  let fixture: ComponentFixture<DisplayMatchManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisplayMatchManagerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisplayMatchManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
