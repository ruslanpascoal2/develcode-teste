import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { UserListComponent } from './user-list.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { By } from '@angular/platform-browser';
import { of, tap } from 'rxjs';

describe('UserListComponent', () => {
  let component: UserListComponent;
  let fixture: ComponentFixture<UserListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserListComponent],
      imports: [MatDialogModule, HttpClientTestingModule],
      providers: [{ provide: MatSnackBar, useValue: null }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display empty message when user list is empty', () => {
    component.users$ = of([]);
    component.userState$.next([]);
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.empty-card'))).toBeTruthy();
    
    component.users$ = of([
      { name: 'Ruslan', birthDate: '2000-01-01', cod: 'abc' },
    ]).pipe(
      tap(() =>
      component.userState$.next([
        { name: 'Ruslan', birthDate: '2000-01-01', cod: 'abc' },
      ])
      )
      );
      
      fixture.detectChanges();
      
      expect(fixture.debugElement.query(By.css('.empty-card'))).toBeNull();
  });

});
