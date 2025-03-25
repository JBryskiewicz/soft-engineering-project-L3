import {Component} from '@angular/core';
import {FormBuilder, UntypedFormGroup} from '@angular/forms';
import {DbConnectorService} from '../../services/db-connector.service';
import {take} from 'rxjs';
import {Router} from '@angular/router';

// TODO For Ignacy => You can implement simple input validation
// https://v17.angular.io/guide/form-validation -> We use Reactive Forms here

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
    private formBuilder: FormBuilder,
    private db: DbConnectorService,
    private router: Router,
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
      // success
      if (user.password === password) {
        this.router.navigate(['/dashboard']);
        this.loginForm.patchValue(INIT_FORM);
      }
    });
  }

  private registerAction(): void {

  }
}
