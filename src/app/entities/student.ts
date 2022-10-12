import { Entity } from './entity';

export class Student implements Entity {
  constructor(
    public id: string,
    public name: string,
    public ra: string,
    public age: string,
    public classroomId: string
  ) {}
}
