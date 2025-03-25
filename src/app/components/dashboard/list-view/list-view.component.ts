import {Component} from '@angular/core';
import {SwapiDisplayPerson, SwapiPersonDto} from '../../../domain/types';
import {SwapiConnectorService} from '../../../services/swapi-connector.service';
import {AppStateService} from '../../../services/app-state.service';
import {forkJoin, merge, mergeAll} from 'rxjs';
import {combineLatest} from 'rxjs/internal/operators/combineLatest';
import {DbConnectorService} from '../../../services/db-connector.service';
import {AUTH_TOKEN_KEY} from '../../../../environments/env';
import {Router} from '@angular/router';

// TODO KUBA TASK => FIX LOADER!!!

@Component({
  selector: 'list-view',
  standalone: false,
  templateUrl: './list-view.component.html',
  styleUrl: './list-view.component.scss'
})
export class ListViewComponent {

  protected readonly Object = Object;

  protected swapiPeopleControl: SwapiDisplayPerson[] = [];

  protected swapiPeople: SwapiDisplayPerson[] = [];

  protected onlyFavorites: boolean = false;

  protected isPeopleDataReady: boolean = false;

  constructor(
    protected state: AppStateService,
    private db: DbConnectorService,
    private router: Router,
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
        isFavorite: this.state.currentUser?.favoritePeople.find(p => p.url === person.url) || false,
      } as SwapiDisplayPerson;
    })
  }

  private updatePeopleViewData(): void {
    const userFavorites = this.state.currentUser?.favoritePeople!;
    this.swapiPeople = this.swapiPeople.map(person => {
      if (userFavorites.some(p => p.url === person.url)) {
        return {
          ...person,
          isFavorite: true,
        }
      } else {
        return {
          ...person,
          isFavorite: false,
        };
      }
    });
  }

  protected handleLogoutButton(): void {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    this.state.clearLoggedInUser();
    this.router.navigate(['']);
  }

  protected toggleFavoriteFilter() {
    this.onlyFavorites = !this.onlyFavorites;
    this.handleFilterChange();
  }

  protected handleFilterChange(): void {
    if (this.onlyFavorites) {
      this.swapiPeopleControl = this.swapiPeople;
      this.swapiPeople = this.swapiPeople.filter(person => person.isFavorite);
    } else {
      this.swapiPeople = this.swapiPeopleControl;
    }
  }

  protected toggleFavorite(object: SwapiDisplayPerson): void {
    const user = this.state.currentUser!;

    if (object.isFavorite) {
      const filteredFavorites = user.favoritePeople.filter(obj => obj.url !== object.url);
      const modifiedUser = {
        ...user,
        favoritePeople: filteredFavorites
      };
      this.db.updateUserById(user.id, modifiedUser).subscribe(() => {
        this.updatePeopleViewData();
      });
      return;
    }

    const currentFavorites = user.favoritePeople;
    if (!currentFavorites.some(cf => cf.url === object.url)) {
      currentFavorites.push({...object, isFavorite: true});
      const modifiedUser = {
        ...user,
        favoritePeople: currentFavorites
      }
      this.db.updateUserById(user.id, modifiedUser).subscribe(() => {
        this.updatePeopleViewData();
      });
    }
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
