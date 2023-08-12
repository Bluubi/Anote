import {PostComponent} from './post.component';
import {TestBed} from "@angular/core/testing";
import {BoardComponent} from "../board/board.component";

describe('PostComponent', () => {
  it('should render posts', () => {
    const { fixture } = sut();

    fixture.detectChanges();

    const title = fixture.nativeElement.querySelectorAll('.title') as HTMLHeadElement[];
    const content = fixture.nativeElement.querySelectorAll('.content') as HTMLParagraphElement[];

    expect(title[0].textContent).toContain('Tarea 1');
    expect(content[0].textContent).toContain('Actualizar el README');

    expect(title[1].textContent).toContain('Tarea 2');
    expect(content[1].textContent).toContain('Visualizar un post concreto');

  });


});


function sut() {
  TestBed.configureTestingModule({
    imports: [BoardComponent, PostComponent]
  });

  const fixture = TestBed.createComponent(BoardComponent);

  const component = fixture.componentInstance;

  return { fixture, component }
}
