import { Directive, HostListener, ElementRef, Renderer2 } from '@angular/core';
@Directive({
    selector: '[app-sidebar-collapse]'
})
export class SidebarCollapseDirective {
    constructor(private elRef: ElementRef, private renderer: Renderer2) { }
    private opened: boolean = false;
    ngOnInit() {
        this.renderer.removeClass(this.elRef.nativeElement, 'sidebar-collapse');
        this.opened = false;
    }

    @HostListener('click') onclick() {
        if (this.opened) {
            this.renderer.removeClass(this.elRef.nativeElement, 'sidebar-collapse');
        } else {
            this.renderer.addClass(this.elRef.nativeElement, 'sidebar-collapse');
        }
        this.opened = !this.opened;
        
      }
}