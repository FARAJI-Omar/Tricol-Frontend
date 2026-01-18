import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AtelierDashboard } from './atelier-dashboard';

describe('AtelierDashboard', () => {
  let component: AtelierDashboard;
  let fixture: ComponentFixture<AtelierDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AtelierDashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AtelierDashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
