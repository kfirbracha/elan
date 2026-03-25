import { AfterViewInit, Directive, ElementRef, Input, OnDestroy, Renderer2 } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Directive({
  selector: '[new-class-reveal]',
  standalone: true,
})
export class NewClassRevealDirective implements AfterViewInit, OnDestroy {
  @Input() newClassRevealStart = 'top 88%';
  @Input() newClassRevealDuration = 0.72;
  @Input() newClassRevealStagger = 0.055;
  @Input() newClassRevealYOffset = 26;
  @Input() newClassRevealOnce = false;

  private trigger?: ScrollTrigger;
  private timeline?: gsap.core.Timeline;
  private hasPlayed = false;

  constructor(
    private hostRef: ElementRef<HTMLElement>,
    private renderer: Renderer2,
  ) {}

  ngAfterViewInit(): void {
    const host = this.hostRef.nativeElement;
    const text = (host.textContent ?? '').trim();
    if (!text) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    this.renderer.setProperty(host, 'textContent', '');
    this.renderer.setStyle(host, 'display', 'inline-block');
    this.renderer.setStyle(host, 'line-height', '1.05');

    const words = text.split(/\s+/);
    const wordSpans: HTMLSpanElement[] = [];

    words.forEach((word, index) => {
      const wordWrap = this.renderer.createElement('span') as HTMLSpanElement;
      this.renderer.setStyle(wordWrap, 'display', 'inline-block');
      this.renderer.setStyle(wordWrap, 'overflow', 'hidden');
      this.renderer.setStyle(wordWrap, 'vertical-align', 'baseline');
      this.renderer.setStyle(wordWrap, 'margin-right', index === words.length - 1 ? '0' : '0.28em');

      const wordInner = this.renderer.createElement('span') as HTMLSpanElement;
      this.renderer.setStyle(wordInner, 'display', 'inline-block');
      this.renderer.appendChild(wordInner, this.renderer.createText(word));
      this.renderer.appendChild(wordWrap, wordInner);
      this.renderer.appendChild(host, wordWrap);
      wordSpans.push(wordInner);
    });

    this.timeline = gsap.timeline({ paused: true });

    if (prefersReducedMotion) {
      this.timeline.fromTo(wordSpans, { opacity: 0 }, { opacity: 1, duration: 0.25, stagger: 0.03 });
    } else {
      this.timeline.fromTo(
        wordSpans,
        { opacity: 0, yPercent: 125, filter: 'blur(1px)' },
        {
          opacity: 1,
          yPercent: 0,
          filter: 'blur(0px)',
          duration: this.newClassRevealDuration,
          stagger: this.newClassRevealStagger,
          ease: 'power3.out',
        },
      );
    }

    this.timeline.eventCallback('onComplete', () => {
      this.hasPlayed = true;
    });

    const playReveal = () => {
      if (this.newClassRevealOnce && this.hasPlayed) return;
      this.timeline?.play(0);
    };

    this.trigger = ScrollTrigger.create({
      trigger: host,
      start: this.newClassRevealStart,
      once: this.newClassRevealOnce,
      onEnter: () => playReveal(),
      onEnterBack: () => {
        if (!this.newClassRevealOnce) {
          playReveal();
        }
      },
      onRefreshInit: () => {
        // Keep the first-run animation available, but never hide it again after it completed once.
        if (!this.newClassRevealOnce || !this.hasPlayed) {
          this.timeline?.pause(0);
        }
      },
    });
  }

  ngOnDestroy(): void {
    this.trigger?.kill();
    this.timeline?.kill();
  }
}

