import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SettingsComponent } from '@components/shop/settings/settings/settings.component';
import { ShopResolver } from '@components/resolvers/shopResolver.service';


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
      resolve: { shop: ShopResolver },
      data: { title: 'about', breadcrumb: 'About' }
    },
    {
      path: 'social-media',
      loadChildren: () => import('./social-media/social-media.module').then(m => m.SocialMediaModule),
      resolve: { shop: ShopResolver },
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
