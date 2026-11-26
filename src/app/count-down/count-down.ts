import { Component, OnInit, OnDestroy, ChangeDetectorRef, ElementRef } from '@angular/core';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-count-down',
  templateUrl: './count-down.html',
  styleUrl: './count-down.scss',
  standalone: false
})
export class CountDown implements OnInit, OnDestroy {
  weddingDate: number = new Date(2026, 11, 13, 9, 30, 0).getTime();
  flipping: Record<string, boolean> = { days: false, hours: false, minutes: false, seconds: false };

  googleCalendarUrl =
  'https://calendar.google.com/calendar/render?action=TEMPLATE' +
  '&text=Sowndarya+Gowda+D+M+%26+Pramoda+K+M+Wedding' +
  '&dates=20261213T040000Z/20261213T050000Z' +
  '&details=Wedding+Muhurtham:+13+Dec+2026,+9:30+AM+to+10:30+AM.%0AReception:+12+Dec+2026,+7:00+PM+onwards.' +
  '&location=Nanjamma+Muddegowda+Samudaya+Bhavana,+MF8H%2B5R4,+Krishnarajpete,+Karnataka+571426';

  downloadIcs(): void {
    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'BEGIN:VEVENT',
      'DTSTART:20261213T040000Z',
      'DTEND:20261213T050000Z',
      'SUMMARY:Sowndarya Gowda D M & Pramoda K M Wedding Muhurtham',
      'DESCRIPTION:Wedding Muhurtham from 9:30 AM to 10:30 AM. Reception: 12 Dec 2026 from 7:00 PM onwards.',
      'LOCATION:Nanjamma Muddegowda Samudaya Bhavana, MF8H+5R4, Krishnarajpete, Karnataka 571426',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([ics], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sowndarya-pramod-wedding.ics';
    a.click();
    URL.revokeObjectURL(url);
  }

  days: number = 0;
  hours: number = 0;
  minutes: number = 0;
  seconds: number = 0;
  isVisible = false;

  private timeSubscription?: Subscription;
  private visibilityObserver?: IntersectionObserver;

  constructor(private cdr: ChangeDetectorRef, private el: ElementRef) {}

  ngOnInit(): void {
    this.updateCountdown();
    this.timeSubscription = interval(1000).subscribe(() => {
      this.updateCountdown();
      this.cdr.markForCheck();
    });

    this.visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          this.isVisible = true;
          this.cdr.markForCheck();
          this.visibilityObserver?.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    this.visibilityObserver.observe(this.el.nativeElement);
  }

  ngOnDestroy(): void {
    this.timeSubscription?.unsubscribe();
    this.visibilityObserver?.disconnect();
  }

  private updateCountdown(): void {
    const now = new Date().getTime();
    const distance = this.weddingDate - now;

    if (distance < 0) {
      this.days = this.hours = this.minutes = this.seconds = 0;
      if (this.timeSubscription) this.timeSubscription.unsubscribe();
      return;
    }

    const newDays    = Math.floor(distance / (1000 * 60 * 60 * 24));
    const newHours   = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const newMinutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const newSeconds = Math.floor((distance % (1000 * 60)) / 1000);

    if (newDays    !== this.days)    this.flash('days');
    if (newHours   !== this.hours)   this.flash('hours');
    if (newMinutes !== this.minutes) this.flash('minutes');
    if (newSeconds !== this.seconds) this.flash('seconds');

    this.days    = newDays;
    this.hours   = newHours;
    this.minutes = newMinutes;
    this.seconds = newSeconds;
  }

  private flash(key: string): void {
    this.flipping[key] = true;
    setTimeout(() => {
      this.flipping[key] = false;
      this.cdr.markForCheck();
    }, 380);
  }
}
