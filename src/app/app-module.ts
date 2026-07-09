import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule, DecimalPipe } from '@angular/common';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { Hero } from './components/hero/hero';
import { RsvpButton } from './components/rsvp-button/rsvp-button';
import { SectionDivider } from './components/section-divider/section-divider';
import { LoadingSpinner } from './components/loading-spinner/loading-spinner';
import { Invitation } from './components/invitation/invitation';
import { CountDown } from './count-down/count-down';
import { Venue } from './venue/venue';
import { Couple } from './couple/couple';
import { PlacesToVisit } from './places-to-visit/places-to-visit';
import { PhotoMoment } from './components/photo-moment/photo-moment';

@NgModule({
  declarations: [
    App,
    Hero,
    RsvpButton,
    SectionDivider,
    LoadingSpinner,
    Invitation,
    CountDown,
    Venue,
    Couple,
    PlacesToVisit,
    PhotoMoment,
  ],
  imports: [BrowserModule, CommonModule, AppRoutingModule],
  providers: [provideBrowserGlobalErrorListeners(), DecimalPipe],
  bootstrap: [App],
})
export class AppModule {}
