import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LazyFeatureTwoComponent } from './lazy-feature-two.component';

describe('LazyFeatureTwoComponent', () => {
  let component: LazyFeatureTwoComponent;
  let fixture: ComponentFixture<LazyFeatureTwoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LazyFeatureTwoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LazyFeatureTwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
