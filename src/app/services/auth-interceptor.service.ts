import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import {
  HttpRequest,
  HttpHandlerFn,
  HttpEvent,
  HttpErrorResponse,
  HttpStatusCode,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  const router = inject(Router);
  const token = localStorage.getItem('jwt_token');
  const authReq = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(authReq).pipe(
    catchError((error) => {
      if (error instanceof HttpErrorResponse) {
        console.error('HTTP Error:', error);

        switch (error.status) {
          case HttpStatusCode.Unauthorized:
            console.log(HttpStatusCode.Unauthorized);
            console.warn(
              '⚠️ Không được phép! Chuyển hướng đến trang đăng nhập...'
            );
            localStorage.removeItem('jwt_token');
            router.navigate(['/login']);
            break;

          case HttpStatusCode.Forbidden:
            console.warn('⚠️ Bạn không có quyền truy cập!');
            router.navigate(['/dashboard']);
            break;

          default:
            alert(error.error?.message || 'Đã xảy ra lỗi');
        }
      }

      return throwError(
        () => new Error(error?.message || 'Lỗi không xác định')
      );
    })
  );
};
