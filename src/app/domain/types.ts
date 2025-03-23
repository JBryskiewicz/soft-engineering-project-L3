export interface SwapiDisplayPerson {
  url: string // Consider to be ID
  name: string;
  homeworld: string;
  species: string
  isFavorite: boolean;
}

export interface SwapiPersonDto {
  url: string, // Consider to be ID
  name: string,
  height: string,
  mass: string,
  hair_color: string,
  skin_color: string,
  eye_color: string,
  birth_year: string,
  gender: string,
  homeworld: string,
  films: string[],
  species: string[],
  vehicles: string[],
  starships: string[],
  created: string,
  edited: string,
}
