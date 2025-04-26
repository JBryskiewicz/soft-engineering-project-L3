import {Injectable} from '@angular/core';
import {SwapiConnectorService} from './swapi-connector.service';
import {BehaviorSubject, combineLatest, take} from 'rxjs';
import {DbConnectorService} from './db-connector.service';
import {AppUser} from '../domain/types';
import {AUTH_TOKEN_KEY} from '../../environments/env';
import {user} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AppStateService {

  // Cashing people
  public peopleCache$: BehaviorSubject<any> = new BehaviorSubject([]);

  public planetsCache$: BehaviorSubject<any> = new BehaviorSubject([]);

  public speciesCache$: BehaviorSubject<any> = new BehaviorSubject([]);

  public starshipsCache$: BehaviorSubject<any> = new BehaviorSubject([]);

  // Cache current user information
  public currentUser: AppUser | null = null;

  constructor(private swapi: SwapiConnectorService, private db: DbConnectorService) {
    // Combine all requests, cash results to correct Cache Arrays when last arrives from API.
    combineLatest([
      this.swapi.getPlanetsData(),
      this.swapi.getSpeciesData(),
      this.swapi.getStarshipsData(),
      this.swapi.getPeopleData(), // Make sure that people are always last here!
    ])
      .pipe(take(1))
      .subscribe(results => {
        results.forEach(result => {
          this.saveToCorrectCache(result);
        });
      });
    this.cacheLoggedInUser();
  }

  public cacheLoggedInUser(): void {
    const userId = localStorage.getItem(AUTH_TOKEN_KEY);
    if (userId) {
      this.db.getUserById(userId).subscribe(user => {
        this.currentUser = user;
        console.log(this.currentUser);
      })
    }
  }

  public clearLoggedInUser(): void {
    this.currentUser = null;
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
      case 'starships':
        this.starshipsCache$.next(result.results);
        break;
      default:
        console.error(`Unknown identifier: ${identifier}`);
        break;
    }
  }
}
