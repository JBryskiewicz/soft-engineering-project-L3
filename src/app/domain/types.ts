/** SoftEng App - User interfaces */

export interface AppUser {
  id: string;
  username: string;
  password: string;
  favoritePeople: SwapiEntity[];
  favoriteStarships: SwapiEntity[];
}

/** Swapi - People interfaces */

export interface SwapiEntity {
  uid: string,
  name: string,
  url: string,
  isFavorite?: boolean,
}

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

export interface SwapiDisplayStarship {
  url: string;
  name: string;
  model: string;
  manufacturer: string;
  isFavorite: boolean;
}

export interface SwapiStarshipDto {
  url: string;
  MGLT: string;
  cargo_capacity: string;
  consumables: string;
  cost_in_credits: string;
  created: string;
  crew: string;
  edited: string;
  hyperdrive_rating: string;
  length: string;
  manufacturer: string;
  max_atmosphering_speed: string;
  model: string;
  name: string;
  passengers: string;
  films: string[];
  pilots: string[];
  starship_class: string;
}

export interface DetailsDialogData {
  entity: SwapiEntity,
  context: string,
}
