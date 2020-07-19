import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { WsLoading } from '@elements/ws-loading/ws-loading';
import { Subject } from 'rxjs';
import { Package } from '@objects/package';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'package-list',
  templateUrl: './package-list.component.html',
  styleUrls: ['./package-list.component.scss']
})
export class PackageListComponent implements OnInit {
  @Output('select') selectedPackageChange: EventEmitter<any> = new EventEmitter;
  @Input('selected') selected: Package;
  @Input('loading') loading: boolean;
  selectedPackage: string;
  packageLoading: WsLoading = new WsLoading;
  infos = [];
  packagesLoading: WsLoading = new WsLoading;
  addonInfos = [];
  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.packagesLoading.start();
    this.http.get('assets/json/services.json').subscribe(result => {
      this.infos = <Array<any>>result;
      this.http.get('assets/json/addon-services.json').subscribe(result => {
        this.addonInfos = <Array<any>>result;
        this.packagesLoading.stop();
      });
    });
  }
  selectPackage(selectedPackage) {
    this.selectedPackage = selectedPackage;
    this.selectedPackageChange.emit(this.selectedPackage);
  }
}
