import {Component} from '@angular/core';
import {SwapiDisplayPerson} from '../../../../domain/types';
import {SwapiConnectorService} from '../../../../services/swapi-connector.service';
import {AppStateService} from '../../../../services/app-state.service';

@Component({
  selector: 'list-view',
  standalone: false,
  templateUrl: './list-view.component.html',
  styleUrl: './list-view.component.scss'
})
export class ListViewComponent {

  protected readonly Object = Object;

  protected results: SwapiDisplayPerson[] = [];

  constructor(
    private swapi: SwapiConnectorService,
    private state: AppStateService,
  ) {
    this.state.peopleStateMap$.subscribe(people => {
      if (people) {
        this.results = people.map((o: any) => this.swapi.dtoToDisplayPerson(o));
        console.log(this.results);
      }
    });
  }

  protected toggleFavorite(object: SwapiDisplayPerson): void {
    // TODO for kuba => implement.
  }

  protected showDetails(object: SwapiDisplayPerson): void {
    // TODO for ignacy => implement.
  }

}
