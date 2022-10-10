import { Entity } from './entity';
import { ThemeColor } from './theme-color';

export class User implements Entity {
  constructor(public id: string, public color: ThemeColor) {}
}
