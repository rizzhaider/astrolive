import { Directive, Output, HostListener, ElementRef, Renderer2, EventEmitter } from '@angular/core';
@Directive({
    selector: '[app-detect-enter]'
})
export class DetectEnterDirective {
    @Output('onEnterPressed') onEnterPressed: EventEmitter<void> = new EventEmitter<void>();
    constructor(private elRef: ElementRef, private renderer: Renderer2) { }
    ngOnInit() {
    }

    @HostListener('window:keydown', ['$event'])
    keyboardInput(event: KeyboardEvent) {
        if (this.elRef.nativeElement.contains(event.target)) { // or some similar check {
            if (event.keyCode === 13) {
                this.onEnterPressed.emit();
            }

        }
    }
}