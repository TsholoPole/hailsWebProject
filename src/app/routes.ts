import { LoginComponent } from './view-components/login/login.component';
import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { LearningContentComponent } from './view-components/learning-content/learning-content.component';
import { Introduction } from './view-components/introduction/introduction.component';


export const AppRoutes: Routes = [
    { path: 'login', component: LoginComponent },
    {
      path: '',
      redirectTo: '/login',
      pathMatch: 'full'
    },
    { path: 'introduction', component: Introduction },
    {path: 'content', component: LearningContentComponent}

];
export const routing: ModuleWithProviders = RouterModule.forRoot(AppRoutes);
