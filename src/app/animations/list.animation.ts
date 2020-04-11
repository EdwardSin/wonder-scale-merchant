import { trigger, style, transition, keyframes, animate, query, stagger } from '@angular/animations';
export class ListAnimation{
    public static LIST_DROP_DOWN = trigger('listAnimation', [
        transition('* => *', [
          query(':enter', style({ opacity: 0 }), { optional: true }),
          query(
            ':enter',
            stagger('0.3s', [
              animate(
                '0.3s ease-in',
                keyframes([
                  style({ opacity: 0, transform: 'translateY(-25%)', offset: 0 }),
                  style({ opacity: 1, transform: 'translateY(0)', offset: 1.0 })
                ])
              )
            ]),
            { optional: true }
          ),
          query(
            ':leave',
            stagger('0.3s', [
              animate(
                '0.3s ease-in',
                keyframes([
                  style({ opacity: 1, offset: 0 }),
                  style({ opacity: 0, offset: 1.0 })
                ])
              )
            ]),
            { optional: true }
          )
        ])
      ]);

      public static ITEM_DROP_DOWN = trigger('itemAnimation', [
        transition('* => *', [
          query(
            ':leave',
            stagger('0.3s', [
              animate(
                '0.3s ease-in',
                keyframes([
                  style({ opacity: 1, offset: 0 }),
                  style({ opacity: 0, offset: 1.0 })
                ])
              )
            ]),
            { optional: true }
          )
        ])
      ])
      public static WS_ITEMS_DROP = trigger('ws-items-drop', [
        transition('* => *', [
          query(':enter', style({ opacity: 0 }), { optional: true }),
          query(
            ':enter',
            stagger('0.1s', [
              animate(
                '0.2s ease-in',
                keyframes([
                  style({ opacity: 0, offset: 0 }),
                  style({ opacity: 1, offset: 1.0 })
                ])
              )
            ]),
            { optional: true }
          )
        ])
      ]);
}