import { Component, OnInit } from '@angular/core';
import { Subject } from 'src/app/entities/subject';
import { Notification } from 'src/app/entities/notification';
import { EntityService } from 'src/app/services/entity.service';

@Component({
  selector: 'app-subject',
  templateUrl: './subject.component.html',
  styleUrls: ['./subject.component.css'],
})
export class SubjectComponent implements OnInit {
  id: string = '';
  title: string = '';
  description: string = '';
  duration: string = '';
  image: string = '';
  subjects: Subject[] = [];
  mode: 'new' | 'selected' | 'edit' | 'delete' = 'new';
  notification?: Notification;

  constructor(private service: EntityService<Subject>) {
    service.table('subjects');
    this.get();
  }

  get() {
    this.service.get().subscribe((subjects) => (this.subjects = subjects));
  }

  load(student: Subject) {
    this.clear();
    this.id = student.id;
    this.title = student.title;
    this.description = student.description;
    this.duration = student.duration.toString();
    this.mode = 'selected';
    this.image =
      'https://images.vexels.com/media/users/3/143402/isolated/preview/afbbf15d5e82a1c4fb5a55c4eacf3003-icone-de-chapeu-de-formatura.png';
  }

  clear() {
    this.id = '';
    this.title = '';
    this.description = '';
    this.duration = '';
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
    const [student] = this.subjects.filter((student) => student.id == this.id);
    this.load(student);
  }

  validation() {
    if (!this.title) {
      this.notification = {
        type: 'warning',
        title: 'Campo Obrigátorio',
        message: 'O campo "Título" é obrigátorio',
      };
      return false;
    }
    if (!this.duration) {
      this.notification = {
        type: 'warning',
        title: 'Campo Obrigátorio',
        message: 'O campo "Duração" é obrigátorio',
      };
      return false;
    }

    if (!this.description) {
      this.notification = {
        type: 'warning',
        title: 'Campo Obrigátorio',
        message: 'O campo "Descrição" é obrigátorio',
      };
      return false;
    }
    return true;
  }

  createEntity() {
    const id = this.mode === 'new' ? '1' : this.id;
    const { title, duration, description: ra } = this;

    return new Subject(id, title, ra, Number(duration), []);
  }

  save() {
    if (!this.validation()) return;

    const student = this.createEntity();

    if (this.mode === 'new')
      this.service.post(student).subscribe((result) => {
        if (result.id) {
          this.get();
          this.clear();
          this.mode = 'new';
          this.notification = {
            type: 'success',
            title: 'Sucesso!',
            message: `A Matéria ${result.title} foi criada com sucesso com o id: '${result.id}'`,
          };
        }
      });
    else
      this.service.put(student).subscribe((result) => {
        if (result) {
          this.get();
          this.mode = 'selected';
          this.notification = {
            type: 'success',
            title: 'Sucesso!',
            message: `A Matéria ${result.title} do id '${result.id}' foi editada com sucesso`,
          };
        }
      });
  }

  remove() {
    if (this.mode !== 'delete') {
      this.mode = 'delete';
      this.notification = {
        type: 'danger',
        title: 'Encerrar?',
        message:
          'Tem certeza que deseja encerrar definitivamente essa matéria?',
      };
      return;
    }
    const student = this.createEntity();
    return this.service.delete(student).subscribe(() => {
      this.get();
      this.clear();
      this.mode = 'new';
      this.notification = {
        type: 'success',
        title: 'Sucesso!',
        message: `A Matéria ${student.title} do id '${student.id}' foi removida com sucesso`,
      };
    });
  }

  ngOnInit(): void {}
}
