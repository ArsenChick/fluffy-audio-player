import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[fluffyBeatScaleHost]',
})
export class BeatScaleHostDirective {
  constructor(public viewContainerRef: ViewContainerRef) { }
}
