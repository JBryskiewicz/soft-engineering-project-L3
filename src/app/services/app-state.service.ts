import {Injectable} from '@angular/core';
import {SwapiConnectorService} from './swapi-connector.service';
import {BehaviorSubject, combineLatest, take} from 'rxjs';
import {DbConnectorService} from './db-connector.service';
import {AppUser} from '../domain/types';
import {AUTH_TOKEN_KEY} from '../../environments/env';

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
  public currentUser$: BehaviorSubject<any> = new BehaviorSubject(null);

  public isAppReady$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(private swapi: SwapiConnectorService, private db: DbConnectorService) {
    const cachedUser = localStorage.getItem(AUTH_TOKEN_KEY)
    if (cachedUser) {
      const userObject = JSON.parse(cachedUser);
      this.currentUser$.next(userObject);
      this.refreshUsersFavorites(userObject);
      this.fetchInitialData();
    }
  }

  public refreshUsersFavorites(user: AppUser): void {
    this.db.getUserById(user.id).pipe(take(1)).subscribe(response => {
      this.currentUser$.next(response);
    });
  }

  public cacheLoggedInUser(user: AppUser): void {
    this.isAppReady$.next(false);
    this.currentUser$.next(user);
    localStorage.setItem(AUTH_TOKEN_KEY, JSON.stringify(user));
    this.fetchInitialData();
  }

  public clearLoggedInUser(): void {
    this.currentUser$.next(null);
  }

  private fetchInitialData(): void {
    // Combine all requests, cash results to correct Cache Arrays when last arrives from API.
    combineLatest([
      this.swapi.getPlanetsData(),
      this.swapi.getSpeciesData(),
      this.swapi.getStarshipsData(),
      this.swapi.getPeopleData(), // People must come last
    ]).subscribe(results => {
      results.forEach(r => this.saveToCorrectCache(r));
      this.isAppReady$.next(true);
    });
  }

  private saveToCorrectCache(result: any): void {
    const identifier = result.next.split('/')[4].split('?')[0]; // Should always point on request "type"
    switch (identifier) {
      case 'people':
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
