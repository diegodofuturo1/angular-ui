import { Entity } from './entity';

export class Subject implements Entity {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public duration: number,
    public teachers: string[]
  ) {}
}
