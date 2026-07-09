import { Component, OnInit, ElementRef } from '@angular/core';

@Component({
  selector: 'app-couple',
  standalone: false,
  templateUrl: './couple.html',
  styleUrl: './couple.scss',
})
export class Couple implements OnInit {
  isVisible = false;

  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          this.isVisible = true;
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(this.el.nativeElement);
  }
}
