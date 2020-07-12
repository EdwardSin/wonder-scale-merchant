import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Title } from '@constants/title';
import { Contactus } from '@objects/contactus';
import { SendemailService } from '@services/http/general/sendemail.service';
import { DocumentHelper } from '@helpers/documenthelper/document.helper';
import { WsLoading } from '@elements/ws-loading/ws-loading';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { WsToastService } from '../../../elements/ws-toast/ws-toast.service';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ContactUsComponent implements OnInit {
  contactus = new Contactus;
  loading: WsLoading = new WsLoading;

  private ngUnsubscribe: Subject<any> = new Subject();
  constructor(private sendEmailService: SendemailService) {
  }

  ngOnInit() {
    DocumentHelper.setWindowTitleWithWonderScale(Title.CONTACT_US);
  }

  onSubmit() {
    if (this.contactus.validate()) {
      var email_content = {
        name: this.contactus.form.get("name").value,
        email: this.contactus.form.get("email").value,
        tel: this.contactus.form.get("tel").value,
        country: this.contactus.form.get("country").value,
        comment: this.contactus.form.get("comment").value
      }
      this.loading.start();
      this.sendEmailService.sendEmail(email_content).pipe(takeUntil(this.ngUnsubscribe), finalize(() => this.loading.stop())
      ).subscribe(result => {
        if (result['result']) {
          WsToastService.toastSubject.next({ content: result["message"], type: 'success' });
          this.contactus.reset();
          Object.keys(this.contactus.form.controls).forEach(key => {
            this.contactus.form.controls[key].setErrors(null);
          });
        }
        else {
          WsToastService.toastSubject.next({ content: result['message'], type: 'danger' });
        }
      });
    } else {
      WsToastService.toastSubject.next({ content: 'Please fill in the fields!', type: 'danger'});
    }
  }
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
