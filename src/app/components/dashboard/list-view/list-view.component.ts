import {Component, OnInit} from '@angular/core';
import {AppUser, NewSwapiPersonDto, SwapiDisplayPerson, SwapiPersonDto} from '../../../domain/types';
import {SwapiConnectorService} from '../../../services/swapi-connector.service';
import {AppStateService} from '../../../services/app-state.service';
import {forkJoin, merge, mergeAll, take} from 'rxjs';
import {combineLatest} from 'rxjs/internal/operators/combineLatest';
import {DbConnectorService} from '../../../services/db-connector.service';
import {AUTH_TOKEN_KEY} from '../../../../environments/env';
import {Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {DetailsDialogComponent} from '../../commons/details-dialog/details-dialog/details-dialog.component';

// TODO KUBA TASK => FIX LOADER!!!

@Component({
  selector: 'list-view',
  standalone: false,
  templateUrl: './list-view.component.html',
  styleUrl: './list-view.component.scss'
})
export class ListViewComponent implements OnInit {

  protected readonly Object = Object;

  protected swapiPeopleControl: SwapiDisplayPerson[] = [];

  protected swapiPeople: any[] = [];

  protected onlyFavorites: boolean = false;

  protected isPeopleDataReady: boolean = false;

  constructor(
    protected state: AppStateService,
    private db: DbConnectorService,
    private dialog: MatDialog,
    private router: Router,
  ) {
  }

  ngOnInit() {
    this.state.currentUser$.subscribe((user: AppUser) => {
      if (user) {
        this.state.peopleCache$.subscribe(people => {
          this.buildPeopleViewData(people);
        });
      }
    })
  }

  // Forced change of API destroyed this feature a bit, welp...
  private buildPeopleViewData(people: NewSwapiPersonDto[]): void {
    this.swapiPeople = people.map(person => {
      return {
        uid: person.uid,
        name: person.name,
        url: person.url,
        isFavorite: this.matchFavoritePersonFromSaved(person),
      } as NewSwapiPersonDto;
    });
  }

  private matchFavoritePersonFromSaved(person: NewSwapiPersonDto): boolean {
    return Boolean(this.state.currentUser$?.value.favoritePeople.find((p: any) => p.url === person.url));
  }

  private updatePeopleViewData(): void {
    const userFavorites = this.state.currentUser$?.value.favoritePeople!;
    this.swapiPeople = this.swapiPeople.map(person => {
      if (userFavorites.some((p: any) => p.url === person.url)) {
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
    const user = this.state.currentUser$.value;

    if (object.isFavorite) {
      const filteredFavorites = user.favoritePeople.filter((obj: any) => obj.url !== object.url);
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
    if (!currentFavorites.some((cf: any) => cf.url === object.url)) {
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
    this.dialog.open(DetailsDialogComponent, {
      data: object
    }).afterClosed()
      .pipe(take(1))
      .subscribe(result => {
        console.log(result);
      });
  }

  protected checkShouldDisplayInfo(detail: string): boolean {
    return detail !== 'url' && detail !== 'isFavorite' && detail !== 'uid'
  }

}
