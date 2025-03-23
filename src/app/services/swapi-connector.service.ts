import {Injectable} from '@angular/core';
import {map, Observable, of} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {SwapiDisplayPerson, SwapiPerson} from '../domain/types';

const swapiPeopleURL = 'https://swapi.dev/api/people';

@Injectable()
export class SwapiConnectorService {

  constructor(
    private http: HttpClient
  ) {

  }

  public getPeopleData(): Observable<any> {
    return this.http.get<any>(`${swapiPeopleURL}`);
  }

  /** utility */

  //Note: DTO stands for "Data Transfer Object"
  public dtoToDisplayPerson(dto: any): SwapiDisplayPerson {
    return {
      name: dto.name,
      height: dto.height,
      "birth year": dto.birth_year,
    } as SwapiDisplayPerson;
  }
}
