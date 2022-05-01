import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(private http: HttpClient) {}

  getUser(id: string | number): Observable<User> {
    return this.http.get<User>(`${environment.API}/users/${id}`);
  }
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${environment.API}/users`);
  }
  createUser(user: User): Observable<User[]> {
    return this.http.post<User[]>(`${environment.API}/users`, user);
  }
  editUser(user: User, id: string | number): Observable<User[]> {
    return this.http.patch<User[]>(`${environment.API}/users/${id}`, {...user, id});
  }
  deleteUser(user: User): Observable<void> {
    return this.http.delete<void>(`${environment.API}/users/${user.id}`);
  }
}
