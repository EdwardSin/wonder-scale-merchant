import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'permission-list',
  templateUrl: './permission-list.component.html',
  styleUrls: ['./permission-list.component.scss']
})
export class PermissionListComponent implements OnInit {

  @Input() role;

  constructor() { }

  ngOnInit() {
  }

}
