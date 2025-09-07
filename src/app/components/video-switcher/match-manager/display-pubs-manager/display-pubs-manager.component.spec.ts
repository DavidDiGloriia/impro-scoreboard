import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayPubsManagerComponent } from './display-pubs-manager.component';

describe('DisplayVideoManagerComponent', () => {
  let component: DisplayPubsManagerComponent;
  let fixture: ComponentFixture<DisplayPubsManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisplayPubsManagerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisplayPubsManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
