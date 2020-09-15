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

  /**
   * Attach the original element
   */
  setRef(ref: ElementRef) {
    this.elementRef = ref;
  }

  /**
   * Get data-* property value form element, if exists.
   *
   * @param prop The property name
   * @param defaultValue The default value if the property is not found in data
   */
  get(prop: string, defaultValue?: any) {
    if (this.elementRef) {
      return this.elementRef.nativeElement.getAttribute('data-' + prop) || defaultValue;
    } else {
      return defaultValue;
    }
  }
}
