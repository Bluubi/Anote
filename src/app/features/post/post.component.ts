import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {NgFor} from '@angular/common';


export interface Posts {
  title: string,
  content: string,
}
@Component({
  selector: 'app-post',
  standalone: true,
  imports: [NgFor],
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PostComponent {

  @Input() posts!: Posts[];

}
