import {Component} from '@angular/core';
import {SwapiDisplayPerson, SwapiPersonDto} from '../../../domain/types';
import {SwapiConnectorService} from '../../../services/swapi-connector.service';
import {AppStateService} from '../../../services/app-state.service';
import {forkJoin, merge, mergeAll} from 'rxjs';
import {combineLatest} from 'rxjs/internal/operators/combineLatest';

@Component({
  selector: 'list-view',
  standalone: false,
  templateUrl: './list-view.component.html',
  styleUrl: './list-view.component.scss'
})
export class ListViewComponent {

  protected readonly Object = Object;

  protected swapiPeople: SwapiDisplayPerson[] = [];

  constructor(
    private state: AppStateService,
  ) {
      this.state.peopleCache$.subscribe(people => {
        this.buildPeopleViewData(people);
      });
  }

  private buildPeopleViewData(people: SwapiPersonDto[]): void {
    this.swapiPeople = people.map(person => {
      const species = this.state.speciesCache$.getValue().find((s: any) => s.url === person.species[0]);
      const homeworld = this.state.planetsCache$.getValue().find((s: any) => s.url === person.homeworld);
      return {
        url: person.url,
        name: person.name,
        species: species ? species.name : 'Unknown',
        homeworld: homeworld ? homeworld.name : 'Unknown',
        isFavorite: false,
      } as SwapiDisplayPerson;
    })
  }

  protected toggleFavorite(object: SwapiDisplayPerson): void {
    // TODO for Kuba => implement.
  }

  protected showDetails(object: SwapiDisplayPerson): void {
    // TODO for Ignacy => implement.
    // Hints better to use SwapiPersonDto
    // Best option is to use mat-dialog module
  }

  protected checkShouldDisplayInfo(detail: string): boolean {
    return detail !== 'url' && detail !== 'isFavorite'
  }

}
