import { animate, state, style, transition, trigger } from '@angular/animations';

export class UnitAnimation {
  public static slideDown(offsetY) {
    return trigger('slide-down', [
      state('down', style({ opacity: 1, "margin-top": "0px" })),
      transition('void => down', [
        style({ opacity: 0, "margin-top": offsetY + "px" }),
        animate('.2s ease-out')
      ]),
      transition('down => void', [
        animate('.2s ease-out', style({ opacity: 0, "margin-top": offsetY + "px" }))
      ])
    ]
    )
  }
  public static expandDown() {
    return trigger('expand', [
      state('down', style({ opacity: 1, "margin-top": "0px" })),
      transition('void => down', [
        style({ opacity: 0, "margin-top": -10 + "px" }),
        animate('.4s ease-out')
      ]),
      transition('down => void', [
        animate('0s ease-out', style({ opacity: 0, "margin-top": -10 + "px" }))
      ])
    ])
  }
}