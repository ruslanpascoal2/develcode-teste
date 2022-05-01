import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';

import { UserFormComponent } from './user-form.component';

describe('UserFormComponent', () => {
  let component: UserFormComponent;
  let fixture: ComponentFixture<UserFormComponent>;

  const validForm = {
    name: 'Ruslan',
    birthDate: '2000-01-01',
    cod: 'abc',
  };

  const invalidForm = {
    name: '',
    birthDate: '2000-01-01',
    cod: 'abc',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserFormComponent],
      imports: [RouterTestingModule, HttpClientTestingModule],
      providers: [{ provide: MatSnackBar, useValue: null }, FormBuilder],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should validate form', () => {
    component.form.setValue(validForm);
    expect(component.form.valid).toBeTrue();

    component.form.setValue(invalidForm);
    expect(component.form.valid).toBeFalse();
  });

  it('should edit user when id is provided', () => {
    component.idUser = '0';
    component.form.setValue(validForm);

    const spyCreate = spyOn(component, 'createUser');
    const spyPatch = spyOn(component, 'patchUser');

    component.handleSubmit();

    expect(spyCreate).toHaveBeenCalledTimes(0);
    expect(spyPatch).toHaveBeenCalled();
  });

  it('should create user when id is NOT provided', () => {
    component.idUser = '';
    component.form.setValue(validForm);
    const spyCreate = spyOn(component, 'createUser');
    const spyPatch = spyOn(component, 'patchUser');

    component.handleSubmit();

    expect(spyPatch).toHaveBeenCalledTimes(0);
    expect(spyCreate).toHaveBeenCalled();
  });

  it('should create or edit user only when form is valid', () => {
    component.form.setValue(invalidForm);

    const spyCreate = spyOn(component, 'createUser');
    const spyPatch = spyOn(component, 'patchUser');

    component.handleSubmit();

    expect(spyPatch).toHaveBeenCalledTimes(0);
    expect(spyCreate).toHaveBeenCalledTimes(0);

    component.form.setValue(validForm);

    component.handleSubmit();

    expect(spyCreate).toHaveBeenCalled();
  });
});
