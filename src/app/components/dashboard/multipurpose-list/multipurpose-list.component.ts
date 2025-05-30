import {Component, EventEmitter, Input, Output} from '@angular/core';
import {MULTI_LIST_CONFIG, MultiListConfig} from '../../../utils/multipurpose-list-configs';
import {AppUser, SwapiEntity} from '../../../domain/types';
import {AppStateService} from '../../../services/app-state.service';
import {DbConnectorService} from '../../../services/db-connector.service';
import {DetailsDialogComponent} from '../../commons/details-dialog/details-dialog/details-dialog.component';
import {take} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {SwapiConnectorService} from '../../../services/swapi-connector.service';

@Component({
  selector: 'multipurpose-list',
  standalone: false,
  templateUrl: './multipurpose-list.component.html',
  styleUrl: './multipurpose-list.component.scss'
})
export class MultipurposeListComponent {

  @Input()
  public config: MultiListConfig;

  @Input()
  public data: any[] = [];

  @Output()
  public favoriteActionSafeguard: EventEmitter<any> = new EventEmitter();

  protected readonly Object = Object;

  constructor(
    private state: AppStateService,
    private db: DbConnectorService,
    private dialog: MatDialog,
    private swapiConnector: SwapiConnectorService,
  ) {
    this.config = MULTI_LIST_CONFIG.PEOPLE; // for now default
  }

  private updatePeopleData(): void {
    const userFavoritePeople = this.state.currentUser$.value.favoritePeople;

    this.data = this.data.map(person => {
      if (userFavoritePeople.some((p: any) => p.url === person.url)) {
        return { ...person,  isFavorite: true }
      } else {
        return { ...person,  isFavorite: false };
      }
    });
    this.state.refreshUsersFavorites(this.state.currentUser$.value);
  }

  private updateStarshipData(): void {
    const userFavoriteStarships = this.state.currentUser$.value.favoriteStarships;

    this.data = this.data.map(starship => {
      if (userFavoriteStarships.some((s: any) => s.url === starship.url)) {
        return { ...starship,  isFavorite: true }
      } else {
        return { ...starship,  isFavorite: false };
      }
    });
    this.state.refreshUsersFavorites(this.state.currentUser$.value);
  }

  public toggleFavorite(entity: SwapiEntity): void {

    this.favoriteActionSafeguard.emit(); // Emit signal to parent component

    const user = this.state.currentUser$.value;

    if (this.config.context === MULTI_LIST_CONFIG.PEOPLE.context) {
      this.handleFavoriteForSwapiPerson(entity, user);
      return;
    }
    if (this.config.context === MULTI_LIST_CONFIG.STARSHIPS.context) {
      this.handleFavoriteForSwapiStarship(entity, user);
      return;
    }
  }

  private handleFavoriteForSwapiPerson(entity: SwapiEntity, user: AppUser): void {

    if (entity.isFavorite) {
      const filteredFavorites = user.favoritePeople.filter((obj: any) => obj.url !== entity.url);
      const modifiedUser = { ...user,  favoritePeople: filteredFavorites };
      this.db.updateUserById(user.id, modifiedUser).subscribe(() => this.updatePeopleData());
      return;
    }

    const currentFavorites = user.favoritePeople;
    if (!currentFavorites.some((cf: any) => cf.url === entity.url)) {
      currentFavorites.push({...entity, isFavorite: true});
      const modifiedUser = { ...user,  favoritePeople: currentFavorites }
      this.db.updateUserById(user.id, modifiedUser).subscribe(() => this.updatePeopleData());
    }
  }

  private handleFavoriteForSwapiStarship(entity: SwapiEntity, user: AppUser): void {

    if (entity.isFavorite) {
      const filteredFavorites = user.favoriteStarships.filter((obj: any) => obj.url !== entity.url);
      const modifiedUser = { ...user,  favoriteStarships: filteredFavorites };
      this.db.updateUserById(user.id, modifiedUser).subscribe(() => this.updateStarshipData());
      return;
    }

    const currentFavorites = user.favoriteStarships;
    if (!currentFavorites.some((cf: any) => cf.url === entity.url)) {
      currentFavorites.push({...entity, isFavorite: true});
      const modifiedUser = { ...user,  favoriteStarships: currentFavorites }
      this.db.updateUserById(user.id, modifiedUser).subscribe(() => this.updateStarshipData());
    }
  }

  public showDetails(object: SwapiEntity): void {
    const data = {entity: object, context: this.config.context}

    this.dialog.open(DetailsDialogComponent, {data})
      .afterClosed()
      .pipe(take(1))
      .subscribe(result => {
        console.log(result);
        // Whatever result will be...
      });
  }

  protected checkShouldDisplayInfo(detail: string): boolean {
    return detail !== 'url' && detail !== 'isFavorite' && detail !== 'uid' && detail !== 'selectedForComparison'
  }

  protected selectedObjects: SwapiEntity[] = [];
  protected showComparison: boolean = false;
  protected selectedFullDetails: any[] = [];

  protected selectForComparison(object: SwapiEntity): void {
    const objWithFlag = object as SwapiEntity & { selectedForComparison?: boolean };
    const alreadySelected = this.selectedFullDetails.find(o => o.url === object.url);

    if (alreadySelected) {
      this.selectedFullDetails = this.selectedFullDetails.filter(o => o.url !== object.url);
      this.selectedObjects = this.selectedObjects.filter(o => o.url !== object.url);
      objWithFlag.selectedForComparison = false;
    } else if (this.selectedFullDetails.length < 2) {
      this.swapiConnector
        .getPersonDetails(object.url)
        .pipe(take(1))
        .subscribe(response => {
          const fullData = {
            ...response.result.properties,
            description: response.result.description,
            url: object.url,
            name: object.name || object.uid || 'Entity',
          };
          this.selectedFullDetails.push(fullData);
          this.selectedObjects.push(object);
          objWithFlag.selectedForComparison = true;
          this.showComparison = this.selectedObjects.length === 2;
        });
    }
  }

  protected isSelectedForComparison(object: any): boolean {
    return this.selectedObjects.some(o => o.url === object.url);
  }

  protected clearComparison(): void {
    this.selectedObjects.forEach(obj => {
      const objWithFlag = obj as SwapiEntity & { selectedForComparison?: boolean };
      objWithFlag.selectedForComparison = false;
    });
    this.selectedFullDetails = [];
    this.selectedObjects = [];
    this.showComparison = false;
  }

  protected objectEntries(obj: Record<string, any>): [string, any][] {
    return Object.entries(obj);
  }

  protected filterObjectEntries(obj: Record<string, any>): [string, any][] {
    const allowedKeys = ['name', 'height', 'mass', 'crew', 'length', 'description']; // Customize your fields
    return Object.entries(obj).filter(([key]) => allowedKeys.includes(key));
  }

}
