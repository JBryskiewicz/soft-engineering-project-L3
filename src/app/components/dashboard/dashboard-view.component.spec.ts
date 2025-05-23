import {ComponentFixture, TestBed, fakeAsync, tick} from '@angular/core/testing';
import {DashboardView} from './dashboard-view.component';
import {AppStateService} from '../../services/app-state.service';
import {Router} from '@angular/router';
import {BehaviorSubject} from 'rxjs';
import {SwapiEntity, AppUser} from '../../domain/types';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import { AUTH_TOKEN_KEY } from '../../../environments/env';

const mockUser: AppUser = {
  id: 'u1',
  username: 'testuser',
  password: 'pass',
  favoritePeople: [{uid: 'p1', url: 'url1', name: 'Person One'}],
  favoriteStarships: [{uid: 's2', url: 'ship1', name: 'Starship One'}]
};

describe('DashboardView', () => {
  let component: DashboardView;
  let fixture: ComponentFixture<DashboardView>;
  let mockState: jasmine.SpyObj<AppStateService>;
  let mockRouter: jasmine.SpyObj<Router>;

  let currentUserSubject: BehaviorSubject<AppUser | null>;
  let peopleCacheSubject: BehaviorSubject<SwapiEntity[]>;
  let starshipsCacheSubject: BehaviorSubject<SwapiEntity[]>;

  beforeEach(async () => {
    currentUserSubject = new BehaviorSubject<AppUser | null>(null);
    peopleCacheSubject = new BehaviorSubject<SwapiEntity[]>([]);
    starshipsCacheSubject = new BehaviorSubject<SwapiEntity[]>([]);

    mockState = jasmine.createSpyObj('AppStateService', ['clearLoggedInUser'], {
      currentUser$: currentUserSubject.asObservable(),
      peopleCache$: peopleCacheSubject.asObservable(),
      starshipsCache$: starshipsCacheSubject.asObservable(),
    });

    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [DashboardView],
      providers: [
        {provide: AppStateService, useValue: mockState},
        {provide: Router, useValue: mockRouter}
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardView);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle favorite filter and filter data', () => {
    component.swapiPeople = [
      {uid: 'p1', name: 'Person 1', url: 'url1', isFavorite: true},
      {uid: 'p2', name: 'Person 2', url: 'url2', isFavorite: false},
    ];
    component.swapiStarships = [
      {uid: 's1', name: 'Ship 1', url: 'ship1', isFavorite: true},
      {uid: 's2', name: 'Ship 2', url: 'ship2', isFavorite: false},
    ];

    component.swapiPeopleFilterControl = [...component.swapiPeople];
    component.swapiStarshipFilterControl = [...component.swapiStarships];

    component.onlyFavorites = false;
    component.toggleFavoriteFilter();

    expect(component.onlyFavorites).toBeTrue();
    expect(component.swapiPeople.length).toBe(1);
    expect(component.swapiPeople[0].isFavorite).toBeTrue();
    expect(component.swapiStarships.length).toBe(1);
    expect(component.swapiStarships[0].isFavorite).toBeTrue();

    component.toggleFavoriteFilter();

    expect(component.onlyFavorites).toBeFalse();
    expect(component.swapiPeople.length).toBe(2);
    expect(component.swapiStarships.length).toBe(2);
  });

  it('should clear user and navigate on logout', () => {
    spyOn(localStorage, 'removeItem');
    component.handleLogoutButton();

    expect(localStorage.removeItem).toHaveBeenCalledWith(AUTH_TOKEN_KEY);
    expect(mockState.clearLoggedInUser).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['']);
  });

  it('should reset onlyFavorites when safeguard emitter is called', () => {
    component.onlyFavorites = true;
    component.handleSafeguardEmitter();
    expect(component.onlyFavorites).toBeFalse();
  });
});
