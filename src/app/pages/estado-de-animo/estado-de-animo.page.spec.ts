import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EstadoDeAnimoPage } from './estado-de-animo.page';

describe('EstadoDeAnimoPage', () => {
  let component: EstadoDeAnimoPage;
  let fixture: ComponentFixture<EstadoDeAnimoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EstadoDeAnimoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
