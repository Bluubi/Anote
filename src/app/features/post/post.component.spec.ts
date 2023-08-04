import {PostComponent} from './post.component';
import {TestBed} from "@angular/core/testing";
import {BoardComponent} from "../board/board.component";

describe('PostComponent', () => {
  it('should render posts', () => {
    const { fixture } = sut();

    fixture.detectChanges();

    const title = fixture.nativeElement.querySelector('.title') as HTMLHeadElement;
    const content = fixture.nativeElement.querySelector('.content') as HTMLParagraphElement;

    expect(title.textContent).toContain('Tarea pendiente');
    expect(content.textContent).toContain('Crear el primer test de integración entre dos componentes de Angular');

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
