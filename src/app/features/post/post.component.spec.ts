import {PostComponent} from './post.component';
import {TestBed} from "@angular/core/testing";
import {CommonModule} from "@angular/common";

describe('PostComponent', () => {
  it('should render posts', () => {
    const { fixture } = sut();

    fixture.detectChanges();

    const title = fixture.nativeElement.querySelector('.title') as HTMLHeadElement;
    const content = fixture.nativeElement.querySelector('.content') as HTMLParagraphElement;

    expect(title.textContent).toContain('Tarea pendiente');
    expect(content.textContent).toContain('Crear el primer test de integración entre dos componentes de Angular');

  });

  it('should render all posts', () => {
    const { fixture, component } = sut();

    component.posts = [{
      title: 'Awesome title',
      content: 'Awesome content'
    },
      {
        title: 'Another awesome title',
      content: 'Another awesome content'
      }];


    fixture.detectChanges();

    const title = fixture.nativeElement.querySelectorAll('.title') as HTMLHeadElement[];
    const content = fixture.nativeElement.querySelectorAll('.content') as HTMLParagraphElement[];

    expect(title.length).toBe(2)
    expect(content.length).toBe(2)

     expect(title[0].textContent).toContain('Awesome title');
     expect(title[1].textContent).toContain('Another awesome title');
     expect(content[0].textContent).toContain('Awesome content');
     expect(content[1].textContent).toContain('Another awesome content');
  })
});


function sut() {
  TestBed.configureTestingModule({
    imports: [PostComponent]
  });

  const fixture = TestBed.createComponent(PostComponent);

  const component = fixture.componentInstance;

  return { fixture, component }
}
