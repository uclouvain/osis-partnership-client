import { ElementRef, Injectable } from '@angular/core';

/**
 * Service that reads into the data-* properties of an element
 */
@Injectable({
  providedIn: 'root'
})
export class HtmlElementPropertyService {
  private elementRef: ElementRef;

  constructor() {
  }

  set(ref: ElementRef) {
    this.elementRef = ref;
  }

  get(prop, defaultValue) {
    if (this.elementRef) {
      return this.elementRef.nativeElement.getAttribute('data-' + prop) || defaultValue;
    } else {
      return defaultValue;
    }
  }
}
