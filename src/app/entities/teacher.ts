import { Entity } from './entity';

export class Teacher implements Entity {
  constructor(
    public id: string,
    public name: string,
    public salary: number,
    public rating: number,
    public matters: string[]
  ) {}
}
