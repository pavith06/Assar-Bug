import { Directive, EventEmitter, HostListener, Output, ElementRef } from "@angular/core";


@Directive({
  selector: '[appClickOutside]'
})
export class ClickOutsideDirective {

  constructor(private elementRef: ElementRef) { }

  @Output() clickOutside = new EventEmitter<MouseEvent>();
  @Output() clickOutside1 = new EventEmitter<MouseEvent>();

  @HostListener('document:click', ['$event', '$event.target'])
  public onClick(event: MouseEvent, targetElement: HTMLElement): void {
      if (!targetElement) {
          return;
      }
      const clickedInside = this.elementRef.nativeElement.contains(targetElement);
      const chipGridColumn = targetElement.classList.contains('cbt-harsha');
      let checkCalender = false
        if (targetElement.ariaHidden || targetElement.className?.includes("mat") || targetElement.className?.includes("mdc") ) {
          checkCalender = true
        }

      if (!clickedInside && (!chipGridColumn && !checkCalender) ) {
          this.clickOutside.emit(event);
          this.clickOutside1.emit(event);

      }
  }
}
