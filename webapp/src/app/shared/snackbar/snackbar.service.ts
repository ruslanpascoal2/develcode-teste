import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent, SnackBarData } from './snackbar.component';

@Injectable()
export class SnackbarService {

  constructor(private snackBar: MatSnackBar) { }

  public openSnackBar({ message, type }: SnackBarData) {
    this.snackBar.openFromComponent(SnackbarComponent, {
      panelClass: ['snackbar', type],
      data: {
        message,
        type,
      },
    });
  }
}
