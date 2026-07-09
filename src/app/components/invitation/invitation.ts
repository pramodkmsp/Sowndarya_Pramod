import { Component, Output, EventEmitter, OnDestroy, AfterViewInit, ViewChild, ElementRef } from '@angular/core';

interface Spark {
  x: string; y: string; size: string; color: string;
  animationDelay: string; animationDuration: string;
}

interface Ember {
  x: string; y: string; size: string;
  animationDelay: string; animationDuration: string;
}

@Component({
  selector: 'app-invitation',
  standalone: false,
  templateUrl: './invitation.html',
  styleUrl: './invitation.scss',
})
export class Invitation implements OnDestroy, AfterViewInit {
  @Output() opened = new EventEmitter<void>();
  @Output() envelopeClicked = new EventEmitter<void>();
  @ViewChild('inviteVideo') private inviteVideoRef!: ElementRef<HTMLVideoElement>;

  state: 'idle' | 'opening' | 'expanding' | 'done' = 'idle';

  private readonly isMobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches;
  private readonly sparkCount = this.isMobile ? 16 : 28;
  private readonly emberCount = this.isMobile ? 7 : 12;

  sparks: Spark[] = Array.from({ length: this.sparkCount }, (_, i) => {
    const angle = -88 + (i / (this.sparkCount - 1)) * 176;
    const rad = (angle * Math.PI) / 180;
    const dist = 120 + (i % 6) * 40;
    return {
      x: `${(Math.sin(rad) * dist).toFixed(1)}px`,
      y: `${(-Math.cos(rad) * dist).toFixed(1)}px`,
      size: `${4 + (i % 5) * 2}px`,
      color: `hsl(${15 + (i % 7) * 8},100%,${55 + (i % 3) * 12}%)`,
      animationDelay: `${(i % 9) * 0.07}s`,
      animationDuration: `${0.65 + (i % 5) * 0.13}s`,
    };
  });

  embers: Ember[] = Array.from({ length: this.emberCount }, (_, i) => {
    const angle = -70 + (i / (this.emberCount - 1)) * 140;
    const rad = (angle * Math.PI) / 180;
    const dist = 180 + (i % 4) * 55;
    return {
      x: `${(Math.sin(rad) * dist).toFixed(1)}px`,
      y: `${(-Math.cos(rad) * dist).toFixed(1)}px`,
      size: `${8 + (i % 4) * 6}px`,
      animationDelay: `${i * 0.11}s`,
      animationDuration: `${1.1 + (i % 4) * 0.2}s`,
    };
  });
  private timeoutId?: any;
  private expandTimeoutId?: any;

  onEnvelopeClick(): void {
    if (this.state !== 'idle') return;
    this.envelopeClicked.emit();
    this.state = 'opening';

    // Flap opens in 2.5s. Letter slides up at 1.5s delay + 1.2s anim = done at 2.7s.
    // Expand at 2900ms so the letter is fully risen before going fullscreen.
    this.timeoutId = setTimeout(() => {
      this.state = 'expanding';
      this.expandTimeoutId = setTimeout(() => {
        this.state = 'done';
        this.opened.emit();
      }, 150);
    }, 2900);
  }

  ngOnDestroy(): void {
    if (this.timeoutId) clearTimeout(this.timeoutId);
    if (this.expandTimeoutId) clearTimeout(this.expandTimeoutId);
  }

  ngAfterViewInit(): void {
    const video = this.inviteVideoRef?.nativeElement;
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.autoplay = true;

    const tryPlay = () => video.play().catch(() => {});

    video.addEventListener('loadeddata', tryPlay, { once: true });
    video.addEventListener('canplay', tryPlay, { once: true });

    // Resume if browser paused it when tab was hidden
    const onVisible = () => { if (!document.hidden) tryPlay(); };
    document.addEventListener('visibilitychange', onVisible);

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        tryPlay();
        observer.disconnect();
      }
    });
    observer.observe(video);
  }
}
