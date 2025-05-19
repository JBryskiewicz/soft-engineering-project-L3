import {Component, NgZone} from '@angular/core';
import {FormBuilder, UntypedFormGroup} from '@angular/forms';
import {DbConnectorService} from '../../services/db-connector.service';
import {take} from 'rxjs';
import {Router} from '@angular/router';
import {AUTH_TOKEN_KEY} from '../../../environments/env';
import {AppStateService} from '../../services/app-state.service';

// TODO For Ignacy => You can implement simple input validation
// https://v17.angular.io/guide/form-validation -> We use Reactive Forms here
// Also, if username exists on register validation should not pass and register fails.
// Display message that user was registered successfully,
// automatically fill the loginForm and switch mode to isLoginMode = true;

const INIT_FORM = {username: '', password: ''}

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
    this.loginForm = this.formBuilder.group(INIT_FORM);
  }

  protected switchLoginMode(): void {
    this.isLoginMode = !this.isLoginMode;
  }

  protected handleLoginOrRegister(): void {
    this.isLoginMode
      ? this.loginAction()
      : this.registerAction();
  }

  private loginAction(): void {
    const {username, password} = this.loginForm.value;
    this.db.getUserByUsername(username).pipe(take(1)).subscribe(user => {
      if (user.password === password) {
          this.router.navigate(['/dashboard']);
          localStorage.setItem(AUTH_TOKEN_KEY, user.id);
          this.state.cacheLoggedInUser();
      }
      this.loginForm.patchValue(INIT_FORM);
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
        });
      } else {
        console.error('User exists... Sign up process failed.'); // print to console (not a proper handling)
      }
      this.loginForm.patchValue(INIT_FORM); // Modify here
    });
  }
}
