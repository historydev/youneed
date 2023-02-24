import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CallNotificationComponent } from './call-notification.component';

describe('CallNotificationComponent', () => {
  let component: CallNotificationComponent;
  let fixture: ComponentFixture<CallNotificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CallNotificationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CallNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
