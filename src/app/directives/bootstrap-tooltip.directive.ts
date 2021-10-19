import { AfterViewInit, Directive, ElementRef } from '@angular/core';
import * as bootstrap from 'bootstrap';

@Directive({
  selector: '[appBootstrapTooltip]'
})
export class BootstrapTooltipDirective  implements AfterViewInit{
  tooltip?: bootstrap.Tooltip

  constructor(private elementRef: ElementRef) { }
  
  ngAfterViewInit(): void {
    const el = this.elementRef.nativeElement
    this.tooltip = new bootstrap.Tooltip(el)
  }
}
