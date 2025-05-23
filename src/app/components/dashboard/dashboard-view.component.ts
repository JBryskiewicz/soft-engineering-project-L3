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

  public readonly Object = Object;

  public swapiPeopleFilterControl: SwapiEntity[] = [];

  public swapiStarshipFilterControl: SwapiEntity[] = [];

  public swapiPeople: SwapiEntity[] = [];

  public swapiStarships: SwapiEntity[] = [];

  public onlyFavorites: boolean = false;

  public readonly MULTI_LIST_CONFIG = MULTI_LIST_CONFIG;

  constructor(
    protected state: AppStateService,
    private router: Router,
  ) {
  }

  ngOnInit() {
    this.state.currentUser$.subscribe((user: AppUser) => {
      if (user) {
        this.state.peopleCache$.subscribe(people => {
          this.swapiPeople = this.buildData(people, 'people');
        });
        this.state.starshipsCache$.subscribe(ships => {
          this.swapiStarships = this.buildData(ships, 'starships')
        })
      }
    })
  }

  private buildData(entities: SwapiEntity[], context: 'people' | 'starships'): SwapiEntity[] {
    return entities.map(entity => {
      return {
        uid: entity.uid,
        name: entity.name,
        url: entity.url,
        isFavorite: this.matchFavoriteEntityFromSaved(entity, context),
      } as SwapiEntity;
    });
  }

  private matchFavoriteEntityFromSaved(entity: SwapiEntity, context: 'people' | 'starships'): boolean {
    if (context === 'people') {
      return Boolean(this.state.currentUser$.value.favoritePeople.find((p: any) => p.url === entity.url));
    }
    // Else starships
    return Boolean(this.state.currentUser$.value.favoriteStarships.find((s: any) => s.url === entity.url));
  }

  public handleLogoutButton(): void {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    this.state.clearLoggedInUser();
    this.router.navigate(['']);
  }

  public toggleFavoriteFilter() {
    this.onlyFavorites = !this.onlyFavorites;
    this.handleFilterChange();
  }

  public handleFilterChange(): void {
    if (this.onlyFavorites) {
      this.swapiPeopleFilterControl = this.swapiPeople;
      this.swapiPeople = this.swapiPeople.filter(person => person.isFavorite);
      this.swapiStarshipFilterControl = this.swapiStarships;
      this.swapiStarships = this.swapiStarships.filter(ship => ship.isFavorite);
    } else {
      this.swapiPeople = this.swapiPeopleFilterControl;
      this.swapiStarships = this.swapiStarshipFilterControl;
    }
  }

  public handleSafeguardEmitter(): void {
    this.onlyFavorites = false;
  }
}
