import {
  AfterContentChecked,
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  Renderer2
} from '@angular/core';
import {NgFor} from '@angular/common';
import {Post} from "./domain/post";
import {ActivatedRoute, Router, RouterOutlet} from "@angular/router";

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [NgFor, RouterOutlet],
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PostComponent  {

  @Input() post!: Post;
  router = inject(Router);
  render(id: number){
   this.router.navigate(['post', id] );
  }
}
