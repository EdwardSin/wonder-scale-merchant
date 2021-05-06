import { Component, Input, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'ws-stepper',
  templateUrl: './ws-stepper.component.html',
  styleUrls: ['./ws-stepper.component.scss']
})
export class WsStepperComponent implements OnInit {
  @Input() isApprovalEnabled: boolean = true;
  @Input() selectedStage: string = 'delivered';
  @Input() deliveryOption: string = 'delivery';
  @Input() isOpen: boolean;
  selectedIndex = 0;
  constructor() { 
    this.selectedIndex = this.getIndex(this.selectedStage);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.selectedStage) {
      this.selectedIndex = this.getIndex(this.selectedStage);
    }
  }
  ngOnInit(): void {
  }
  getIndex(stage): number {
    switch (stage) {
      case 'new': return 0;
      case 'paid': return 1;
      case 'in_progress': return 2;
      case 'ready': return 3;
      case 'delivered': return 4;
      case 'completed': return 5;
      default: return 0;
    }
  }

}
