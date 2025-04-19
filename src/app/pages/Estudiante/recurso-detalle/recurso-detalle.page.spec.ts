import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecursoDetallePage } from './recurso-detalle.page';

describe('RecursoDetallePage', () => {
  let component: RecursoDetallePage;
  let fixture: ComponentFixture<RecursoDetallePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RecursoDetallePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
