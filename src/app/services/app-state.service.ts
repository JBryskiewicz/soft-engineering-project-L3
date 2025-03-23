import {Injectable} from '@angular/core';
import {SwapiConnectorService} from './swapi-connector.service';
import {BehaviorSubject, take} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppStateService {

  public peopleStateMap$: BehaviorSubject<any> = new BehaviorSubject(null);

  constructor(private swapi: SwapiConnectorService) {
    this.swapi.getPeopleData().pipe(take(1)).subscribe(response => {
      this.peopleStateMap$.next(response.results);
    });
  }
}
