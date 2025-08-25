import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoWatcherComponent } from './video-watcher.component';

describe('VideoWatcherComponent', () => {
  let component: VideoWatcherComponent;
  let fixture: ComponentFixture<VideoWatcherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VideoWatcherComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VideoWatcherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
