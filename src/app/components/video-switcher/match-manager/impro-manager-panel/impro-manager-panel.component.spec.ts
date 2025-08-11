import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImproManagerPanelComponent } from './impro-manager-panel.component';

describe('ImproManagerPanelComponent', () => {
  let component: ImproManagerPanelComponent;
  let fixture: ComponentFixture<ImproManagerPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImproManagerPanelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImproManagerPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
