import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LazyFeatureThreeComponent } from './lazy-feature-three.component';

describe('LazyFeatureThreeComponent', () => {
  let component: LazyFeatureThreeComponent;
  let fixture: ComponentFixture<LazyFeatureThreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LazyFeatureThreeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LazyFeatureThreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
