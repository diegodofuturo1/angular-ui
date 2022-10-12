import { Component, OnInit } from '@angular/core';
import { Classroom } from 'src/app/entities/classroom';
import { Notification } from 'src/app/entities/notification';
import { Subject } from 'src/app/entities/subject';
import { Teacher } from 'src/app/entities/teacher';
import { EntityService } from 'src/app/services/entity.service';

interface ClassroomDto extends Classroom {
  teacherName: string;
  subjectTitle: string;
}

@Component({
  selector: 'app-classroom',
  templateUrl: './classroom.component.html',
  styleUrls: ['./classroom.component.css'],
})
export class ClassroomComponent implements OnInit {
  id: string = '';
  teacherId: string = '';
  subjectId: string = '';
  image: string = '';
  classrooms: ClassroomDto[] = [];
  teachers: Teacher[] = [];
  subjects: Subject[] = [];
  mode: 'new' | 'selected' | 'edit' | 'delete' = 'new';
  notification?: Notification;

  constructor(
    private service: EntityService<Classroom>,
    teacher: EntityService<Teacher>,
    subject: EntityService<Subject>
  ) {
    teacher.table('teachers');
    teacher.get().subscribe((teachers) => (this.teachers = teachers));
    subject.table('subjects');
    subject.get().subscribe((subjects) => (this.subjects = subjects));
    service.table('classrooms');
    setTimeout(() => this.get(), 200);
  }

  get() {
    this.service.get().subscribe(
      (classroms) =>
        (this.classrooms = classroms.map((classrom) => {
          return {
            ...classrom,
            teacherName:
              this.teachers.find((t) => t.id === classrom.teacherId)?.name ??
              '',
            subjectTitle:
              this.subjects.find((s) => s.id === classrom.subjectId)?.title ??
              '',
          };
        }))
    );
  }

  load(classrom: Classroom) {
    this.clear();
    this.id = classrom.id;
    this.teacherId = classrom.teacherId;
    this.subjectId = classrom.subjectId;
    this.mode = 'selected';
    this.image = 'https://joeschmoe.io/api/v1/random';
  }

  clear() {
    this.id = '';
    this.teacherId = '';
    this.subjectId = '';
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
    const [classrom] = this.classrooms.filter(
      (classrom) => classrom.id == this.id
    );
    this.load(classrom);
  }

  validation() {
    if (!this.teacherId) {
      this.notification = {
        type: 'warning',
        title: 'Nenhum Professor Selecionado',
        message: 'Escolha o professor que irá lecionar essa aula!',
      };
      return false;
    }
    if (!this.subjectId) {
      this.notification = {
        type: 'warning',
        title: 'Nenhuma Matéria Selecionada',
        message: 'Escolha a matéria dessa aula!',
      };
      return false;
    }
    return true;
  }

  createEntity() {
    const id = this.mode === 'new' ? '1' : this.id;
    const { teacherId, subjectId } = this;

    return new Classroom(id, teacherId, subjectId, []);
  }

  save() {
    if (!this.validation()) return;

    const classrom = this.createEntity();

    if (this.mode === 'new')
      this.service.post(classrom).subscribe((result) => {
        if (result.id) {
          this.get();
          this.clear();
          this.mode = 'new';
          this.notification = {
            type: 'success',
            title: 'Sucesso!',
            message: `A Aula foi criada com sucesso com o id: '${result.id}'`,
          };
        }
      });
    else
      this.service.put(classrom).subscribe((result) => {
        if (result) {
          this.get();
          this.mode = 'selected';
          this.notification = {
            type: 'success',
            title: 'Sucesso!',
            message: `A Aula do id '${result.id}' foi editado com sucesso`,
          };
        }
      });
  }

  remove() {
    if (this.mode !== 'delete') {
      this.mode = 'delete';
      this.notification = {
        type: 'danger',
        title: 'Cancelar?',
        message: 'Tem certeza que deseja cancelar definitivamente esse aula?',
      };
      return;
    }
    const classrom = this.createEntity();
    return this.service.delete(classrom).subscribe(() => {
      this.get();
      this.clear();
      this.mode = 'new';
      this.notification = {
        type: 'success',
        title: 'Sucesso!',
        message: `A Aula do id '${classrom.id}' foi cancelada com sucesso`,
      };
    });
  }

  ngOnInit(): void {}
}
