import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {

  columns: string[] = ['cod', 'name', 'birthDate', 'actions'];
  
  dataSource: User[] = [
    {
      birthDate: '25/05/1993',
      name: "Ruslan",
      cod: '1'
    }
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
