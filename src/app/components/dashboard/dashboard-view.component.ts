import {Component, OnInit} from '@angular/core';
import {AppUser, SwapiEntity} from '../../domain/types';
import {AppStateService} from '../../services/app-state.service';
import {AUTH_TOKEN_KEY} from '../../../environments/env';
import {Router} from '@angular/router';
import {MULTI_LIST_CONFIG} from '../../utils/multipurpose-list-configs';

@Component({
  selector: 'dashboard-view',
  standalone: false,
  templateUrl: './dashboard-view.component.html',
  styleUrl: './dashboard-view.component.scss'
})
export class DashboardView implements OnInit {

  protected readonly Object = Object;

  protected swapiPeopleFilterControl: SwapiEntity[] = [];

  protected swapiPeople: SwapiEntity[] = [];

  protected swapiStarships: SwapiEntity[] = [];

  protected onlyFavorites: boolean = false;

  protected readonly MULTI_LIST_CONFIG = MULTI_LIST_CONFIG;

  constructor(
    protected state: AppStateService,
    private router: Router,
  ) {
  }

  ngOnInit() {
    this.state.currentUser$.subscribe((user: AppUser) => {
      if (user) {
        this.state.peopleCache$.subscribe(people => {
          this.swapiPeople = this.buildData(people);
        });
      }
    })
  }

  private buildData(people: SwapiEntity[]): SwapiEntity[] {
    return people.map(person => {
      return {
        uid: person.uid,
        name: person.name,
        url: person.url,
        isFavorite: this.matchFavoriteEntityFromSaved(person),
      } as SwapiEntity;
    });
  }

  private matchFavoriteEntityFromSaved(entity: SwapiEntity): boolean {
    return Boolean(this.state.currentUser$?.value.favoritePeople.find((p: any) => p.url === entity.url));
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
      this.swapiPeopleFilterControl = this.swapiPeople;
      this.swapiPeople = this.swapiPeople.filter(person => person.isFavorite);
    } else {
      this.swapiPeople = this.swapiPeopleFilterControl;
    }
  }

}
