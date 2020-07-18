import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { WsLoading } from '@elements/ws-loading/ws-loading';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'package-list',
  templateUrl: './package-list.component.html',
  styleUrls: ['./package-list.component.scss']
})
export class PackageListComponent implements OnInit {
  @Output('select') selectedPackageChange: EventEmitter<any> = new EventEmitter;
  @Input('selected') selected: string;
  selectedPackage: string;
  private ngUnsubscribe: Subject<any> = new Subject;
  packageLoading: WsLoading = new WsLoading;
  infos = [];
  loading: WsLoading = new WsLoading;
  addonInfos = [];
  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.loading.start();
    this.http.get('assets/json/services.json').subscribe(result => {
      this.infos = <Array<any>>result;
      this.http.get('assets/json/addon-services.json').subscribe(result => {
        this.addonInfos = <Array<any>>result;
        this.loading.stop();
      });
    });
  }
  selectPackage(selectedPackage) {
    this.selectedPackage = selectedPackage;
    this.selectedPackageChange.emit(this.selectedPackage);
  }
}
