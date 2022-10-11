import { Entity } from './entity';

export class Matter implements Entity {
  constructor(
    public id: string,
    public title: string,
    public discription: number,
    public teachers: string[]
  ) {}
}
