import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MultipurposeListComponent } from './multipurpose-list.component';
import { AppStateService } from '../../../services/app-state.service';
import { DbConnectorService } from '../../../services/db-connector.service';
import { MatDialog } from '@angular/material/dialog';
import { of, BehaviorSubject } from 'rxjs';
import { MULTI_LIST_CONFIG } from '../../../utils/multipurpose-list-configs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('MultipurposeListComponent', () => {
  let component: MultipurposeListComponent;
  let fixture: ComponentFixture<MultipurposeListComponent>;
  let mockStateService: jasmine.SpyObj<AppStateService>;
  let mockDbService: jasmine.SpyObj<DbConnectorService>;
  let mockDialog: jasmine.SpyObj<MatDialog>;

  const mockUser = {
    id: '123',
    favoritePeople: [],
    favoriteStarships: [],
  };

  beforeEach(async () => {
    mockStateService = jasmine.createSpyObj('AppStateService', ['refreshUsersFavorites']);
    mockStateService.currentUser$ = new BehaviorSubject(mockUser);

    mockDbService = jasmine.createSpyObj('DbConnectorService', ['updateUserById']);
    mockDbService.updateUserById.and.returnValue(of(void 0));

    mockDialog = jasmine.createSpyObj('MatDialog', ['open']);
    mockDialog.open.and.returnValue({ afterClosed: () => of('closed') } as any);

    await TestBed.configureTestingModule({
      declarations: [MultipurposeListComponent],
      providers: [
        { provide: AppStateService, useValue: mockStateService },
        { provide: DbConnectorService, useValue: mockDbService },
        { provide: MatDialog, useValue: mockDialog }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(MultipurposeListComponent);
    component = fixture.componentInstance;
    component.config = MULTI_LIST_CONFIG.PEOPLE;
    component.data = [{
      url: 'url-1',
      name: 'Luke Skywalker',
      isFavorite: false
    }];
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should emit favoriteActionSafeguard and toggle favorite for person', () => {
    spyOn(component.favoriteActionSafeguard, 'emit');

    component.toggleFavorite(component.data[0]);

    expect(component.favoriteActionSafeguard.emit).toHaveBeenCalled();
    expect(mockDbService.updateUserById).toHaveBeenCalledWith('123', jasmine.any(Object));
  });

  it('should open details dialog with correct data', () => {
    component.showDetails(component.data[0]);

    expect(mockDialog.open).toHaveBeenCalledWith(jasmine.any(Function), {
      data: {
        entity: component.data[0],
        context: component.config.context
      }
    });
  });

  it('should call updatePeopleData() on unfavoriting', () => {
    component.data[0].isFavorite = true;
    mockStateService.currentUser$.next({
      ...mockUser,
      favoritePeople: [{ url: 'url-1', isFavorite: true }]
    });

    component.toggleFavorite(component.data[0]);

    expect(mockDbService.updateUserById).toHaveBeenCalled();
  });
});
