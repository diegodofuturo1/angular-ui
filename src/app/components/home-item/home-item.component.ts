import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-home-item',
  templateUrl: './home-item.component.html',
  styleUrls: ['./home-item.component.css'],
})
export class HomeItemComponent implements OnInit {
  @Input() title!: string;
  @Input() router!: string;
  @Input() description!: string;
  constructor() {}

  ngOnInit(): void {}
}
