import {
  AfterViewChecked,
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  Renderer2,
  ViewChild
} from '@angular/core';
import {PostComponent} from "../post/post.component";
import {NgFor} from "@angular/common";
import {RouterOutlet} from "@angular/router";

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  standalone: true,
  imports: [PostComponent, NgFor, RouterOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./board.component.scss']
})
export class BoardComponent {

  @ViewChild('post') post!: PostComponent;

  posts = [{
    title: 'Tarea 1',
    content: 'Actualizar el README'
  },
    {
    title: 'Tarea 2',
    content: 'Visualizar un post concreto'
  }]

  render(id: number){
    this.post.render(id);
  }
}
