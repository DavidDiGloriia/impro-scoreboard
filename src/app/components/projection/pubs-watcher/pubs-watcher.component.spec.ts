import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PubsWatcherComponent } from './pubs-watcher.component';

describe('VideoWatcherComponent', () => {
  let component: PubsWatcherComponent;
  let fixture: ComponentFixture<PubsWatcherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PubsWatcherComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PubsWatcherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
