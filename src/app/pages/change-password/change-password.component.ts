import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { ButtonComponent } from '../../components/button/button.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonComponent,
    NavbarComponent,
  ],
  templateUrl: './change-password.component.html',
})
export class ChangePasswordComponent {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private router = inject(Router);

  passwordForm: FormGroup = this.fb.group({
    oldPassword: ['', [Validators.required, Validators.minLength(6)]],
    newPassword: ['', [Validators.required, Validators.minLength(6)]],
    newPasswordConfirm: ['', [Validators.required, Validators.minLength(6)]],
  });

  onSubmit() {
    if (this.passwordForm.valid) {
      const passwordForm = this.passwordForm.value;

      this.userService.changePassword(passwordForm).subscribe({
        next: () => {
          alert('Đổi mật khẩu thành công');
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          alert(err.error.message || 'Có lỗi xảy ra, vui lòng thử lại!');
        },
      });
    }
  }
}
