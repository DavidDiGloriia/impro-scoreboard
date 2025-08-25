import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayVideoManagerComponent } from './display-video-manager.component';

describe('DisplayVideoManagerComponent', () => {
  let component: DisplayVideoManagerComponent;
  let fixture: ComponentFixture<DisplayVideoManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisplayVideoManagerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisplayVideoManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
