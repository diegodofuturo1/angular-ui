import { Component, OnInit } from '@angular/core';
import { Student } from 'src/app/entities/student';
import { Notification } from 'src/app/entities/notification';
import { EntityService } from 'src/app/services/entity.service';
import { Classroom } from 'src/app/entities/classroom';
import { Teacher } from 'src/app/entities/teacher';
import { Subject } from 'src/app/entities/subject';

interface ClassroomDto extends Classroom {
  teacherName: string;
  subjectTitle: string;
}

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css'],
})
export class StudentComponent implements OnInit {
  id: string = '';
  name: string = '';
  ra: string = '';
  age: string = '';
  image: string = '';
  students: Student[] = [];
  classroomId: string = '';
  classrooms: ClassroomDto[] = [];
  mode: 'new' | 'selected' | 'edit' | 'delete' = 'new';
  notification?: Notification;

  constructor(private service: EntityService<Student>) {
    let _classrooms: Classroom[] = [];
    let teachers: Teacher[] = [];
    let subjects: Subject[] = [];

    const observables = service.getAll();
    observables.classrooms.subscribe((result) => (_classrooms = result));
    observables.teachers.subscribe((result) => (teachers = result));
    observables.subjects.subscribe((result) => (subjects = result));
    observables.students.subscribe((result) => (this.students = result));
    const loadSelect = () => {
      this.classrooms = _classrooms.map((classroom) => ({
        ...classroom,
        subjectTitle:
          subjects.find((s) => s.id == classroom.subjectId)?.title ?? '',
        teacherName:
          teachers.find((t) => t.id == classroom.teacherId)?.name ?? '',
      }));
    };
    setTimeout(loadSelect, 200);
    service.table('students');
  }

  get() {
    this.service.get().subscribe((students) => (this.students = students));
  }

  load(student: Student) {
    this.clear();
    this.id = student.id;
    this.name = student.name;
    this.ra = student.ra;
    this.age = student.age;
    this.classroomId = student.classroomId;
    this.mode = 'selected';
    this.image = 'https://joeschmoe.io/api/v1/random';
  }

  clear() {
    this.id = '';
    this.name = '';
    this.ra = '';
    this.age = '';
    this.classroomId = '';
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
    const [student] = this.students.filter((student) => student.id == this.id);
    this.load(student);
  }

  validation() {
    if (!this.name) {
      this.notification = {
        type: 'warning',
        title: 'Campo Obrig??torio',
        message: 'O campo "Nome" ?? obrig??torio',
      };
      return false;
    }
    if (!this.age) {
      this.notification = {
        type: 'warning',
        title: 'Campo Obrig??torio',
        message: 'O campo "Idade" ?? obrig??torio',
      };
      return false;
    }

    if (!this.ra) {
      this.notification = {
        type: 'warning',
        title: 'Campo Obrig??torio',
        message: 'O campo "RA" ?? obrig??torio',
      };
      return false;
    }
    return true;
  }

  createEntity() {
    const id = this.mode === 'new' ? '1' : this.id;
    const { name, age, ra } = this;

    return new Student(id, name, ra, age, this.classroomId);
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
            message: `O Aluno ${result.name} foi criado com sucesso com o id: '${result.id}'`,
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
            message: `O Aluno ${result.name} do id '${result.id}' foi editado com sucesso`,
          };
        }
      });
  }

  remove() {
    if (this.mode !== 'delete') {
      this.mode = 'delete';
      this.notification = {
        type: 'danger',
        title: 'Expulsar?',
        message: 'Tem certeza que deseja expulsar definitivamente esse aluno?',
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
        message: `O Aluno ${student.name} do id '${student.id}' foi expulso com sucesso`,
      };
    });
  }

  ngOnInit(): void {}
}
