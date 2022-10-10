import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  items = [
    {
      title: 'Aulas',
      router: 'classroom',
      description: 'Escolha uma matéria, um professor e abra as matrículas!',
    },
    {
      title: 'Matérias',
      router: 'subject',
      description: 'Crie novos cursos ou expanda os existentes!',
    },
    {
      title: 'Professores',
      router: 'teacher',
      description: 'Contrate e demita professores!',
    },
    {
      title: 'Alunos',
      router: 'student',
      description:
        'Gerencie os alunos, verifique suas notas, seu desempenho e expulsem eles caso necessário!',
    },
  ];
  constructor() {}

  ngOnInit(): void {}
}
