import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchParametersComponent } from './match-parameters.component';

describe('MatchParametersComponent', () => {
  let component: MatchParametersComponent;
  let fixture: ComponentFixture<MatchParametersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatchParametersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MatchParametersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
