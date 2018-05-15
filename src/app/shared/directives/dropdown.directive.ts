import { Directive, HostListener, ElementRef, Renderer2 } from '@angular/core';
@Directive({
    selector: '[app-dropdown]',
    host: {
        // Track mouse click at the global level.
        "(document: click)": "handleEvent( $event )",
    }
})
export class DropDownDirective {
    constructor(private elRef: ElementRef, private renderer: Renderer2) { }
    private opened: boolean = false;
    ngOnInit() {
        this.renderer.removeClass(this.elRef.nativeElement, 'open');
        this.opened = false;
    }

    // @HostListener('click') onclick() {
    //     if (this.opened) {
    //         console.log('clicked inside opened');
    //         this.renderer.removeClass(this.elRef.nativeElement, 'open');
    //     } else {
    //         console.log('clicked inside closed');
    //         this.renderer.addClass(this.elRef.nativeElement, 'open');
    //     }
    //     this.opened = !this.opened;

    // }

    handleEvent(event) {
        if (!this.elRef.nativeElement.contains(event.target)) { // or some similar check {
            if (this.opened) {
                this.renderer.removeClass(this.elRef.nativeElement, 'open');
                this.opened = !this.opened;
            }

        } else {
            if (this.opened) {
                this.renderer.removeClass(this.elRef.nativeElement, 'open');
            } else {
                this.renderer.addClass(this.elRef.nativeElement, 'open');
            }
            this.opened = !this.opened;
        }

    }
}