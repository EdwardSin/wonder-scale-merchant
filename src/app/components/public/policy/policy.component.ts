import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DocumentHelper } from '@helpers/documenthelper/document.helper';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'policy',
  templateUrl: './policy.component.html',
  styleUrls: ['./policy.component.scss']
})
export class PolicyComponent implements OnInit {

  text;
  private ngUnsubscribe: Subject<any> = new Subject();

  constructor(private http: HttpClient) { }

  ngOnInit() {
    DocumentHelper.setWindowTitleWithWonderScale('Policy');
    this.getPolicy();
  }
  getPolicy() {
    this.http.get('/assets/html/policy.html', { responseType: 'text' }).pipe(
      takeUntil(this.ngUnsubscribe))
      .subscribe(text => {
        this.text = text;
      })
  }
}
