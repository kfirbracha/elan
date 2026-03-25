import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { LoadingScreen } from './components/loading-screen/loading-screen';

gsap.registerPlugin(ScrollTrigger);

const STORAGE_LANG_KEY = 'titangate-lang';
export const SUPPORTED_LANGUAGES = [
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'ru', label: 'Русский', flag: '🇷🇺' },
  { code: 'ar', label: 'العربية', flag: '🇸🇦' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'pt-MZ', label: 'Português (Moçambique)', flag: '🇲🇿' },
  { code: 'pt-BR', label: 'Português (Brasil)', flag: '🇧🇷' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'zh', label: '中文 (简体)', flag: '🇨🇳' },
  { code: 'ja', label: '日本語', flag: '🇯🇵' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
] as const;

interface Industry {
  name: string;
  icon: string;
}

interface ProcessStep {
  number: string;
  title: string;
  description: string;
}

interface Comparison {
  title: string;
  newWorld: string;
  oldWorld: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, TranslateModule, RouterOutlet, LoadingScreen],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit, AfterViewInit, OnDestroy {
  readonly supportedLanguages = SUPPORTED_LANGUAGES;
  currentLang: string = 'en';
  langMenuOpen = false;
  isNavScrolled = false;

  get currentLanguage() {
    return this.supportedLanguages.find((l) => l.code === this.currentLang) ?? this.supportedLanguages[0];
  }

  toggleLangMenu() {
    this.langMenuOpen = !this.langMenuOpen;
  }

  selectLanguage(code: string) {
    this.setLanguage(code);
    this.langMenuOpen = false;
  }

  // Typewriter
  currentWordIndex = 0;
  currentWord = '';
  isDeleting = false;
  get typewriterWords(): string[] {
    return [
      this.translate.instant('typewriter.word1'),
      this.translate.instant('typewriter.word2'),
      this.translate.instant('typewriter.word3'),
    ];
  }

  // Flicker animation for "our vision"
  visionFlickerIndices: number[] = [];
  get visionTitleChars(): string[] {
    return this.translate.instant('visionFlicker.block1').split('');
  }

  // Flicker animation for Titangate Equity
  flickerActiveIndices: number[] = [];
  get titangateTitleChars(): string[] {
    return this.translate.instant('visionFlicker.block2').split('');
  }

  // Flicker animation for @titangate_Equity
  handleFlickerIndices: number[] = [];
  get handleTitleChars(): string[] {
    return this.translate.instant('visionFlicker.block3').split('');
  }

  // Flicker animation for status bar
  statusFlickerIndices: number[][] = [[], [], [], [], []];
  getStatusChars(index: number): string[] {
    const key = 'status.line' + (index + 1);
    return (this.translate.instant(key) || '').split('');
  }

  // Flicker animation for micro text (word-level)
  microTextFlickerIndices: number[] = [];
  get microTextWords(): string[] {
    const s = this.translate.instant('microWords') || '';
    return s.split('|');
  }

  // Stats
  statsAnimated = false;
  statPercentage = 0;
  statPerformance = 0;

  // Loading
  isLoading = true;
  loadingDots = '';

  // Video Sound Toggle
  isVideoMuted = true;
  is8VideoMuted = true;
  isUmbrellaVideoMuted = true;
  isWelcome8VideoMuted = true;
  isSectorVideoMuted = true;
  isElanVideoMuted = true;

  toggleVideoMute() {
    this.isVideoMuted = !this.isVideoMuted;
  }

  toggleElanVideoMute() {
    this.isElanVideoMuted = !this.isElanVideoMuted;
  }

  toggleUmbrellaVideoMute() {
    this.isUmbrellaVideoMuted = !this.isUmbrellaVideoMuted;
  }

  toggleWelcome8VideoMute() {
    this.isWelcome8VideoMuted = !this.isWelcome8VideoMuted;
  }

  toggleSectorVideoMute() {
    this.isSectorVideoMuted = !this.isSectorVideoMuted;
  }

  // Navigation
  get navKeywords(): string[] {
    return [
      this.translate.instant('nav.govFinance'),
      this.translate.instant('nav.lng'),
      this.translate.instant('nav.goldMining'),
      this.translate.instant('nav.spaceMinerals'),
    ];
  }

  // Split text into characters for animation
  splitToChars(text: string): string[] {
    return text.split('');
  }

  // Industries
  get industries(): Industry[] {
    const icons = ['◈', '◇', '✧', '▣', '✚', '◉', '◆', '⬡'];
    return [1, 2, 3, 4, 5, 6, 7, 8].map((i) => ({
      name: this.translate.instant('industries.name' + i),
      icon: icons[i - 1],
    }));
  }

  // Process
  get processSteps(): ProcessStep[] {
    return [
      {
        number: '01',
        title: this.translate.instant('process.selection'),
        description: this.translate.instant('process.selectionDesc'),
      },
      {
        number: '02',
        title: this.translate.instant('process.alignment'),
        description: this.translate.instant('process.alignmentDesc'),
      },
      {
        number: '03',
        title: this.translate.instant('process.access'),
        description: this.translate.instant('process.accessDesc'),
      },
      {
        number: '04',
        title: this.translate.instant('process.compounding'),
        description: this.translate.instant('process.compoundingDesc'),
      },
    ];
  }

  // Comparisons
  get comparisons(): Comparison[] {
    return [
      {
        title:
          this.translate.instant('benefits.enforcement') +
          ' ' +
          this.translate.instant('benefits.vsEmptyPromises'),
        newWorld: this.translate.instant('comparisons.newWorld1'),
        oldWorld: this.translate.instant('comparisons.oldWorld1'),
      },
      {
        title:
          this.translate.instant('benefits.stewardship') +
          ' ' +
          this.translate.instant('benefits.vsNeglect'),
        newWorld: this.translate.instant('comparisons.newWorld2'),
        oldWorld: this.translate.instant('comparisons.oldWorld2'),
      },
      {
        title:
          this.translate.instant('benefits.flexibility') +
          ' ' +
          this.translate.instant('benefits.vsOneSize'),
        newWorld: this.translate.instant('comparisons.newWorld3'),
        oldWorld: this.translate.instant('comparisons.oldWorld3'),
      },
      {
        title:
          this.translate.instant('benefits.liquidity') +
          ' ' +
          this.translate.instant('benefits.vsCaptivity'),
        newWorld: this.translate.instant('comparisons.newWorld4'),
        oldWorld: this.translate.instant('comparisons.oldWorld4'),
      },
    ];
  }

  activeComparisonIndex = 0;
  activeProcessStep = 0;

  // Benefits section - active item sync
  activeBenefitNumber = 1;

  constructor(private translate: TranslateService) {
    const saved = localStorage.getItem(STORAGE_LANG_KEY);
    const code = saved && SUPPORTED_LANGUAGES.some((l) => l.code === saved) ? saved : 'en';
    this.translate.use(code);
    this.currentLang = code;
  }

  setLanguage(code: string) {
    if (!SUPPORTED_LANGUAGES.some((l) => l.code === code)) return;
    this.translate.use(code);
    this.currentLang = code;
    localStorage.setItem(STORAGE_LANG_KEY, code);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    if (this.langMenuOpen && target && !target.closest('.lang-switcher')) {
      this.langMenuOpen = false;
    }
  }

  ngOnInit() {
    this.startLoadingAnimation();
  }

  ngAfterViewInit() {
    this.updateNavScrolledState();
    setTimeout(() => {
      this.isLoading = false;
      setTimeout(() => {
        this.initHeroAnimations();
        this.initScrollAnimations();
        this.startTypewriter();
        this.startFlickerAnimation();
        this.startSvgLinesAnimation();
        this.startMicroTextWordAnimation();
      }, 100);
    }, 4000);
  }

  ngOnDestroy() {
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    // Clean up SVG flicker intervals
    this.svgFlickerIntervals.forEach((id) => clearInterval(id));
  }

  startLoadingAnimation() {
    let dotCount = 0;
    const interval = setInterval(() => {
      dotCount = (dotCount + 1) % 7;
      this.loadingDots = '.'.repeat(dotCount);
      if (!this.isLoading) clearInterval(interval);
    }, 300);
  }

  startTypewriter() {
    const typeSpeed = 70;
    const deleteSpeed = 35;
    const pauseDuration = 2000;

    const type = () => {
      const fullWord = this.typewriterWords[this.currentWordIndex];

      if (!this.isDeleting) {
        this.currentWord = fullWord.substring(0, this.currentWord.length + 1);

        if (this.currentWord === fullWord) {
          setTimeout(() => {
            this.isDeleting = true;
            type();
          }, pauseDuration);
          return;
        }
      } else {
        this.currentWord = fullWord.substring(0, this.currentWord.length - 1);

        if (this.currentWord === '') {
          this.isDeleting = false;
          this.currentWordIndex = (this.currentWordIndex + 1) % this.typewriterWords.length;
        }
      }

      setTimeout(type, this.isDeleting ? deleteSpeed : typeSpeed);
    };

    type();
  }

  startFlickerAnimation() {
    // "our vision" flicker
    const visionIndices = this.visionTitleChars
      .map((char, i) => (char !== ' ' ? i : -1))
      .filter((i) => i !== -1);

    for (let loop = 0; loop < 5; loop++) {
      this.createFlickerLoop(visionIndices, loop * 50, 'vision');
    }

    // Titangate Equity flicker
    const titleIndices = this.titangateTitleChars
      .map((char, i) => (char !== ' ' ? i : -1))
      .filter((i) => i !== -1);

    for (let loop = 0; loop < 5; loop++) {
      this.createFlickerLoop(titleIndices, loop * 50, 'title');
    }

    // @titangate_Equity flicker
    const handleIndices = this.handleTitleChars
      .map((char, i) => (char !== ' ' ? i : -1))
      .filter((i) => i !== -1);

    for (let loop = 0; loop < 5; loop++) {
      this.createFlickerLoop(handleIndices, loop * 50, 'handle');
    }

    // Micro text flicker - word level
    const microIndices = this.microTextWords.map((_, i) => i);

    for (let loop = 0; loop < 15; loop++) {
      this.createFlickerLoop(microIndices, loop * 30, 'micro');
    }

    // Status bar flicker
    [0, 1, 2, 3, 4].forEach((textIndex: number) => {
      const chars = this.getStatusChars(textIndex);
      const statusIndices = chars
        .map((char: string, i: number) => (char !== ' ' ? i : -1))
        .filter((i: number) => i !== -1);
      for (let loop = 0; loop < 3; loop++) {
        this.createStatusFlickerLoop(statusIndices, loop * 100, textIndex);
      }
    });
  }

  private createStatusFlickerLoop(validIndices: number[], delay: number, textIndex: number) {
    setTimeout(() => {
      const flickerChar = () => {
        const randomIndex = validIndices[Math.floor(Math.random() * validIndices.length)];

        if (!this.statusFlickerIndices[textIndex].includes(randomIndex)) {
          this.statusFlickerIndices[textIndex] = [
            ...this.statusFlickerIndices[textIndex],
            randomIndex,
          ];
        }
        setTimeout(
          () => {
            this.statusFlickerIndices[textIndex] = this.statusFlickerIndices[textIndex].filter(
              (i) => i !== randomIndex,
            );
          },
          60 + Math.random() * 100,
        );

        setTimeout(flickerChar, 80 + Math.random() * 200);
      };

      flickerChar();
    }, delay);
  }

  private createFlickerLoop(
    validIndices: number[],
    delay: number,
    target: 'vision' | 'title' | 'handle' | 'micro',
  ) {
    setTimeout(() => {
      const flickerChar = () => {
        const randomIndex = validIndices[Math.floor(Math.random() * validIndices.length)];

        if (target === 'vision') {
          if (!this.visionFlickerIndices.includes(randomIndex)) {
            this.visionFlickerIndices = [...this.visionFlickerIndices, randomIndex];
          }
          setTimeout(
            () => {
              this.visionFlickerIndices = this.visionFlickerIndices.filter(
                (i) => i !== randomIndex,
              );
            },
            80 + Math.random() * 150,
          );
        } else if (target === 'title') {
          if (!this.flickerActiveIndices.includes(randomIndex)) {
            this.flickerActiveIndices = [...this.flickerActiveIndices, randomIndex];
          }
          setTimeout(
            () => {
              this.flickerActiveIndices = this.flickerActiveIndices.filter(
                (i) => i !== randomIndex,
              );
            },
            80 + Math.random() * 150,
          );
        } else if (target === 'handle') {
          if (!this.handleFlickerIndices.includes(randomIndex)) {
            this.handleFlickerIndices = [...this.handleFlickerIndices, randomIndex];
          }
          setTimeout(
            () => {
              this.handleFlickerIndices = this.handleFlickerIndices.filter(
                (i) => i !== randomIndex,
              );
            },
            80 + Math.random() * 150,
          );
        } else {
          if (!this.microTextFlickerIndices.includes(randomIndex)) {
            this.microTextFlickerIndices = [...this.microTextFlickerIndices, randomIndex];
          }
          setTimeout(
            () => {
              this.microTextFlickerIndices = this.microTextFlickerIndices.filter(
                (i) => i !== randomIndex,
              );
            },
            80 + Math.random() * 150,
          );
        }

        setTimeout(flickerChar, 50 + Math.random() * 120);
      };

      flickerChar();
    }, delay);
  }

  // SVG Lines flickering animation (for graphic-1, graphic-2, graphic-3)
  private svgFlickerIntervals: number[] = [];

  startSvgLinesAnimation() {
    const svgElements = document.querySelectorAll('[data-svg-lines]');

    svgElements.forEach((svg) => {
      const paths = svg.querySelectorAll('path');
      if (paths.length === 0) return;

      // Create multiple flicker loops for each SVG
      for (let loop = 0; loop < 8; loop++) {
        const intervalId = window.setInterval(
          () => {
            const randomPath = paths[Math.floor(Math.random() * paths.length)] as SVGPathElement;
            if (!randomPath) return;

            // Store original style
            const originalColor = randomPath.style.color;
            const originalOpacity = randomPath.style.opacity;
            const originalFilter = randomPath.style.filter || '';

            // Random flicker type
            const flickerType = Math.random();

            if (flickerType < 0.4) {
              // White/bright flicker with glow
              randomPath.style.color = '#ffffff';
              randomPath.style.opacity = (0.6 + Math.random() * 0.4).toString();
              randomPath.style.filter = 'drop-shadow(0 0 3px rgba(255,255,255,0.5))';
            } else if (flickerType < 0.7) {
              // Accent blue/purple flicker with glow
              const hue = 220 + Math.random() * 40; // Blue to purple range
              randomPath.style.color = `hsl(${hue}, 70%, 75%)`;
              randomPath.style.opacity = (0.5 + Math.random() * 0.5).toString();
              randomPath.style.filter = `drop-shadow(0 0 2px hsl(${hue}, 70%, 60%))`;
            } else {
              // Subtle light gray flicker
              const gray = 150 + Math.floor(Math.random() * 100);
              randomPath.style.color = `rgb(${gray}, ${gray}, ${gray})`;
              randomPath.style.opacity = (0.4 + Math.random() * 0.4).toString();
              randomPath.style.filter = '';
            }

            // Restore after random duration
            setTimeout(
              () => {
                randomPath.style.color = originalColor;
                randomPath.style.opacity = originalOpacity;
                randomPath.style.filter = originalFilter;
              },
              50 + Math.random() * 150,
            );
          },
          80 + loop * 30 + Math.random() * 100,
        );

        this.svgFlickerIntervals.push(intervalId);
      }
    });
  }

  // Micro text word animation (for words in micro-text elements)
  startMicroTextWordAnimation() {
    const microTextElements = document.querySelectorAll('[data-micro-text] .split-word');

    microTextElements.forEach((word) => {
      const wordEl = word as HTMLElement;

      // Create random flicker for each word
      const flickerWord = () => {
        const originalColor = wordEl.style.color;
        const originalOpacity = wordEl.style.opacity;

        // Random color/opacity change
        const flickerType = Math.random();

        if (flickerType < 0.3) {
          // Bright white
          wordEl.style.color = '#ffffff';
          wordEl.style.opacity = (0.8 + Math.random() * 0.2).toString();
        } else if (flickerType < 0.5) {
          // Accent color
          const colors = ['rgb(148, 163, 233)', 'rgb(197, 205, 243)', 'rgb(244, 245, 253)'];
          wordEl.style.color = colors[Math.floor(Math.random() * colors.length)];
          wordEl.style.opacity = '0.35';
        } else {
          // Gray variations
          const gray = 73 + Math.floor(Math.random() * 180);
          wordEl.style.color = `rgb(${gray}, ${gray}, ${gray})`;
          wordEl.style.opacity = (0.35 + Math.random() * 0.65).toString();
        }

        // Restore after random duration
        setTimeout(
          () => {
            wordEl.style.color = originalColor;
            wordEl.style.opacity = originalOpacity;
          },
          100 + Math.random() * 200,
        );

        // Schedule next flicker
        setTimeout(flickerWord, 500 + Math.random() * 2000);
      };

      // Start with random delay
      setTimeout(flickerWord, Math.random() * 1000);
    });
  }

  initHeroAnimations() {
    const tl = gsap.timeline({ delay: 0.2 });

    tl.from('.hero-badge', {
      opacity: 0,
      y: -20,
      duration: 0.8,
      ease: 'power3.out',
    })
      .from(
        '.hero-title-line',
        {
          opacity: 0,
          y: 50,
          duration: 1,
          stagger: 0.1,
          ease: 'power3.out',
        },
        '-=0.5',
      )
      .from(
        '.hero-subtitle',
        {
          opacity: 0,
          y: 20,
          duration: 0.8,
          ease: 'power3.out',
        },
        '-=0.6',
      )
      .from(
        '.hero-nav',
        {
          opacity: 0,
          duration: 0.6,
          ease: 'power2.out',
        },
        '-=0.4',
      )
      .from(
        '.hero-scroll-indicator',
        {
          opacity: 0,
          duration: 0.6,
          ease: 'power2.out',
        },
        '-=0.2',
      );
  }

  initScrollAnimations() {
    const isMobile = window.matchMedia('(max-width: 991px)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const useScrubReveal = !isMobile && !prefersReducedMotion;

    // Text reveal: on mobile/reduced-motion use one-shot (no scrub) to avoid jank
    gsap.utils.toArray('.reveal-text').forEach((el: any) => {
      gsap.fromTo(
        el,
        {
          opacity: 0,
          y: 32,
          color: 'rgba(255, 255, 255, 0.25)',
        },
        {
          scrollTrigger: {
            trigger: el,
            start: 'top 90%',
            ...(useScrubReveal
              ? { end: 'top 35%', scrub: 1.4 }
              : { toggleActions: 'play none none none' }),
          },
          opacity: 1,
          y: 0,
          color: 'rgba(255, 255, 255, 1)',
          duration: useScrubReveal ? undefined : 0.7,
          ease: 'power2.out',
        },
      );
    });

    // Fade animations - one-shot on all devices (already smooth)
    gsap.utils.toArray('.reveal-fade').forEach((el: any) => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 24 },
        {
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            toggleActions: 'play none none none',
          },
          opacity: 1,
          y: 0,
          duration: prefersReducedMotion ? 0.3 : 1,
          ease: 'power2.out',
        },
      );
    });

    // Stats counter
    ScrollTrigger.create({
      trigger: '.stats-section',
      start: 'top 70%',
      onEnter: () => {
        if (!this.statsAnimated) {
          this.animateStats();
          this.statsAnimated = true;
        }
      },
    });

    // Parallax only on desktop and when motion is allowed (avoids mobile jank)
    if (!isMobile && !prefersReducedMotion) {
      gsap.to('.orb-1', {
        scrollTrigger: {
          trigger: 'body',
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
        },
        y: -200,
        x: 50,
        ease: 'none',
      });

      gsap.to('.orb-2', {
        scrollTrigger: {
          trigger: 'body',
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1.5,
        },
        y: -150,
        x: -30,
        ease: 'none',
      });

      gsap.to('.orb-3', {
        scrollTrigger: {
          trigger: 'body',
          start: 'top top',
          end: 'bottom bottom',
          scrub: 2,
        },
        y: -100,
        ease: 'none',
      });

      gsap.to('.admission-bg', {
        scrollTrigger: {
          trigger: '.admission-section',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
        y: -80,
        ease: 'none',
      });

      gsap.to('.showcase-video', {
        scrollTrigger: {
          trigger: '.video-showcase-section',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
        y: 100,
        scale: 1.1,
        ease: 'none',
      });

      gsap.to('.break-video', {
        scrollTrigger: {
          trigger: '.video-break-section',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
        y: 80,
        scale: 1.15,
        ease: 'none',
      });
    }

    // Hero video parallax
    // gsap.to('.hero-video', {
    //   scrollTrigger: {
    //     trigger: '.hero-section',
    //     start: 'top top',
    //     end: 'bottom top',
    //     scrub: 1,
    //   },
    //   y: 150,
    //   opacity: 0,
    //   ease: 'none',
    // });

    // Benefits section - sync titles with text
    this.initBenefitsScrollSync();

    // Mobile benefits carousel
    this.initMobileCarousel();
  }

  initBenefitsScrollSync() {
    const benefitsSection = document.querySelector('.benefits-section');
    if (!benefitsSection) return;

    // Set first benefit as active on load so text and titles are visible
    this.setActiveBenefit(1);

    // Pin section while scrolling through it (גלילה נעצרת) and sync left + right
    ScrollTrigger.create({
      trigger: benefitsSection,
      start: 'top top',
      end: 'bottom top',
      pin: true,
      onUpdate: (self) => {
        const progress = self.progress;
        let activeNum = 1;
        if (progress < 0.25) activeNum = 1;
        else if (progress < 0.5) activeNum = 2;
        else if (progress < 0.75) activeNum = 3;
        else activeNum = 4;

        if (this.activeBenefitNumber !== activeNum) {
          this.setActiveBenefit(activeNum);
        }
      },
    });

    // Refresh ScrollTrigger after layout has settled so scroll progress updates correctly
    requestAnimationFrame(() => ScrollTrigger.refresh());
    setTimeout(() => ScrollTrigger.refresh(), 300);

    // Show benefits nav when in section
    const benefitsNav = document.querySelector('.benefits-nav') as HTMLElement;
    if (benefitsNav) {
      ScrollTrigger.create({
        trigger: '.benefits-section',
        start: 'top 80%',
        end: 'bottom 20%',
        onEnter: () => (benefitsNav.style.opacity = '1'),
        onLeave: () => (benefitsNav.style.opacity = '0'),
        onEnterBack: () => (benefitsNav.style.opacity = '1'),
        onLeaveBack: () => (benefitsNav.style.opacity = '0'),
      });
    }
  }

  setActiveBenefit(number: number) {
    this.activeBenefitNumber = number;

    // Update all text elements
    document.querySelectorAll('[data-benefits-text-top]').forEach((el) => {
      const num = el.getAttribute('data-benefits-text-top');
      el.classList.remove('is-active', 'is-exit');
      if (num === String(number)) {
        el.classList.add('is-active');
      } else {
        el.classList.add('is-exit');
      }
    });

    document.querySelectorAll('[data-benefits-text-bottom]').forEach((el) => {
      const num = el.getAttribute('data-benefits-text-bottom');
      el.classList.remove('is-active', 'is-exit');
      if (num === String(number)) {
        el.classList.add('is-active');
      } else {
        el.classList.add('is-exit');
      }
    });

    // Update nav number
    const navNumber = document.querySelector('[data-benefits-number]');
    if (navNumber) {
      navNumber.textContent = `0${number}`;
    }

    // Update left titles – use class so CSS reliably shows active
    document.querySelectorAll('[data-benefits-title]').forEach((el) => {
      const num = el.getAttribute('data-benefits-title');
      const isActive = num === String(number);
      el.classList.remove('is-active-benefit-title');
      if (isActive) el.classList.add('is-active-benefit-title');
    });
  }

  animateStats() {
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;
    let currentStep = 0;

    const animate = () => {
      currentStep++;
      const progress = currentStep / steps;
      const easeProgress = 1 - Math.pow(1 - progress, 4);

      this.statPercentage = Math.round(100 * easeProgress);
      this.statPerformance = Math.round(127 * easeProgress);

      if (currentStep < steps) {
        setTimeout(animate, interval);
      }
    };

    animate();
  }

  setActiveComparison(index: number) {
    this.activeComparisonIndex = index;
  }

  setActiveProcessStep(index: number) {
    this.activeProcessStep = index;
  }

  @HostListener('window:scroll')
  onScroll() {
    this.updateNavScrolledState();
  }

  private updateNavScrolledState() {
    this.isNavScrolled = window.scrollY > 10;
  }

  toggle8VideoMute() {
    this.is8VideoMuted = !this.is8VideoMuted;
  }

  // Mobile Carousel
  currentMobileSlide = 0;
  totalMobileSlides = 4;

  initMobileCarousel() {
    const prevButton = document.querySelector('[data-centered-slider="prev-button"]');
    const nextButton = document.querySelector('[data-centered-slider="next-button"]');
    const slides = document.querySelectorAll('[data-centered-slider="slide"]');

    if (!slides.length) return;

    this.totalMobileSlides = slides.length;

    // Reset slides
    slides.forEach((slide) => {
      (slide as HTMLElement).style.transform = 'none';
      slide.classList.remove('active');
    });

    // Set first slide as active
    this.currentMobileSlide = 0;
    slides[0]?.classList.add('active');

    // Add button listeners
    prevButton?.addEventListener('click', (e) => {
      e.preventDefault();
      this.prevMobileSlide();
    });

    nextButton?.addEventListener('click', (e) => {
      e.preventDefault();
      this.nextMobileSlide();
    });
  }

  setMobileSlide(index: number) {
    const slides = document.querySelectorAll('[data-centered-slider="slide"]');

    if (!slides.length) return;

    // Wrap around
    if (index < 0) index = this.totalMobileSlides - 1;
    if (index >= this.totalMobileSlides) index = 0;

    this.currentMobileSlide = index;

    // Remove active from all slides
    slides.forEach((slide) => slide.classList.remove('active'));

    // Add active to current slide
    slides[index]?.classList.add('active');
  }

  nextMobileSlide() {
    this.setMobileSlide(this.currentMobileSlide + 1);
  }

  prevMobileSlide() {
    this.setMobileSlide(this.currentMobileSlide - 1);
  }
}
