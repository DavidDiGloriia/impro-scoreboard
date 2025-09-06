import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayMediaManagerComponent } from './display-media-manager.component';

describe('DisplayVideoManagerComponent', () => {
  let component: DisplayMediaManagerComponent;
  let fixture: ComponentFixture<DisplayMediaManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisplayMediaManagerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisplayMediaManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
