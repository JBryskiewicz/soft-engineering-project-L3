import { Component } from '@angular/core';
import {SwapiConnectorService} from './services/swapi-connector.service';
import {SwapiOPerson} from './domain/types';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'soft-engineering-project-l3';

  protected results: SwapiOPerson[] = [];

  constructor(private swapi: SwapiConnectorService) {
    this.swapi.getData().subscribe(response => {
      this.results = response.results.map((object: any) => {
        return {
          name: object.name,
          height: parseInt(object.height),
          birth_year: object.birth_year,
          films: object.films,
        } as SwapiOPerson
      })
      console.log(response.results);
    });
  }
}
