import {Injectable} from '@angular/core';
import {map, Observable, of} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {SwapiDisplayPerson, SwapiPersonDto} from '../domain/types';

const swapiPeopleURL = 'https://swapi.dev/api/people';
const swapiPlantsURL = 'https://swapi.dev/api/planets';
const swapiSpeciesURL = 'https://swapi.dev/api/species';
const swapiStarshipsURL = 'https://swapi.dev/api/starships';

@Injectable()
export class SwapiConnectorService {

  constructor(
    private http: HttpClient
  ) { }

  public getPeopleData(): Observable<any> {
    return this.http.get<any>(swapiPeopleURL);
  }

  public getPlanetsData(): Observable<any> {
    return this.http.get<any>(swapiPlantsURL);
  }

  public getSpeciesData(): Observable<any> {
    return this.http.get<any>(swapiSpeciesURL);
  }

  public getStarshipsData(): Observable<any> {
    return this.http.get<any>(swapiStarshipsURL);
  }
}
