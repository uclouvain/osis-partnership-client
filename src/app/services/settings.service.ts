import { ElementRef, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private elementRef: ElementRef;

  constructor() {
  }

  set(ref: ElementRef) {
    this.elementRef = ref;
  }

  get(prop, defaultValue) {
    return this.elementRef.nativeElement.getAttribute('data-' + prop) || defaultValue;
  }
}
