import {ChangeDetectionStrategy, Component} from '@angular/core';
import {NgFor} from '@angular/common';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [NgFor],
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PostComponent {
  posts = [{
    title: 'Tarea pendiente',
    content: 'Crear el primer test de integración entre dos componentes de Angular'
  }]

}
