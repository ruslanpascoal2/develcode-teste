import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { delay, finalize, take } from 'rxjs';
import { SnackbarService } from 'src/app/shared/snackbar/snackbar.service';
import { dateValidator } from 'src/app/shared/utils/dateValidator';
import { User } from '../../models/user.model';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
  providers: [SnackbarService],
})
export class UserFormComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  loading: boolean = false;
  idUser: string = '';
  maxDate: Date = new Date();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private usersService: UsersService,
    private fb: FormBuilder,
    private snackbar: SnackbarService
  ) {}

  ngOnInit(): void {
    this.idUser = this.route.snapshot.params['id'] || '';

    this.form = this.fb.group({
      name: ['', Validators.required],
      birthDate: ['', [Validators.required, Validators.maxLength(10), dateValidator()]],
      cod: ['', [Validators.required, Validators.maxLength(5)]],
    });

    if (this.idUser) {
      this.fillData();
    }
  }
  

  fillData() {
    this.usersService.getUser(this.idUser).subscribe((user: User) => {
      this.form.setValue({
        name: user.name,
        cod: user.cod,
        birthDate: user.birthDate,
      });
    });
  }

  patchUser() {
    this.loading = true;
    this.usersService
      .editUser(this.form.value, this.idUser)
      .pipe(take(1), delay(1000), finalize(() => this.loading = false))
      .subscribe({
        next: () => {
          this.snackbar.openSnackBar({
            message: 'Usuário alterado.',
            type: 'success',
          });
          this.router.navigate(['..']);
        },
        error: (e) => console.error(e)
      });
  }

  createUser() {
    this.loading = true;
    this.usersService
      .createUser(this.form.value)
      .pipe(take(1), delay(1000), finalize(() => this.loading = false))
      .subscribe({
        next: () => {
          this.snackbar.openSnackBar({
            message: 'Usuário cadastrado.',
            type: 'success',
          });
          this.router.navigate(['..']);
        },
        error: (e) => console.error(e),
      });
  }

  handleSubmit() {
    if (this.form.valid) {
      if (this.idUser) this.patchUser();
      else this.createUser();
    }
  }
}
