import { Directive, Input, ElementRef, OnChanges } from '@angular/core';

@Directive({
  selector: '[appApplicationStatus]'
})
export class ApplicationStatusDirective implements OnChanges {
  @Input() isClicked;
  constructor(public element: ElementRef) { }

  ngOnChanges(changes: any): void {
    if (this.isClicked) {
      this.element.nativeElement.firstElementChild.style.backgroundColor = '#FFFFFF';
      this.element.nativeElement.firstElementChild.style.border = '2px solid #598CF5';
      this.element.nativeElement.firstElementChild.style.color = '#598CF5';
    } else {
      this.element.nativeElement.firstElementChild.style.backgroundColor = '#F2F5FA';
      this.element.nativeElement.firstElementChild.style.border = '2px solid #F2F5FA';
      this.element.nativeElement.firstElementChild.style.color = '#4C617C';
    }
  }
}
