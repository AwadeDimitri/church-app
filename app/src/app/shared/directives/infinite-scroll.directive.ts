import {
  afterNextRender,
  Directive,
  DestroyRef,
  ElementRef,
  inject,
  input,
  output,
} from '@angular/core';

@Directive({
  selector: '[appInfiniteScroll]',
})
export class InfiniteScrollDirective {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroyRef = inject(DestroyRef);

  readonly disabled = input<boolean>(false, {
    alias: 'appInfiniteScrollDisabled',
  });
  readonly root = input<Element | null>(null, {
    alias: 'appInfiniteScrollRoot',
  });
  readonly intersected = output<void>({ alias: 'appInfiniteScroll' });

  constructor() {
    let observer: IntersectionObserver | undefined;

    afterNextRender(() => {
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting && !this.disabled()) {
              this.intersected.emit();
            }
          }
        },
        { root: this.root(), rootMargin: '200px' },
      );
      observer.observe(this.host.nativeElement);
    });

    this.destroyRef.onDestroy(() => observer?.disconnect());
  }
}
