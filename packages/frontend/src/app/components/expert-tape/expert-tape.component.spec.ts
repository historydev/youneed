import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpertTapeComponent } from './expert-tape.component';

describe('ExpertTapeComponent', () => {
  let component: ExpertTapeComponent;
  let fixture: ComponentFixture<ExpertTapeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpertTapeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpertTapeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
