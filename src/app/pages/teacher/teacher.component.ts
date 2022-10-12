import { Component, OnInit } from '@angular/core';
import { Teacher } from 'src/app/entities/teacher';
import { Notification } from 'src/app/entities/notification';
import { EntityService } from 'src/app/services/entity.service';

@Component({
  selector: 'app-teacher',
  templateUrl: './teacher.component.html',
  styleUrls: ['./teacher.component.css'],
})
export class TeacherComponent implements OnInit {
  id: string = '';
  name: string = '';
  rating: string = '';
  salary: string = '';
  image: string = '';
  teachers: Teacher[] = [];
  mode: 'new' | 'selected' | 'edit' | 'delete' = 'new';
  notification?: Notification;

  constructor(private service: EntityService<Teacher>) {
    service.table('teachers');
    this.get();
  }

  get() {
    this.service.get().subscribe((teachers) => (this.teachers = teachers));
  }

  load(teacher: Teacher) {
    this.clear();
    this.id = teacher.id;
    this.name = teacher.name;
    this.salary = teacher.salary.toString();
    this.rating = teacher.rating.toString();
    this.mode = 'selected';
    this.image = 'https://joeschmoe.io/api/v1/random';
  }

  clear() {
    this.id = '';
    this.name = '';
    this.rating = '';
    this.salary = '';
    this.mode = 'new';
    this.image = '';
    this.notification = undefined;
  }

  close() {
    if (this.mode === 'selected') {
      return this.clear();
    }
    this.mode = 'selected';
    this.notification = undefined;
    const [teacher] = this.teachers.filter((teacher) => teacher.id == this.id);
    this.load(teacher);
  }

  validation() {
    if (!this.name) {
      this.notification = {
        type: 'warning',
        title: 'Campo Obrigátorio',
        message: 'O campo "Nome" é obrigátorio',
      };
      return false;
    }
    if (!this.salary) {
      this.notification = {
        type: 'warning',
        title: 'Campo Obrigátorio',
        message: 'O campo "Salário" é obrigátorio',
      };
      return false;
    }

    if (!this.rating) {
      this.notification = {
        type: 'warning',
        title: 'Campo Obrigátorio',
        message: 'O campo "Avaliação" é obrigátorio',
      };
      return false;
    }
    return true;
  }

  createEntity() {
    const id = this.mode === 'new' ? '1' : this.id;
    const { name, salary, rating } = this;

    return new Teacher(id, name, Number(salary), Number(rating), []);
  }

  save() {
    if (!this.validation()) return;

    const teacher = this.createEntity();

    if (this.mode === 'new')
      this.service.post(teacher).subscribe((result) => {
        if (result.id) {
          this.get();
          this.clear();
          this.mode = 'new';
          this.notification = {
            type: 'success',
            title: 'Sucesso!',
            message: `O Professor ${result.name} foi criado com sucesso com o id: '${result.id}'`,
          };
        }
      });
    else
      this.service.put(teacher).subscribe((result) => {
        if (result) {
          this.get();
          this.mode = 'selected';
          this.notification = {
            type: 'success',
            title: 'Sucesso!',
            message: `O Professor ${result.name} do id '${result.id}' foi editado com sucesso`,
          };
        }
      });
  }

  remove() {
    if (this.mode !== 'delete') {
      this.mode = 'delete';
      this.notification = {
        type: 'danger',
        title: 'Demitir?',
        message:
          'Tem certeza que deseja demitir definitivamente esse professor?',
      };
      return;
    }
    const teacher = this.createEntity();
    return this.service.delete(teacher).subscribe(() => {
      this.get();
      this.clear();
      this.mode = 'new';
      this.notification = {
        type: 'success',
        title: 'Sucesso!',
        message: `O Professor ${teacher.name} do id '${teacher.id}' foi demititdo com sucesso`,
      };
    });
  }

  ngOnInit(): void {}
}
