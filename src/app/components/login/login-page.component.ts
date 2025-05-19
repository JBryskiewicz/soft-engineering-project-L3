import {Component, NgZone} from '@angular/core';
import {FormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import {DbConnectorService} from '../../services/db-connector.service';
import {take} from 'rxjs';
import {Router} from '@angular/router';
import {AUTH_TOKEN_KEY} from '../../../environments/env';
import {AppStateService} from '../../services/app-state.service';
// import {Validator, FormGroup} from '@angular/forms'

// TODO For Ignacy => You can implement simple input validation
// https://v17.angular.io/guide/form-validation -> We use Reactive Forms here
// Also, if username exists on register validation should not pass and register fails.
// Display message that user was registered successfully,
// automatically fill the loginForm and switch mode to isLoginMode = true;

// const INIT_FORM = {username: '', password: ''}

@Component({
  selector: 'login-page',
  standalone: false,
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent {

  protected loginForm: UntypedFormGroup;

  protected isLoginMode: boolean = true;

  constructor(
    private db: DbConnectorService,
    private state: AppStateService,
    private router: Router,
    private formBuilder: FormBuilder,
    private ngZone: NgZone,
  ) {
    // this.loginForm = this.formBuilder.group(INIT_FORM);
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(5)]],
    });
  }

  protected switchLoginMode(): void {
    this.isLoginMode = !this.isLoginMode;
  }

  protected handleLoginOrRegister(): void {
    if (this.loginForm.invalid) {
      console.error('Form invalid');
      return;
    }
    this.isLoginMode
      ? this.loginAction()
      : this.registerAction();
  }

  private loginAction(): void {
    const {username, password} = this.loginForm.value;
    this.db.getUserByUsername(username).pipe(take(1)).subscribe(user => {
      if (user && user.password === password) {
        localStorage.setItem(AUTH_TOKEN_KEY, user.id);
        this.state.cacheLoggedInUser();
        this.router.navigate(['/dashboard']);
      } else {
        console.error('Invalid username or password');
      }
      this.loginForm.reset();
      // if (user.password === password) {
      //   this.router.navigate(['/dashboard']);
      //   localStorage.setItem(AUTH_TOKEN_KEY, user.id);
      //   this.state.cacheLoggedInUser();
      // }
      // this.loginForm.patchValue(INIT_FORM);
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
          // this.loginForm.reset();
          // this.isLoginMode = true;
          // this.loginForm.patchValue({ username, password: '' });
          this.isLoginMode = true;
          this.loginForm.reset({ username, password: ''});
        });
      } else {
        console.error('User exists... Sign up process failed.'); // print to console (not a proper handling)
        this.loginForm.reset();
      }
      // this.loginForm.patchValue(INIT_FORM);
    });
  }
}
