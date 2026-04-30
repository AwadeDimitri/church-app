import {
  Component,
  ChangeDetectionStrategy,
  ElementRef,
  inject,
  input,
  output,
  signal,
  computed,
  AfterViewInit,
} from '@angular/core';
import { NzIconDirective } from 'ng-zorro-antd/icon';

const THRESHOLD = 70;
const DAMPING = 0.5;
const MAX_PULL = 110;
const RESTING_DISTANCE = 56;

@Component({
  selector: 'app-pull-to-refresh',
  imports: [NzIconDirective],
  template: `
    <div
      class="relative"
      (touchstart)="onTouchStart($event)"
      (touchmove)="onTouchMove($event)"
      (touchend)="onTouchEnd()"
      (touchcancel)="onTouchEnd()"
    >
      <div
        class="absolute left-0 right-0 flex justify-center pointer-events-none"
        [class.transition-all]="!isPulling()"
        [class.duration-300]="!isPulling()"
        [style.top.px]="-44"
        [style.transform]="'translateY(' + currentDistance() + 'px)'"
        [style.opacity]="indicatorOpacity()"
      >
        <div class="bg-white rounded-full shadow-church-card w-9 h-9 flex items-center justify-center">
          <nz-icon
            [nzType]="refreshing() ? 'loading' : 'arrow-down'"
            [nzSpin]="refreshing()"
            class="text-church-blue text-base transition-transform duration-200"
            [class.rotate-180]="!refreshing() && reachedThreshold()"
          />
        </div>
      </div>
      <div
        [class.transition-transform]="!isPulling()"
        [class.duration-300]="!isPulling()"
        [style.transform]="'translateY(' + currentDistance() + 'px)'"
      >
        <ng-content />
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PullToRefresh implements AfterViewInit {
  private readonly hostEl: HTMLElement = inject(ElementRef).nativeElement;

  readonly refreshing = input(false);
  readonly refresh = output<void>();

  protected readonly pullDistance = signal(0);
  protected readonly isPulling = signal(false);

  protected readonly reachedThreshold = computed(() => this.pullDistance() >= THRESHOLD);
  protected readonly currentDistance = computed(() =>
    this.refreshing() ? RESTING_DISTANCE : this.pullDistance(),
  );
  protected readonly indicatorOpacity = computed(() =>
    Math.min(1, this.currentDistance() / 50),
  );

  private startY = 0;
  private scrollContainer: HTMLElement | null = null;

  ngAfterViewInit(): void {
    this.scrollContainer = this.findScrollContainer(this.hostEl);
  }

  onTouchStart(e: TouchEvent): void {
    if (this.refreshing()) return;
    if ((this.scrollContainer?.scrollTop ?? 0) > 0) return;
    const t = e.touches[0];
    if (!t) return;
    this.startY = t.clientY;
    this.isPulling.set(true);
  }

  onTouchMove(e: TouchEvent): void {
    if (!this.isPulling() || this.refreshing()) return;
    if ((this.scrollContainer?.scrollTop ?? 0) > 0) {
      this.cancelPull();
      return;
    }
    const t = e.touches[0];
    if (!t) return;
    const dy = t.clientY - this.startY;
    if (dy <= 0) {
      this.pullDistance.set(0);
      return;
    }
    this.pullDistance.set(Math.min(MAX_PULL, dy * DAMPING));
  }

  onTouchEnd(): void {
    if (!this.isPulling()) return;
    const reached = this.pullDistance() >= THRESHOLD;
    this.isPulling.set(false);
    this.pullDistance.set(0);
    if (reached) this.refresh.emit();
  }

  private cancelPull(): void {
    this.isPulling.set(false);
    this.pullDistance.set(0);
  }

  private findScrollContainer(el: HTMLElement | null): HTMLElement | null {
    let cur: HTMLElement | null = el?.parentElement ?? null;
    while (cur && cur !== document.body) {
      const style = getComputedStyle(cur);
      if (/(auto|scroll)/.test(style.overflowY)) return cur;
      cur = cur.parentElement;
    }
    return document.scrollingElement as HTMLElement | null;
  }
}
