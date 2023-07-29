import {TestBed} from '@angular/core/testing';

import {HeaderComponent} from './header.component';

describe('HeaderComponent', () => {

  it('should check title is correct', () => {
    const { fixture} = sut();

    fixture.detectChanges();

    const title = fixture.nativeElement.querySelector('h1');

    expect(title.innerHTML).toContain('Anote');
  });
});

function sut() {

  TestBed.configureTestingModule({
    imports: [ HeaderComponent ]
  })

  const fixture = TestBed.createComponent(HeaderComponent);
  const component = fixture.componentInstance;

  return { fixture, component};
}
