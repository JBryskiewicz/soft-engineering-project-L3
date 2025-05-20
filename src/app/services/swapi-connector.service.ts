import {Injectable} from '@angular/core';
import {map, Observable, of} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {SwapiDisplayPerson, SwapiPersonDto} from '../domain/types';

const swapiPeopleURL = 'https://swapi.tech/api/people/?page=1&limit=20';
const swapiPlantsURL = 'https://swapi.tech/api/planets/?page=1&limit=20';
const swapiSpeciesURL = 'https://swapi.tech/api/species/?page=1&limit=20';
const swapiStarshipsURL = 'https://swapi.tech/api/starships?page=1&limit=20';
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

  public getPersonDetails(url: string): Observable<any> {
    return this.http.get<any>(url)
  }

  public getStarshipsData(): Observable<any> {
    return this.http.get<any>(swapiStarshipsURL);
  }
}
