import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MediaWatcherComponent } from './media-watcher.component';

describe('VideoWatcherComponent', () => {
  let component: MediaWatcherComponent;
  let fixture: ComponentFixture<MediaWatcherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MediaWatcherComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MediaWatcherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
