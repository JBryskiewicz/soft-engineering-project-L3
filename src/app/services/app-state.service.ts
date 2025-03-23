import {Injectable} from '@angular/core';
import {SwapiConnectorService} from './swapi-connector.service';
import {BehaviorSubject, combineLatest, take} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppStateService {

  // Cashing people
  public peopleCache$: BehaviorSubject<any> = new BehaviorSubject([]);

  public planetsCache$: BehaviorSubject<any> = new BehaviorSubject([]);

  public speciesCache$: BehaviorSubject<any> = new BehaviorSubject([]);

  constructor(private swapi: SwapiConnectorService) {

    // Combine all requests, cash results to correct Cache Arrays when last arrives from API.
    combineLatest([
      this.swapi.getPlanetsData(),
      this.swapi.getSpeciesData(),
      this.swapi.getPeopleData(), // Make sure that people are always last here!
    ])
      .pipe(take(1))
      .subscribe(results => {
        results.forEach(result => {
          this.saveToCorrectCache(result);
        });
      });
  }

  private saveToCorrectCache(result: any): void {
    const identifier = result.next.split('/')[4]; // Should always point on request "type"
    switch (identifier) {
      case 'people':
        console.log(result.results);
        this.peopleCache$.next(result.results);
        break;
      case 'planets':
        this.planetsCache$.next(result.results);
        break;
      case 'species':
        this.speciesCache$.next(result.results);
        break;
      default:
        console.error(`Unknown identifier: ${identifier}`);
        break;
    }
  }
}
