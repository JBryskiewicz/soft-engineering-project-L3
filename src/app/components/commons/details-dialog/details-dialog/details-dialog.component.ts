import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {SwapiConnectorService} from '../../../../services/swapi-connector.service';
import {take} from 'rxjs';
import {DetailsDialogData} from '../../../../domain/types';

@Component({
  selector: 'details-dialog',
  standalone: false,
  templateUrl: './details-dialog.component.html',
  styleUrl: './details-dialog.component.scss'
})
export class DetailsDialogComponent {

  protected isLoaded: boolean = false;
  protected properties: any;
  protected description: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DetailsDialogData,
    private swapiConnector: SwapiConnectorService,
  ) {
    this.swapiConnector
      .getPersonDetails(data.entity.url)
      .pipe(take(1))
      .subscribe(response => {
        this.description = response.result.description;
        this.properties = response.result.properties;
        this.isLoaded = true;
      });
  }

}
