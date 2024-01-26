import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingScheduleRequestsComponent } from './pending-schedule-requests.component';

describe('PendingScheduleRequestsComponent', () => {
  let component: PendingScheduleRequestsComponent;
  let fixture: ComponentFixture<PendingScheduleRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PendingScheduleRequestsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PendingScheduleRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
