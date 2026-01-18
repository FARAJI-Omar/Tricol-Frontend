import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AchatsDashboard } from './achats-dashboard';

describe('AchatsDashboard', () => {
  let component: AchatsDashboard;
  let fixture: ComponentFixture<AchatsDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AchatsDashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AchatsDashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
