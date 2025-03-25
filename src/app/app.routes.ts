import { Routes } from '@angular/router';
import { RegisterComponent } from './pages/register/register.component';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ProductComponent } from './pages/creat-product/product.component';
import { UserComponent } from './pages/user/user.component';
import { ChangePasswordComponent } from './pages/change-password/change-password.component';
import { authGuard } from './services/auth.guard';

export const routes: Routes = [
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  {
    path: '',
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'product/create', component: ProductComponent },
      { path: 'user', component: UserComponent },
      { path: 'password', component: ChangePasswordComponent },
    ],
  },
  { path: '**', redirectTo: 'login', pathMatch: 'full' },
];
