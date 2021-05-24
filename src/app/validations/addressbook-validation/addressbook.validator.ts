import { WsToastService } from '@elements/ws-toast/ws-toast.service';

export class AddressBookValidator {
    form;
    // regex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    constructor(form) {
        this.form = form;
    }
    validate() {
        let form = this.form;
        if (!form.value.recipientName.trim()) {
            WsToastService.toastSubject.next({ content: 'Please enter the recipient\'s name!', type: 'danger'});
            return false;
        }
        else if (!form.value.phone.trim()) {
            WsToastService.toastSubject.next({ content: 'Please enter the phone number!', type: 'danger'});
            return false;
        }
        // else if (!this.regex.test(form.value.phone.trim())) {
        //     WsToastService.toastSubject.next({ content: 'Please enter a valid phone number!', type: 'danger'});
        //     return false;
        // }
        else if (!form.value.address.trim()) {
            WsToastService.toastSubject.next({ content: 'Please enter your address!', type: 'danger'});
            return false;
        }
        else if (!form.value.postcode.trim()) {
            WsToastService.toastSubject.next({ content: 'Please enter your postcode!', type: 'danger'});
            return false;
        }
        else if (!form.value.state.trim()) {
            WsToastService.toastSubject.next({ content: 'Please enter your state!', type: 'danger'});
            return false;
        }
        else if (!form.value.country.trim()) {
            WsToastService.toastSubject.next({ content: 'Please enter your country!', type: 'danger'});
            return false;
        }
        return true;
    }
}