import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayAnthemManagerComponent } from './display-anthem-manager.component';

describe('AnthemManagerComponent', () => {
  let component: DisplayAnthemManagerComponent;
  let fixture: ComponentFixture<DisplayAnthemManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisplayAnthemManagerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisplayAnthemManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
