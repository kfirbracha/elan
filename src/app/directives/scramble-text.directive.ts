import {
  AfterViewInit,
  Directive,
  ElementRef,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  Renderer2,
  SimpleChanges,
} from '@angular/core';

@Directive({
  selector: '[scrambleText]',
  standalone: true,
})
export class ScrambleTextDirective implements AfterViewInit, OnChanges, OnDestroy {
  @Input('scrambleText') scrambleTextValue: string | null = null;
  @Input() scrambleTextDuration = 1000; // milliseconds
  @Input() scrambleTextChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

  private animationFrameId?: number;
  private startTime = 0;
  private originalText = '';
  private originalGlyphs: string[] = [];
  private parentHoverUnlisten?: () => void;

  constructor(
    private hostRef: ElementRef<HTMLElement>,
    private renderer: Renderer2,
  ) {}

  ngAfterViewInit(): void {
    const host = this.hostRef.nativeElement;
    const parentTrigger = host.closest('.lang-trigger, .lang-option');
    if (!parentTrigger) return;

    this.parentHoverUnlisten = this.renderer.listen(parentTrigger, 'mouseenter', () => this.onHover());
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('scrambleTextValue' in changes) {
      this.syncBaseText();
    }
  }

  private isReducedMotion(): boolean {
    return (
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    );
  }

  @HostListener('mouseenter')
  @HostListener('focusin')
  onHover(): void {
    const host = this.hostRef.nativeElement;
    if (!host) return;

    this.syncBaseText();
    if (!this.originalText.trim()) return;
    this.originalGlyphs = this.toGlyphs(this.originalText);
    if (!this.originalGlyphs.length) return;

    if (this.isReducedMotion()) {
      this.renderer.setProperty(host, 'textContent', this.originalText);
      return;
    }

    if (this.animationFrameId !== undefined) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = undefined;
    }

    this.startTime = performance.now();
    this.tick();
  }

  ngOnDestroy(): void {
    this.parentHoverUnlisten?.();
    this.parentHoverUnlisten = undefined;

    if (this.animationFrameId !== undefined) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = undefined;
    }
  }

  private tick = (): void => {
    const host = this.hostRef.nativeElement;
    const now = performance.now();
    const elapsed = now - this.startTime;
    const progress = Math.min(elapsed / this.scrambleTextDuration, 1);
    const scrambled = this.originalGlyphs
      .map((char) => {
        if (char === ' ') return ' ';
        return this.randomChar();
      })
      .join('');

    this.renderer.setProperty(host, 'textContent', scrambled);

    if (progress < 1) {
      this.animationFrameId = requestAnimationFrame(this.tick);
      return;
    }

    this.renderer.setProperty(host, 'textContent', this.originalText);
    this.animationFrameId = undefined;
  };

  private randomChar(): string {
    if (!this.scrambleTextChars.length) return '*';
    const randomIndex = Math.floor(Math.random() * this.scrambleTextChars.length);
    return this.scrambleTextChars[randomIndex];
  }

  private syncBaseText(): void {
    const host = this.hostRef.nativeElement;
    const nextText = (this.scrambleTextValue ?? host.textContent ?? '').trim();
    this.originalText = nextText;
    this.renderer.setProperty(host, 'textContent', nextText);
  }

  private toGlyphs(text: string): string[] {
    if (typeof Intl !== 'undefined' && typeof (Intl as any).Segmenter === 'function') {
      const segmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' });
      return Array.from(segmenter.segment(text), (segment) => segment.segment);
    }

    return Array.from(text);
  }
}
