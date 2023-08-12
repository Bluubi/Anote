import {ComponentFixture, TestBed} from '@angular/core/testing';
import {BoardComponent} from './board.component';
import {PostComponent} from "../post/post.component";
import {FormComponent} from "../post/features/form/form.component";
import {AppRoutingModule} from "../../app-routing.module";
import {RouterTestingHarness} from "@angular/router/testing";
import {Router} from "@angular/router";

describe('BoardComponent', () => {
  it('should navigate to concrete post when user click on it', async () => {
    const { fixture, router } = await setup();

    const post = fixture.nativeElement.querySelector('app-post') as HTMLElement;

    const routerDI = TestBed.inject(Router);


    const click = new MouseEvent('click');
    post.dispatchEvent(click);

    const form = router.nativeElement.querySelector('app-form');

    expect(form).toBeDefined();
    expect(routerDI.url).toEqual('/post/0')
  })
});

async function setup() {

  await TestBed.configureTestingModule({
    imports: [AppRoutingModule, PostComponent, FormComponent],
  }).compileComponents();

  const routerFixture = await RouterTestingHarness.create();

  const router = routerFixture.fixture as ComponentFixture<unknown>;

  const fixture = TestBed.createComponent(BoardComponent);
  const sut = fixture.componentInstance;

  fixture.autoDetectChanges(true);

  return { fixture, sut, router }
}
