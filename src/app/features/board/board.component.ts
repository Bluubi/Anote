import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {PostComponent} from "../post/post.component";

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  standalone: true,
  imports: [PostComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./board.component.scss']
})
export class BoardComponent  {
  posts = [{
    title: 'Tarea pendiente',
    content: 'Crear el primer test de integración entre dos componentes de Angular'
  }]
}
