import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterOutlet} from "@angular/router";

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
