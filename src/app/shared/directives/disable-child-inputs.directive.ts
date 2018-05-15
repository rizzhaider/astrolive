import { Directive, HostListener, ElementRef, Renderer2 } from '@angular/core';
@Directive({
    selector: '[app-disable-child-inputs]',
})
export class DisableChildInputsDirective {
    constructor(private elRef: ElementRef, private renderer: Renderer2) { }
    
    ngOnInit() {
        let elements : any[] = this.elRef.nativeElement.getElementsByTagName('input');
        for(var i = 0; i < elements.length; i++){
             this.renderer.setAttribute(elements[i], 'disabled', 'disabled');
          }
   }
}