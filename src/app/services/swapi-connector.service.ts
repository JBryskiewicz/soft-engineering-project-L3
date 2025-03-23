import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {HttpClient} from '@angular/common/http';

const swapiPeopleURL = 'https://swapi.dev/api/people';

@Injectable()
export class SwapiConnectorService {

  constructor(
    private http: HttpClient
  ) {

  }

  public getData(): Observable<any> {
    return this.http.get<any>(`${swapiPeopleURL}`);
  }
}
