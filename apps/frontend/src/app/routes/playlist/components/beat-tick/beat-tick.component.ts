import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
} from '@angular/core';
import {
  animate,
  state,
  style,
  transition,
  trigger
} from '@angular/animations';

import { ANIMATION_DURATION_MS } from '../../constants/audio-events.const';

@Component({
  selector: 'fluffy-beat-tick',
  templateUrl: './beat-tick.component.html',
  styleUrls: ['./beat-tick.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('beatTrigger', [
      state('finish', style({
        left: 'calc(100% - 2em)'
      })),
      transition('* => finish', [
        style({
          left: '-2.5em',
        }),
        animate(`${ANIMATION_DURATION_MS}ms`)
      ])
    ])
  ]
})
export class BeatTickComponent implements OnInit {
  trigger = false;

  ngOnInit() {
    this.trigger = true;
  }
}
