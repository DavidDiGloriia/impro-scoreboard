import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoSwitcherComponent } from './video-switcher.component';

describe('VideoSwitcherComponent', () => {
  let component: VideoSwitcherComponent;
  let fixture: ComponentFixture<VideoSwitcherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VideoSwitcherComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VideoSwitcherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
