import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HeaderComponent } from './view-components/header/header.component';
import { LoginComponent } from './view-components/login/login.component';
import { SidePanelComponent } from './view-components/side-panel/side-panel.component';
import { RouterModule } from '@angular/router';
import { AppRoutes } from './routes';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SidePanelMenuComponentComponent } from './view-components/side-panel-menu/side-panel-menu.component';
import { IntroductionPageContentComponent } from './view-components/introduction-page-content/introduction-page-content.component';
import { LearningContentComponent } from './view-components/learning-content/learning-content.component';
import { ContentComponent } from './view-components/content/content.component';
import { HeaderUsernameService } from './services/header-information-services/header-content.service';
import { CreateContentService } from './services/section-services/create-content.service';
import { ProvideSectionsService } from './services/section-services/provide-sections.service';
import { ContentProviderMapper } from './services/content-services/content-provider-apper.service';
import { ContentProviderService } from './services/content-services/content-provider.service';
import { HttpModule } from '@angular/http';
import { Introduction } from './view-components/introduction/introduction.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LoginComponent,
    SidePanelComponent,
    Introduction,
    SidePanelMenuComponentComponent,
    IntroductionPageContentComponent,
    LearningContentComponent,
    ContentComponent,
     
  ],
  imports: [
    RouterModule.forRoot(
      AppRoutes,
      {enableTracing: true}//debugging
    ),
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule
  ],
  providers: [HeaderUsernameService, 
    CreateContentService,
    ProvideSectionsService,
    ContentProviderMapper,
    ContentProviderService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
