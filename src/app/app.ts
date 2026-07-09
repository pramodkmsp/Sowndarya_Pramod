import { Component, OnInit, AfterViewInit, OnDestroy, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';

interface BurstPetal {
  angle: string;
  distance: string;
  size: string;
  delay: string;
}

interface BurstHeart {
  left: string;
  size: string;
  delay: string;
  drift: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.scss'
})
export class App implements OnInit, AfterViewInit, OnDestroy {
  isLoading = false;
  isMuted = false;
  showBurst = false;
  burstPetals: BurstPetal[] = [];
  burstHearts: BurstHeart[] = [];

  @ViewChild('bgMusic') private bgMusic!: ElementRef<HTMLAudioElement>;
  private revealElements: HTMLElement[] = [];
  private scrollRafId: number | null = null;
  private onScrollHandler?: () => void;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.burstPetals = Array.from({ length: 20 }, (_, i) => ({
      angle: `${(i * 360 / 20) + (Math.random() * 18 - 9)}deg`,
      distance: `${130 + Math.random() * 120}px`,
      size: `${14 + Math.random() * 18}px`,
      delay: `${Math.random() * 0.25}s`,
    }));

    this.burstHearts = Array.from({ length: 12 }, (_, i) => ({
      left: `${20 + Math.random() * 60}%`,
      size: `${16 + Math.random() * 20}px`,
      delay: `${i * 0.1}s`,
      drift: `${(Math.random() - 0.5) * 120}px`,
    }));
  }

  playAudio(): void {
    const audio = this.bgMusic?.nativeElement;
    if (audio) {
      audio.volume = 0.4;
      audio.play().catch((e) => console.warn('Audio play failed:', e));
    }
  }

  onInvitationOpened(): void {
    this.showBurst = true;
    this.cdr.detectChanges();
    setTimeout(() => {
      this.showBurst = false;
      this.cdr.detectChanges();
    }, 3500);
  }

  toggleMusic(): void {
    const audio = this.bgMusic?.nativeElement;
    if (!audio) return;
    this.isMuted = !this.isMuted;
    audio.muted = this.isMuted;
  }

  ngAfterViewInit(): void {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
        }
      }),
      { threshold: [0.1, 0.2, 0.45, 0.7], rootMargin: '0px 0px -8% 0px' }
    );
    this.revealElements = Array.from(document.querySelectorAll('.reveal')) as HTMLElement[];
    this.revealElements.forEach(el => observer.observe(el));

    const onScroll = () => {
      if (this.scrollRafId !== null) return;
      this.scrollRafId = window.requestAnimationFrame(() => {
        this.scrollRafId = null;
        this.updateRevealProgress();
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    this.updateRevealProgress();

    // Keep cleanup reference on the instance.
    this.onScrollHandler = onScroll;
  }

  ngOnDestroy(): void {
    const onScroll = this.onScrollHandler;
    if (onScroll) {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    }
    if (this.scrollRafId !== null) {
      window.cancelAnimationFrame(this.scrollRafId);
      this.scrollRafId = null;
    }
  }

  private updateRevealProgress(): void {
    const viewportH = window.innerHeight || 1;
    this.revealElements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      const raw = (viewportH - rect.top) / (viewportH + rect.height * 0.35);
      const progress = Math.min(1, Math.max(0, raw));
      el.style.setProperty('--reveal-progress', progress.toFixed(3));
    });
  }
}
