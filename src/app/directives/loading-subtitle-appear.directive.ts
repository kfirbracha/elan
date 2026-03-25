import { AfterViewInit, Directive, ElementRef, Input, OnDestroy } from '@angular/core';
import { gsap } from 'gsap';

@Directive({
  selector: '[loading-subtitle-appear]',
  standalone: true,
})
export class LoadingSubtitleAppearDirective implements AfterViewInit, OnDestroy {
  @Input() loadingSubtitleAppearDuration = 0.75;
  @Input() loadingSubtitleAppearDelay = 0.22;
  @Input() loadingSubtitleAppearYOffset = 10;
  @Input() loadingSubtitleAppearEase = 'power2.out';
  /** Seconds to show the first line before swapping to the second (when two `.loading-subtitle-text` nodes exist). */
  @Input() loadingSubtitleFirstHoldSec = 3;
  @Input() loadingSubtitleCrossfadeSec = 0.45;

  private timeline?: gsap.core.Timeline;

  constructor(private hostRef: ElementRef<HTMLElement>) {}

  ngAfterViewInit(): void {
    const host = this.hostRef.nativeElement;
    if (!host) return;

    const lines = Array.from(host.querySelectorAll<HTMLElement>('.loading-subtitle-text'));
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    const tl = gsap.timeline();

    if (lines.length >= 2) {
      gsap.set(lines[1], { opacity: 0 });
    }

    tl.fromTo(
      host,
      { opacity: 0, y: prefersReducedMotion ? 0 : this.loadingSubtitleAppearYOffset },
      {
        opacity: 1,
        y: 0,
        duration: prefersReducedMotion ? 0.25 : this.loadingSubtitleAppearDuration,
        delay: prefersReducedMotion ? 0 : this.loadingSubtitleAppearDelay,
        ease: this.loadingSubtitleAppearEase,
      },
    );

    if (lines.length >= 2) {
      const hold = prefersReducedMotion ? 0.15 : this.loadingSubtitleFirstHoldSec;
      const xf = prefersReducedMotion ? 0.15 : this.loadingSubtitleCrossfadeSec;
      tl.to(lines[0], { opacity: 0, duration: xf }, `+=${hold}`);
      tl.to(lines[1], { opacity: 1, duration: xf }, '<');
    }

    this.timeline = tl;
  }

  ngOnDestroy(): void {
    this.timeline?.kill();
    this.timeline = undefined;
  }
}
