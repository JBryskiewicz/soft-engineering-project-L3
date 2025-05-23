import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginPageComponent } from './login-page.component';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import {DbConnectorService} from '../../services/db-connector.service';
import {AppStateService} from '../../services/app-state.service';
import {AppUser} from '../../domain/types';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';

describe('LoginPageComponent', () => {
  let component: LoginPageComponent;
  let fixture: ComponentFixture<LoginPageComponent>;
  let mockDb: jasmine.SpyObj<DbConnectorService>;
  let mockState: jasmine.SpyObj<AppStateService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockDb = jasmine.createSpyObj('DbConnectorService', ['getUserByUsername', 'getUsers', 'addUser']);
    mockState = jasmine.createSpyObj('AppStateService', ['cacheLoggedInUser']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [LoginPageComponent],
      imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
      ],
      providers: [
        { provide: DbConnectorService, useValue: mockDb },
        { provide: AppStateService, useValue: mockState },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with empty controls', () => {
    expect(component.loginForm.value).toEqual({ username: '', password: '' });
  });

  it('should invalidate the form if fields are empty', () => {
    component.loginForm.setValue({ username: '', password: '' });
    expect(component.loginForm.valid).toBeFalse();
  });

  it('should toggle login mode', () => {
    expect(component.isLoginMode).toBeTrue();
    component.switchLoginMode();
    expect(component.isLoginMode).toBeFalse();
  });

  it('should login user if credentials are correct', () => {
    const mockUser: AppUser = {
      id: 'u123',
      username: 'admin',
      password: 'admin',
      favoritePeople: [],
      favoriteStarships: []
    };
    component.loginForm.setValue({
      username: mockUser.username,
      password: mockUser.password,
    });
    mockDb.getUserByUsername.and.returnValue(of(mockUser));

    component.handleLoginOrRegister();

    expect(mockDb.getUserByUsername).toHaveBeenCalledWith('admin');
    expect(mockState.cacheLoggedInUser).toHaveBeenCalledWith(mockUser);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should register user if username is not taken', () => {
    component.switchLoginMode();
    component.loginForm.setValue({ username: 'admin', password: 'admin' });

    mockDb.getUsers.and.returnValue(of([]));
    mockDb.addUser.and.returnValue(of({}));

    component.handleLoginOrRegister();

    expect(mockDb.getUsers).toHaveBeenCalled();
    expect(mockDb.addUser).toHaveBeenCalledWith(jasmine.objectContaining({
      username: 'admin',
      password: 'admin',
    }));
  });
});
