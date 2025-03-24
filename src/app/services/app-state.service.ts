import {Injectable} from '@angular/core';
import {SwapiConnectorService} from './swapi-connector.service';
import {BehaviorSubject, combineLatest, take} from 'rxjs';
import {DbConnectorService} from './db-connector.service';
import {AppUser} from '../domain/types';

@Injectable({
  providedIn: 'root'
})
export class AppStateService {

  // Cashing people
  public peopleCache$: BehaviorSubject<any> = new BehaviorSubject([]);

  public planetsCache$: BehaviorSubject<any> = new BehaviorSubject([]);

  public speciesCache$: BehaviorSubject<any> = new BehaviorSubject([]);

  // Cache current user information
  public currentUser: AppUser | null = null;

  constructor(private swapi: SwapiConnectorService, private db: DbConnectorService) {
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

    // TODO this is temp to work on one desired user, change when login system is done
    this.db.getUserById('k0Uk9I5fh9pMAq3rAw5q').subscribe(user => {
      this.currentUser = user;
    })
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
