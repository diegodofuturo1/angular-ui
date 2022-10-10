import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Entity } from '../entities/entity';

@Injectable({
  providedIn: 'root',
})
export class EntityService<T extends Entity> {
  url: string = 'http://localhost:3000/';

  constructor(private readonly http: HttpClient) {}

  table(table: string) {
    this.url = `http://localhost:3000/${table}`;
  }

  get() {
    return this.http.get<T[]>(this.url);
  }

  getById(id: string) {
    return this.http.get<T>(`${this.url}/${id}`);
  }

  delete(user: T) {
    return this.http.delete<T>(`${this.url}/${user.id}`);
  }
}
