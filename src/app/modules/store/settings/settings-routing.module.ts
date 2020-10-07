import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SettingsComponent } from '@components/store/settings/settings/settings.component';
import { StoreResolver } from '@components/resolvers/store-resolver.service';


const routes: Routes = [
  {
    path: '',
    component: SettingsComponent,
    children: [{
      path: '',
      redirectTo: 'about',
      pathMatch: 'full'
    },
    {
      path: 'about',
      loadChildren: () => import('./about/about.module').then(m => m.AboutModule),
      resolve: { store: StoreResolver },
      data: { title: 'about', breadcrumb: 'About' }
    },
    {
      path: 'social-media',
      loadChildren: () => import('./social-media/social-media.module').then(m => m.SocialMediaModule),
      resolve: { store: StoreResolver },
      data: { title: 'social-media', breadcrumb: 'Socia Media' }
    }
  ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
