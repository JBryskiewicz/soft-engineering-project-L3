import {Component, Input} from '@angular/core';
import {MULTI_LIST_CONFIG, MultiListConfig} from '../../../utils/multipurpose-list-configs';
import {SwapiEntity} from '../../../domain/types';
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

  protected readonly Object = Object;

  constructor(
    private state: AppStateService,
    private db: DbConnectorService,
    private dialog: MatDialog,
    private swapiConnector: SwapiConnectorService,
  ) {
    this.config = MULTI_LIST_CONFIG.PEOPLE; // for now default
  }

  private updateData(): void {
    const userFavorites = this.state.currentUser$?.value.favoritePeople!;
    this.data = this.data.map(person => {
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

  // TODO need to adjust to include more types of favorite entities.
  protected toggleFavorite(object: SwapiEntity): void {
    const user = this.state.currentUser$.value;

    if (object.isFavorite) {
      const filteredFavorites = user.favoritePeople.filter((obj: any) => obj.url !== object.url);
      const modifiedUser = {
        ...user,
        favoritePeople: filteredFavorites
      };
      this.db.updateUserById(user.id, modifiedUser).subscribe(() => {
        this.updateData();
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
        this.updateData();
      });
    }
  }

  protected showDetails(object: SwapiEntity): void {
    const data = {entity: object, context: this.config.context}

    this.dialog.open(DetailsDialogComponent, { data })
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

  protected filterObjectEntries(obj: Record<string, any>): [string, any][] {
    const allowedKeys = ['name', 'height', 'mass', 'crew', 'length', 'description']; // Customize your fields
    return Object.entries(obj).filter(([key]) => allowedKeys.includes(key));
  }

  protected getHighlightClass(stat: string, value: any): string {
    const values = this.selectedFullDetails
      .map(obj => parseFloat(obj[stat]))
      .filter(val => !isNaN(val));

    if (values.length < 2 || isNaN(parseFloat(value))) return '';

    const max = Math.max(...values);
    return parseFloat(value) === max ? 'highlight' : '';
  }
}
