import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/entities/user';
import { EntityService } from 'src/app/services/entity.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css'],
})
export class TestComponent implements OnInit {
  user?: User;

  constructor(private service: EntityService<User>) {
    service.table('users');
    service.getById('1').subscribe((user) => (this.user = user));
  }

  ngOnInit(): void {}
}
