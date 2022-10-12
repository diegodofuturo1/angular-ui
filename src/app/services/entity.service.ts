import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Entity } from '../entities/entity';
import * as uuid from 'uuid';
import { Student } from '../entities/student';
import { Teacher } from '../entities/teacher';
import { Subject } from '../entities/subject';
import { Classroom } from '../entities/classroom';

@Injectable({
  providedIn: 'root',
})
export class EntityService<T extends Entity> {
  url: string = 'http://localhost:3000/';

  constructor(private readonly http: HttpClient) {}

  table(table: string) {
    this.url = `http://localhost:3000/${table}`;
    return this;
  }

  get() {
    return this.http.get<T[]>(this.url);
  }

  getById(id: string) {
    return this.http.get<T>(`${this.url}/${id}`);
  }

  post(entity: T) {
    entity.id = uuid.v4();
    return this.http.post<T>(this.url, entity);
  }

  put(entity: T) {
    return this.http.put<T>(`${this.url}/${entity.id}`, entity);
  }

  delete(user: T) {
    return this.http.delete<T>(`${this.url}/${user.id}`);
  }

  getAll() {
    const url: string = 'http://localhost:3000/';

    return {
      students: this.http.get<Student[]>(url + 'students'),
      teachers: this.http.get<Teacher[]>(url + 'teachers'),
      subjects: this.http.get<Subject[]>(url + 'subjects'),
      classrooms: this.http.get<Classroom[]>(url + 'classrooms'),
    };
  }
}
