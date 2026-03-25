import { AfterViewInit, Directive, ElementRef, Input, OnDestroy, Renderer2 } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Directive({
  selector: '[wash-by]',
  standalone: true,
})
export class WashByDirective implements AfterViewInit, OnDestroy {
  @Input() washByColor = '#D99557';
  @Input() washByStart = 'top 85%';
  @Input() washByDuration = 1.1;
  @Input() washByStagger = 0.02;
  @Input() washByOnce = true;

  private timeline?: gsap.core.Timeline;
  private trigger?: ScrollTrigger;

  constructor(
    private hostRef: ElementRef<HTMLElement>,
    private renderer: Renderer2,
  ) {}

  ngAfterViewInit(): void {
    const host = this.hostRef.nativeElement;
    const sourceText = host.textContent ?? '';
    if (!sourceText.trim()) return;

    // Rebuild text into per-character spans so the wash can "pass through" letters.
    this.renderer.setProperty(host, 'textContent', '');
    this.renderer.setStyle(host, 'position', 'relative');
    this.renderer.setStyle(host, 'display', 'inline-block');
    this.renderer.setStyle(host, 'overflow', 'hidden');
    this.renderer.setStyle(host, 'white-space', 'pre-wrap');

    const textLayer = this.renderer.createElement('span') as HTMLSpanElement;
    this.renderer.setStyle(textLayer, 'position', 'relative');
    this.renderer.setStyle(textLayer, 'z-index', '2');

    const charElements: HTMLSpanElement[] = [];
    for (const char of sourceText) {
      const span = this.renderer.createElement('span') as HTMLSpanElement;
      this.renderer.setStyle(span, 'display', 'inline-block');
      this.renderer.setStyle(span, 'color', 'rgba(255, 255, 255, 0.45)');
      this.renderer.appendChild(span, this.renderer.createText(char));
      this.renderer.appendChild(textLayer, span);
      charElements.push(span);
    }
    this.renderer.appendChild(host, textLayer);

    const washLayer = this.renderer.createElement('span') as HTMLSpanElement;
    this.renderer.setStyle(washLayer, 'position', 'absolute');
    this.renderer.setStyle(washLayer, 'left', '0');
    this.renderer.setStyle(washLayer, 'top', '0');
    this.renderer.setStyle(washLayer, 'width', '100%');
    this.renderer.setStyle(washLayer, 'height', '100%');
    this.renderer.setStyle(washLayer, 'background', this.washByColor);
    this.renderer.setStyle(washLayer, 'opacity', '0.34');
    this.renderer.setStyle(washLayer, 'pointer-events', 'none');
    this.renderer.setStyle(washLayer, 'z-index', '1');
    this.renderer.setStyle(washLayer, 'transform', 'translateX(-110%)');
    this.renderer.appendChild(host, washLayer);

    this.timeline = gsap.timeline({ paused: true });
    this.timeline
      .fromTo(
        washLayer,
        { xPercent: -110 },
        { xPercent: 110, duration: this.washByDuration, ease: 'power2.inOut' },
        0,
      )
      .to(
        charElements,
        {
          color: '#FFFFFF',
          duration: 0.32,
          ease: 'power1.out',
          stagger: this.washByStagger,
        },
        0.08,
      );

    this.trigger = ScrollTrigger.create({
      trigger: host,
      start: this.washByStart,
      once: this.washByOnce,
      onEnter: () => this.timeline?.play(0),
    });
  }

  ngOnDestroy(): void {
    this.trigger?.kill();
    this.timeline?.kill();
  }
}

