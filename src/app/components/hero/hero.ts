import { Component, AfterViewInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-hero',
  standalone: false,
  templateUrl: './hero.html',
  styleUrl: './hero.scss',
})
export class Hero implements AfterViewInit, OnDestroy {
  @ViewChild('heroVideo') private videoRef!: ElementRef<HTMLVideoElement>;

  private visibilityHandler = () => {
    if (!document.hidden) {
      this.tryPlay();
    }
  };

  private tryPlay(): void {
    const video = this.videoRef?.nativeElement;
    if (video && video.paused) {
      video.play().catch(() => {});
    }
  }

  ngAfterViewInit(): void {
    const video = this.videoRef?.nativeElement;
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.autoplay = true;

    // Retry on load
    video.addEventListener('loadeddata', () => video.play().catch(() => {}), { once: true });
    video.addEventListener('canplay', () => video.play().catch(() => {}), { once: true });

    // Retry when tab becomes visible again (covers iOS background pause)
    document.addEventListener('visibilitychange', this.visibilityHandler);

    // Retry when element enters viewport
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        video.play().catch(() => {});
        observer.disconnect();
      }
    });
    observer.observe(video);
  }

  ngOnDestroy(): void {
    document.removeEventListener('visibilitychange', this.visibilityHandler);
  }
}
