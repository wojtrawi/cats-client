import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CatsPageComponent } from './cats-page.component';

describe('CatsPageComponent', () => {
  let component: CatsPageComponent;
  let fixture: ComponentFixture<CatsPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CatsPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CatsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
