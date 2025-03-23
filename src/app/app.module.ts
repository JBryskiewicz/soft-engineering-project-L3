import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {SwapiConnectorService} from './services/swapi-connector.service';
import {HttpClientModule} from '@angular/common/http';
import { ListViewComponent } from './components/dashboard/list-view/list-view/list-view.component';
import {MatCard, MatCardContent, MatCardFooter, MatCardHeader} from "@angular/material/card";
import {MatList, MatListItem} from '@angular/material/list';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {AppStateService} from './services/app-state.service';

@NgModule({
  declarations: [
    AppComponent,
    ListViewComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatList,
    MatListItem,
    MatCardFooter,
    MatIcon,
    MatButton,
    MatButton,
    MatIconButton,
  ],
  providers: [
    SwapiConnectorService,
    AppStateService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
