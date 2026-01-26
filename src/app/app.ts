import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

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
  imports: [CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit, AfterViewInit, OnDestroy {
  // Typewriter
  typewriterWords = ['redefine', 'reconstruct', 'reconfigure'];
  currentWordIndex = 0;
  currentWord = '';
  isDeleting = false;

  // Flicker animation for "our vision"
  visionTitleChars = `Strategic Minerals • Gold • Diamonds • Rare Earths •
Extraction • Export • Investment
Cobalt | Copper | Gold | Diamonds | Coltan (Tantalum) | Tin |
Tungsten | Lithium | Zinc | Manganese | Nickel | Uranium |
Iron Ore | Bauxite | Phosphate | Coal | Limestone | Crude Oil
| Natural Gas | Hydropower`.split('');
  visionFlickerIndices: number[] = [];

  // Flicker animation for Titangate Equity
  titangateTitleChars = `Nissim Trust Banking Group Launching 2027
Bold Capital Meets Real Impact
Provision of early-stage and growth capital financing across
Africa
• Trade finance, structured finance, invoices, and bespoke
financial solutions
• Heavy machinery financing and large-scale infrastructure
and industrial project funding
• Factoring, letters of credit, invoices, commodity trade
finance, and end-to-end transaction support`.split('');
  flickerActiveIndices: number[] = [];

  // Flicker animation for @titangate_Equity
  handleTitleChars = '8 AI — Advanced Intelligence, Data, Systems, Government Projects'.split('');
  handleFlickerIndices: number[] = [];

  // Flicker animation for status bar
  statusFlickerIndices: number[][] = [[], [], [], [], []];
  statusTexts = [
    'INITIALIZING...',
    'ACCESS DENIED',
    'TGE | TITANGATE EQUITY',
    '001 ▓▓▓ A NEW CLASS',
    'INITIALIZING...',
  ];

  // Flicker animation for micro text (word-level)
  microTextWords = [
    'Commodities',
    '&amp;',
    'Global',
    'Trade',

    'Energy',
    '&amp;',
    'Agriculture',
    '•',
    'Structured',
    'Finance',
    '•',
    'Global',
    'Market',
    'Reach',
  ];
  microTextFlickerIndices: number[] = [];

  // Stats
  statsAnimated = false;
  statPercentage = 0;
  statPerformance = 0;

  // Loading
  isLoading = true;
  loadingText = 'Legacy • Momentum • Impact • Execution';
  loadingDots = '';

  // Video Sound Toggle
  isVideoMuted = true;
  is8VideoMuted = true;

  toggleVideoMute() {
    this.isVideoMuted = !this.isVideoMuted;
  }

  // Navigation
  navKeywords = ['Vision', 'Opportunities', 'Pioneers', 'Manifesto'];

  // Split text into characters for animation
  splitToChars(text: string): string[] {
    return text.split('');
  }

  // Industries
  industries: Industry[] = [
    { name: 'Artificial Intelligence', icon: '◈' },
    { name: 'Financial Technology', icon: '◇' },
    { name: 'Space Exploration', icon: '✧' },
    { name: 'Enterprise Infrastructure', icon: '▣' },
    { name: 'Healthcare', icon: '✚' },
    { name: 'Biotech', icon: '◉' },
    { name: 'Next-Gen Defense', icon: '◆' },
    { name: 'Cybersecurity', icon: '⬡' },
  ];

  // Process
  processSteps: ProcessStep[] = [
    { number: '01', title: 'Selection', description: 'We find you.' },
    {
      number: '02',
      title: 'Alignment',
      description: 'Onboarding process to align capital, vision, and opportunity.',
    },
    {
      number: '03',
      title: 'Access',
      description: 'Gain entry to elite opportunities, secured and tokenized.',
    },
    {
      number: '04',
      title: 'Compounding',
      description: 'Your wealth compounds seamlessly while we carry the weight.',
    },
  ];

  // Comparisons
  comparisons: Comparison[] = [
    {
      title: 'Enforcement vs Empty Promises',
      newWorld: 'Smart contracts enforce execution. If a deal dies, funds return instantly.',
      oldWorld: 'Deals vanish, buyers drop out, funds sit idle for weeks.',
    },
    {
      title: 'Stewardship vs Neglect',
      newWorld:
        'Every member is sovereign. Direct response, personal care, white-glove stewardship.',
      oldWorld: 'Ghosted by "support," brokers ignore you, capital disposable.',
    },
    {
      title: 'Flexibility vs One-Size-Fits-All',
      newWorld:
        'We bend the market to your will. Bespoke allocations, liquidity pathways, access to "impossible" companies.',
      oldWorld: "You take what's given. No customization, no choice, no strategy.",
    },
    {
      title: 'Liquidity vs Captivity',
      newWorld:
        'Liquidity is engineered. Immediate exits, alternative pathways, seamless peer-to-peer trading.',
      oldWorld:
        'No updates, no timelines, no exits. Years locked waiting for IPOs that may never come.',
    },
  ];

  activeComparisonIndex = 0;
  activeProcessStep = 0;

  // Benefits section - active item sync
  activeBenefitNumber = 1;

  ngOnInit() {
    this.startLoadingAnimation();
  }

  ngAfterViewInit() {
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
    }, 6000);
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
    this.statusTexts.forEach((text, textIndex) => {
      const statusIndices = text
        .split('')
        .map((char, i) => (char !== ' ' ? i : -1))
        .filter((i) => i !== -1);
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
    // Text reveal animations - color shift from muted to white
    gsap.utils.toArray('.reveal-text').forEach((el: any) => {
      gsap.fromTo(
        el,
        {
          opacity: 0,
          y: 40,
          color: 'rgba(255, 255, 255, 0.3)',
        },
        {
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            end: 'top 60%',
            scrub: 0.5,
          },
          opacity: 1,
          y: 0,
          color: 'rgba(255, 255, 255, 1)',
          ease: 'power2.out',
        },
      );
    });

    // Fade animations
    gsap.utils.toArray('.reveal-fade').forEach((el: any) => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 30 },
        {
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
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

    // Background parallax on orbs
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

    // Admission parallax
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

    // Video parallax effects
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
    const benefitsLeft = document.querySelector('.benefits-left-inner');
    if (!benefitsLeft) return;

    // Create a single ScrollTrigger that tracks progress through the section
    ScrollTrigger.create({
      trigger: benefitsLeft,
      start: 'top center',
      end: 'bottom center',
      onUpdate: (self) => {
        // Calculate which benefit should be active based on scroll progress
        const progress = self.progress;
        let activeNum = 1;

        if (progress < 0.25) {
          activeNum = 1;
        } else if (progress < 0.5) {
          activeNum = 2;
        } else if (progress < 0.75) {
          activeNum = 3;
        } else {
          activeNum = 4;
        }

        if (this.activeBenefitNumber !== activeNum) {
          this.setActiveBenefit(activeNum);
        }
      },
    });

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

    // Update titles opacity
    document.querySelectorAll('[data-benefits-title]').forEach((el) => {
      const num = el.getAttribute('data-benefits-title');
      (el as HTMLElement).style.opacity = num === String(number) ? '1' : '0.3';
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
    // Scroll events handled by GSAP ScrollTrigger
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
