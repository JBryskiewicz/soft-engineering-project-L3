export interface SwapiDisplayPerson {
  name: string;
  height: number;
  "birth year": string;
  isFavorite: boolean;
}

export interface SwapiPerson extends SwapiDisplayPerson {
  // TODO For Ignacy => implement remaining attributes of swapi person object.
  name: string;
  height: number;
  "birth year": string;
}
