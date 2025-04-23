import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MensajePage } from './mensaje.page';

describe('MensajePage', () => {
  let component: MensajePage;
  let fixture: ComponentFixture<MensajePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MensajePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
