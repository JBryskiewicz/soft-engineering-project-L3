import { Component } from '@angular/core';
import {SwapiConnectorService} from './services/swapi-connector.service';
import {SwapiPerson} from './domain/types';
import {AppStateService} from './services/app-state.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'soft-engineering-project-l3';


  constructor() {}
}
