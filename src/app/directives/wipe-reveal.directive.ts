import { AfterViewInit, Directive, ElementRef, Input, OnDestroy, Renderer2 } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Directive({
  selector: '[wipeReveal]',
  standalone: true,
})
export class WipeRevealDirective implements AfterViewInit, OnDestroy {
  @Input() wipeRevealColor: string = '#D99557';
  @Input() wipeRevealDuration: number = 1.05;
  @Input() wipeRevealDelay: number = 0;
  @Input() wipeRevealStart: string = 'top 85%';
  @Input() wipeRevealOnce: boolean = true;
  @Input() wipeRevealYOffset: number = 10;

  private tl?: gsap.core.Timeline;
  private createdOverlay = false;

  constructor(
    private hostRef: ElementRef<HTMLElement>,
    private renderer: Renderer2,
  ) {}

  ngAfterViewInit(): void {
    const host = this.hostRef.nativeElement;

    // Build a predictable DOM structure:
    // <host class="wipe-reveal">
    //   <span class="wipe-reveal__text">[original content]</span>
    //   <span class="wipe-reveal__wipe" aria-hidden="true"></span>
    // </host>
    if (!host || this.createdOverlay) return;
    this.createdOverlay = true;

    this.renderer.addClass(host, 'wipe-reveal');

    const textWrapper = this.renderer.createElement('span') as HTMLSpanElement;
    this.renderer.addClass(textWrapper, 'wipe-reveal__text');

    // Move existing child nodes into wrapper
    while (host.firstChild) {
      this.renderer.appendChild(textWrapper, host.firstChild);
    }
    this.renderer.appendChild(host, textWrapper);

    const wipe = this.renderer.createElement('span') as HTMLSpanElement;
    this.renderer.addClass(wipe, 'wipe-reveal__wipe');
    this.renderer.setAttribute(wipe, 'aria-hidden', 'true');
    this.renderer.setStyle(wipe, 'background', this.wipeRevealColor);
    this.renderer.appendChild(host, wipe);

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    // Reduced motion: skip wipe, just fade in
    if (prefersReducedMotion) {
      this.tl = gsap.timeline({
        scrollTrigger: {
          trigger: host,
          start: this.wipeRevealStart,
          toggleActions: 'play none none none',
          once: this.wipeRevealOnce,
        },
      });
      this.tl.fromTo(
        textWrapper,
        { opacity: 0, y: this.wipeRevealYOffset },
        { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out', delay: this.wipeRevealDelay },
      );
      return;
    }

    // Normal motion: colored wipe + text reveal.
    this.tl = gsap.timeline({
      delay: this.wipeRevealDelay,
      scrollTrigger: {
        trigger: host,
        start: this.wipeRevealStart,
        toggleActions: 'play none none none',
        once: this.wipeRevealOnce,
      },
    });

    this.tl
      .set(wipe, { xPercent: -110 })
      .set(textWrapper, { opacity: 0, y: this.wipeRevealYOffset })
      .to(wipe, {
        xPercent: 110,
        duration: this.wipeRevealDuration,
        ease: 'power3.inOut',
      })
      .to(
        textWrapper,
        {
          opacity: 1,
          y: 0,
          duration: Math.min(0.55, this.wipeRevealDuration * 0.6),
          ease: 'power2.out',
        },
        this.wipeRevealDuration * 0.22,
      );
  }

  ngOnDestroy(): void {
    if (this.tl) {
      this.tl.scrollTrigger?.kill();
      this.tl.kill();
      this.tl = undefined;
    }
  }
}

