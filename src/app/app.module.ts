import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {SwapiConnectorService} from './services/swapi-connector.service';
import {HttpClientModule} from '@angular/common/http';
import { DashboardView } from './components/dashboard/dashboard-view.component';
import {MatCard, MatCardContent, MatCardFooter, MatCardHeader, MatCardModule} from "@angular/material/card";
import {MatList, MatListItem} from '@angular/material/list';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {AppStateService} from './services/app-state.service';
import {MatTab, MatTabGroup} from '@angular/material/tabs';
import {DbConnectorService} from './services/db-connector.service';
import {initializeApp, provideFirebaseApp} from '@angular/fire/app';
import {getFirestore, provideFirestore} from '@angular/fire/firestore';
import { getAuth, provideAuth } from '@angular/fire/auth';
import {environment} from '../environments/env';
import { LoginPageComponent } from './components/login/login-page.component';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {ReactiveFormsModule} from '@angular/forms';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import { DetailsDialogComponent } from './components/commons/details-dialog/details-dialog/details-dialog.component';
import { MultipurposeListComponent } from './components/dashboard/multipurpose-list/multipurpose-list.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardView,
    LoginPageComponent,
    DetailsDialogComponent,
    MultipurposeListComponent
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        MatCard,
        MatCardContent,
        MatCardHeader,
        MatCardModule,
        MatList,
        MatListItem,
        MatCardFooter,
        MatIcon,
        MatButton,
        MatButton,
        MatIconButton,
        MatTabGroup,
        MatTab,
        MatFormField,
        MatLabel,
        MatInput,
        ReactiveFormsModule,
        MatProgressSpinner,
    ],
  providers: [
    SwapiConnectorService,
    AppStateService,
    DbConnectorService,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
