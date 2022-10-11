import { Entity } from './entity';

export class Classroom implements Entity {
  constructor(
    public id: string,
    public teacherId: string,
    public matterId: string,
    public students: string[]
  ) {}
}
