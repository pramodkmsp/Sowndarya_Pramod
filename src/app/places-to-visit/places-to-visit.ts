import { Component, OnInit, ElementRef } from '@angular/core';

export interface Place {
  name: string;
  tagline: string;
  description: string;
  distance: string;
  duration: string;
  imageUrl: string;
  imageAlt: string;
  mapsUrl: string;
  tags: string[];
}

@Component({
  selector: 'app-places-to-visit',
  standalone: false,
  templateUrl: './places-to-visit.html',
  styleUrl: './places-to-visit.scss',
})
export class PlacesToVisit implements OnInit {
  isVisible = false;

  places: Place[] = [
    {
      name: 'Krishna Raja Sagara Dam & Brindavan Gardens',
      tagline: 'KRS Dam & Brindavan Gardens',
      description:
        'The Krishna Raja Sagara (KRS) Dam is a major gravity dam on the Kaveri River in Karnataka. Completed in 1932, it was designed by the visionary engineer Sir M. Visvesvaraya. It spans 8,600 feet, rises 130 feet, and is a vital lifeline supplying drinking water and irrigation to Mysuru, Mandya, and Bengaluru.',
      distance: '48 km',
      duration: '1–2 hrs',
      imageUrl: 'KRS.jpg',
      imageAlt: 'KRS Dam & Brindavan Gardens close to Mysore',
      mapsUrl: 'https://maps.google.com/?q=Krishna+Raja+Sagara+Dam+Mandya+Karnataka',
      tags: ['Dam', 'Sunset', 'Gardens'],
    },
    {
      name: 'Yedamuri Falls',
      tagline: "Yedamuri Falls (Edmuri) is a serene Cauvery River cascade.",
      description:
        'Visitors say this waterfall is a beautiful and peaceful spot with clean, cold water, ideal for playing and swimming, especially for families and kids. They also highlight the availability of nearby food stalls offering delicious fish kababs and convenient parking.',
      distance: '53 km',
      duration: '1-2 hrs',
      imageUrl: 'EdmuriFalls.jpg',
      imageAlt: 'Peaceful spot with clean, cold water, ideal for playing and swimming near Mysore',
      mapsUrl: 'https://maps.google.com/?q=Yedamuri+Falls+Hongahalli+Karnataka',
      tags: ['Nature', 'Waterfall', 'Seafood'],
    },
    {
      name: 'Mysore Palace',
      tagline: 'The magnificent royal palace of the Wadiyar dynasty.',
      description:
        'Mysore Palace, also known as Amba Vilas Palace, is a historic palace and royal residence located in Mysore, Karnataka, India. It served as the official residence of the Wadiyar dynasty and the seat of the Kingdom of Mysore, and was commissioned by Krishnaraja Wodeyar IV in August 1897.',
      distance: '68 km',
      duration: '2–3 hrs',
      imageUrl: 'MysorePalace.jpg',
      imageAlt: 'The magnificent Mysore Palace illuminated in the evening',
      mapsUrl: 'https://maps.google.com/?q=Mysore+Palace+Mysuru+Karnataka',
      tags: ['Heritage', 'Architecture', 'Royal Palace'],
    },
    {
      name: 'Shravanabelagola',
      tagline: 'Home to the majestic monolithic statue of Lord Bahubali.',
      description:
        'Visitors are inspired by the towering 57-foot statue of Lord Bahubali, one of the world’s tallest monolithic sculptures. The hilltop offers breathtaking panoramic views, a peaceful spiritual atmosphere, and an unforgettable climb of over 600 ancient stone steps.',
      distance: '14 km',
      duration: '0.5 hrs',
      imageUrl: 'Shravanabelagola.jpg',
      imageAlt: 'The iconic Bahubali statue atop Vindhyagiri Hill at Shravanabelagola',
      mapsUrl: 'https://maps.google.com/?q=Shravanabelagola+Karnataka',
      tags: ['Heritage', 'Jain Temple', 'Hilltop'],
    },
    {
      name: 'Melkote',
      tagline: 'A sacred hill town known for its ancient temples and scenic beauty.',
      description:
        'Visitors cherish Melkote for its peaceful atmosphere, the historic Cheluvanarayana Swamy Temple, and the hilltop Yoga Narasimha Temple offering spectacular panoramic views. The town is also famous for its rich heritage, traditional architecture, and delicious temple prasadam.',
      distance: '45 km',
      duration: '1-2 hrs',
      imageUrl: 'Melkote.jpg',
      imageAlt: 'The historic Cheluvanarayana Swamy Temple and scenic hill views at Melkote',
      mapsUrl: 'https://maps.google.com/?q=Melkote+Karnataka',
      tags: ['Temple', 'Heritage', 'Hilltop'],
    },
    {
      name: 'Hemagiri Waterfalls',
      tagline: 'A hidden seasonal waterfall surrounded by lush greenery.',
      description:
        'Visitors enjoy Hemagiri Waterfalls for its peaceful atmosphere, refreshing natural surroundings, and scenic beauty during the monsoon season. It is an ideal spot for nature lovers, photography enthusiasts, and anyone looking for a quiet getaway away from the city.',
      distance: '18 km',
      duration: '0.5–1 hrs',
      imageUrl: 'Hemagiri.jpg',
      imageAlt: 'Hemagiri Waterfalls surrounded by lush greenery during the monsoon',
      mapsUrl: 'https://maps.google.com/?q=Hemagiri+Waterfalls+Karnataka',
      tags: ['Nature', 'Waterfall', 'Photography'],
    },
  ];

  constructor(private el: ElementRef) {}

  onImgError(event: Event, place: Place): void {
    const img = event.target as HTMLImageElement;
    img.classList.add('img-error');
    const wrapper = img.closest('.place-card__photo') as HTMLElement;
    if (wrapper) {
      wrapper.classList.add('has-error');
      // Set emoji fallback based on tags
      const emoji = place.tags.includes('Beach') ? '🏖️'
        : place.tags.includes('Forest') ? '🌿'
        : place.tags.includes('Temple') ? '🛕'
        : place.tags.includes('Wildlife') ? '🦜'
        : place.tags.includes('Heritage') ? '🏛️'
        : '📍';
      wrapper.setAttribute('data-fallback', emoji);
    }
  }

  ngOnInit(): void {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          this.isVisible = true;
          observer.disconnect();
        }
      },
      { threshold: 0.08 }
    );
    observer.observe(this.el.nativeElement);
  }
}
