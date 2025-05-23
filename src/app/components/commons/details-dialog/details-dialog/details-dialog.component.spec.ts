import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DetailsDialogComponent } from './details-dialog.component';
import { SwapiConnectorService } from '../../../../services/swapi-connector.service';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('DetailsDialogComponent', () => {
  let component: DetailsDialogComponent;
  let fixture: ComponentFixture<DetailsDialogComponent>;
  let mockSwapiConnectorService: jasmine.SpyObj<SwapiConnectorService>;

  const mockResponse = {
    result: {
      description: 'A brave Jedi knight.',
      properties: {
        name: 'Luke Skywalker',
        gender: 'male',
        height: '172',
        birth_year: '19BBY',
        hair_color: 'blond',
        eye_color: 'blue'
      }
    }
  };

  beforeEach(async () => {
    mockSwapiConnectorService = jasmine.createSpyObj('SwapiConnectorService', ['getPersonDetails']);
    mockSwapiConnectorService.getPersonDetails.and.returnValue(of(mockResponse));

    await TestBed.configureTestingModule({
      declarations: [DetailsDialogComponent],
      providers: [
        { provide: SwapiConnectorService, useValue: mockSwapiConnectorService },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            context: 'people',
            entity: {
              url: 'https://swapi.dev/api/people/1/'
            }
          }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(DetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load data and set properties correctly', fakeAsync(() => {
    tick();

    expect(component.isLoaded).toBeTrue();
    expect(component.description).toBe('A brave Jedi knight.');
    expect(component.properties.name).toBe('Luke Skywalker');
    expect(component.properties.gender).toBe('male');
  }));
});
