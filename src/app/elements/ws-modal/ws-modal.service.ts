import { Injectable } from '@angular/core';
import _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class WsModalService {
  private modals: any[] = [];
  add(modal: any) {
    // add modal to array of active modals
    if (!this.modals.find(x => x.id === modal.id)) {
      this.modals.push(modal);
    }
  }

  remove(id: string) {
    // remove modal from array of active modals
    let modalToRemove = _.find(this.modals, { id: id });
    this.modals = _.without(this.modals, modalToRemove);
  }

  open(id: string) {
    // open modal specified by id
    let modal = _.find(this.modals, { id: id });
    modal.open();
  }

  close(id: string) {
    // close modal specified by id
    let modal = _.find(this.modals, { id: id });
    modal.close();
  }

  closeModal(modal) {
    modal.close();
  }
  setElement(id, item) {
    let modal = _.find(this.modals, { id: id });
    modal.setElement(item);
  }
}
