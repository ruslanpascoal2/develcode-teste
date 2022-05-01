import {
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  BehaviorSubject,
  delay,
  finalize,
  Observable,
  of,
  Subject,
  take,
  takeUntil,
  tap,
} from 'rxjs';
import {
  DialogComponent,
  DialogData,
} from 'src/app/shared/dialog/dialog.component';
import { SnackbarService } from 'src/app/shared/snackbar/snackbar.service';
import { User } from '../../models/user.model';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  providers: [SnackbarService],
})
export class UserListComponent implements OnInit, OnDestroy {
  columns: string[] = ['cod', 'name', 'birthDate', 'actions'];

  @ViewChild('deleteDialogTemplate', { read: TemplateRef }) dialogTemplate: any;
  @ViewChild('deleteDialogActions', { read: TemplateRef }) dialogActions: any;

  loading: boolean = false;
  destroy$: Subject<any> = new Subject();
  users$: Observable<User[]> = of([]);
  userState$: BehaviorSubject<User[]> = new BehaviorSubject<User[]>([]);

  constructor(
    public dialog: MatDialog,
    private usersService: UsersService,
    private snackbar: SnackbarService
  ) {}

  ngOnInit(): void {
    this.getUsers();
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  getUsers() {
    this.loading = true;
    this.users$ = this.usersService.getUsers().pipe(
      delay(1000),
      takeUntil(this.destroy$),
      tap((users: User[]) => {
        this.userState$.next(users);
      }),
      finalize(() => (this.loading = false))
    );
  }

  openDeleteDialog(user: User): void {
    const data: DialogData = {
      template: this.dialogTemplate,
      actions: this.dialogActions,
      title: 'Deseja excluir o usuário?',
    };

    const dialogRef = this.dialog.open(DialogComponent, {
      width: '300px',
      data,
    });

    dialogRef.afterClosed().subscribe((result) => {
      result && this.deleteUser(user);
    });
  }

  deleteUser(user: User) {
    this.usersService
      .deleteUser(user)
      .pipe(
        take(1),
        finalize(() => (this.loading = false))
      )
      .subscribe({
        next: () => {
          const prevState = this.userState$.getValue();
          const newState = [...prevState.filter((u) => u.id !== user.id)];
          this.userState$.next(newState);
          this.snackbar.openSnackBar({
            message: 'Usuário excluído',
            type: 'success',
          });
        },
        error: (err) => console.error(err),
      });
  }
}
