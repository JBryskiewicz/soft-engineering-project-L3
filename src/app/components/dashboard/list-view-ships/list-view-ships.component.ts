import { Component } from '@angular/core';
import { SwapiDisplayStarship, SwapiStarshipDto } from '../../../domain/types';
import { AppStateService } from '../../../services/app-state.service';
import { DbConnectorService } from '../../../services/db-connector.service';
import { AUTH_TOKEN_KEY } from '../../../../environments/env';
import { Router } from '@angular/router';

@Component({
  selector: 'list-view-ships',
  standalone: false,
  templateUrl: './list-view-ships.component.html',
  styleUrls: ['./list-view-ships.component.scss']
})
export class ListViewShipsComponent {

  protected readonly Object = Object;

  protected swapiShipsControl: SwapiDisplayStarship[] = [];

  protected swapiShips: SwapiDisplayStarship[] = [];

  protected onlyFavorites: boolean = false;

  protected isShipsDataReady: boolean = false;

  constructor(
    protected state: AppStateService,
    private db: DbConnectorService,
    private router: Router,
  ) {
    this.state.starshipsCache$.subscribe(starships => {
      this.buildShipsViewData(starships);
    });
  }

  private buildShipsViewData(starships: SwapiStarshipDto[]): void {
    this.swapiShips = starships.map(starship => {
      return {
        url: starship.url,
        name: starship.name,
        model: starship.model,
        manufacturer: starship.manufacturer,
        isFavorite: this.state.currentUser$.value?.favoriteStarships.find((s: any) => s.url === starship.url) || false,
      } as SwapiDisplayStarship;
    });
  }

  private updateShipsViewData(): void {
    const userFavorites = this.state.currentUser$.value?.favoriteStarships!;
    this.swapiShips = this.swapiShips.map(ship => {
      if (userFavorites.some((s: any) => s.url === ship.url)) {
        return {
          ...ship,
          isFavorite: true,
        };
      } else {
        return {
          ...ship,
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

  protected toggleFavoriteFilter(): void {
    this.onlyFavorites = !this.onlyFavorites;
    this.handleFilterChange();
  }

  protected handleFilterChange(): void {
    if (this.onlyFavorites) {
      this.swapiShipsControl = this.swapiShips;
      this.swapiShips = this.swapiShips.filter(ship => ship.isFavorite);
    } else {
      this.swapiShips = this.swapiShipsControl;
    }
  }

  protected toggleFavorite(ship: SwapiDisplayStarship): void {
    const user = this.state.currentUser$.value;

    if (ship.isFavorite) {
      const filteredFavorites = user.favoriteStarships.filter((s: any) => s.url !== ship.url);
      const modifiedUser = {
        ...user,
        favoriteStarships: filteredFavorites
      };
      this.db.updateUserById(user.id, modifiedUser).subscribe(() => {
        this.updateShipsViewData();
      });
      return;
    }

    const currentFavorites = user.favoriteStarships;
    if (!currentFavorites.some((s: any) => s.url === ship.url)) {
      currentFavorites.push({ ...ship, isFavorite: true });
      const modifiedUser = {
        ...user,
        favoriteStarships: currentFavorites
      };
      this.db.updateUserById(user.id, modifiedUser).subscribe(() => {
        this.updateShipsViewData();
      });
    }
  }

  protected showDetails(ship: SwapiDisplayStarship): void {
    // TODO: Implement detailed view for starships
    // Hint: Better to use SwapiStarshipDto and MatDialog
  }

  protected checkShouldDisplayInfo(detail: string): boolean {
    return detail !== 'url' && detail !== 'isFavorite';
  }

}
