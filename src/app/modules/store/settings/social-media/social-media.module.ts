import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SocialMediaRoutingModule } from './social-media-routing.module';
import { SocialMediaComponent } from '@components/store/settings/social-media/social-media.component';
import { SharedModule } from 'src/app/modules/public/shared/shared.module';


@NgModule({
  declarations: [SocialMediaComponent],
  imports: [
    CommonModule,
    SharedModule,
    SocialMediaRoutingModule
  ]
})
export class SocialMediaModule { }
