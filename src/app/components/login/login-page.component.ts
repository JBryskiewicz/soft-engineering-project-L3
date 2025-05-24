import {Component, NgZone, OnInit} from '@angular/core';
import {FormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import {DbConnectorService} from '../../services/db-connector.service';
import {take} from 'rxjs';
import {Router} from '@angular/router';
import {AUTH_TOKEN_KEY} from '../../../environments/env';
import {AppStateService} from '../../services/app-state.service';

@Component({
  selector: 'login-page',
  standalone: false,
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent implements OnInit{

  public loginForm: UntypedFormGroup;

  public isLoginMode: boolean = true;

  public loginError: {isError: boolean; errorMessage: string} = {isError: false, errorMessage: 'Invalid Input'};

  constructor(
    private db: DbConnectorService,
    private state: AppStateService,
    private router: Router,
    private formBuilder: FormBuilder,
  ) {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(5)]],
    });
  }

  ngOnInit() {
    this.loginForm.valueChanges.subscribe(() => {
      if (this.loginError.isError) {
        this.loginError = { isError: false, errorMessage: '' };
      }
    })
  }

  public switchLoginMode(): void {
    this.isLoginMode = !this.isLoginMode;
  }

  public handleLoginOrRegister(): void {
    if (this.loginForm.invalid) {
      const message = this.isLoginMode ? 'Incorrect credentials' : 'Input invalid'
      this.loginError = { isError: true, errorMessage: message };
      return;
    }

    this.isLoginMode
      ? this.loginAction()
      : this.registerAction();
  }

  // this is login mockup, real auth should not be done this way
  private loginAction(): void {
    const {username, password} = this.loginForm.value;
    this.db.getUserByUsername(username).pipe(take(1)).subscribe(user => {
      if (user && user.password === password) {
        this.state.cacheLoggedInUser(user);
        this.router.navigate(['/dashboard']);
      } else {
        console.error('Invalid username or password');
      }
      this.loginForm.reset();
    });
  }

  private registerAction(): void {
    const {username, password} = this.loginForm.value;
    this.db.getUsers().pipe(take(1)).subscribe(users => {
      if (!users.find(u => u.username === username)) {
        this.db.addUser({
          username: username,
          password: password,
          favoritePeople: [],
        }).subscribe(() => {
          console.log('User registered successfully');
          this.isLoginMode = true;
          this.loginForm.reset({ username, password: ''});
        });
      } else {
        console.error('User exists... Sign up process failed.'); // print to console (not a proper handling)
        this.loginForm.reset();
      }
    });
  }
}
