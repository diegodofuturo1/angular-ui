import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  OnChanges,
} from '@angular/core';

export interface DataCell {
  key: string;
  value: string;
}
export type DataRow = DataCell[];
export type DataSource = DataRow[];

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
})
export class TableComponent implements OnInit, OnChanges {
  @Input() title!: string;
  @Input() columns!: string[];
  @Input() data!: any[];
  @Input() ignoreColumns?: string[];

  @Output() selected: EventEmitter<any> = new EventEmitter();

  dataSource: DataSource = [];

  constructor() {
    this.toDataSource();
  }

  ngOnChanges(): void {
    this.toDataSource();
  }

  toDataSource() {
    if (this.data) {
      this.dataSource = [];
      this.data.forEach((entity) => {
        const toCell = (key: string) => ({
          key,
          value: entity[key],
        });
        const row = Object.keys(entity).map(toCell);
        this.dataSource.push(
          row.filter(
            (r) =>
              (typeof r.value == 'string' || typeof r.value == 'number') &&
              !this.ignoreColumns?.includes(r.key)
          )
        );
      });
    }
  }

  toEntity(data: DataRow): any {
    const [{ value }] = data.filter((d) => d.key == 'id');
    const [entity] = this.data.filter((d) => d.id == value);
    return entity;
  }

  emit(data: DataRow) {
    this.selected.emit(this.toEntity(data));
  }

  ngOnInit(): void {}
}
