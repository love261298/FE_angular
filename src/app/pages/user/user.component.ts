import { UserService } from './../../services/user.service';
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    NavbarComponent,
    ButtonModule,
    InputTextModule,
    SelectModule,
  ],
  templateUrl: './user.component.html',
})
export class UserComponent implements OnInit {
  private userService = inject(UserService);
  isLoading: boolean = false;
  data: any[] = [];
  isUpdate = false;
  userForm!: FormGroup;
  selectedUserId: string | null = null;
  roles = [
    { label: 'User', value: 'user' },
    { label: 'Admin', value: 'admin' },
  ];
  async ngOnInit() {
    this.initForm();
    await this.loadMore();
  }

  initForm() {
    this.userForm = new FormGroup({
      phone: new FormControl('', [
        Validators.required,
        Validators.pattern('^[0-9]{10,11}$'),
      ]),
      name: new FormControl('', Validators.required),
      role: new FormControl('user', Validators.required),
    });
  }
  async loadMore() {
    if (this.isLoading) return;
    this.isLoading = true;

    const lastId = this.data.length
      ? this.data[this.data.length - 1]._id
      : null;

    this.userService.getUser(lastId).subscribe({
      next: (res) => {
        if (res.users.length) {
          this.data = [...this.data, ...res.users];
        } else {
          alert('Không còn người dùng để tải');
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Lỗi khi lấy người dùng', err);
        this.isLoading = false;
      },
    });
  }
  udeUser(user: any) {
    this.userForm.patchValue({
      name: user?.name || '',
      phone: user?.phone || '',
      role: user?.role || 'user',
    });
    this.selectedUserId = user._id;
    this.isUpdate = true;
  }

  async deleteUser(id: string) {
    if (!confirm('Bạn có chắc chắn muốn xóa người dùng này không?')) return;

    try {
      this.userService.deleteUser(id).subscribe({
        next: (res) => {
          this.data = res.users;
        },
        error: (err) => {
          console.error(err?.error?.message);
        },
      });
      alert('Xóa người dùng thành công');
      this.data = this.data.filter((user) => user.id !== id);
    } catch (err: any) {
      console.error(err?.error?.message);
    }
  }

  async submitForm() {
    if (this.userForm.invalid) {
      alert('Vui lòng điền đầy đủ thông tin hợp lệ.');
      return;
    }

    const formData = { ...this.userForm.value };

    try {
      if (this.isUpdate && this.selectedUserId !== null) {
        this.userService.updateUser(this.selectedUserId, formData).subscribe({
          next: (res) => {
            window.location.reload();
          },
          error: (err) => {
            console.error(err?.error?.message);
          },
        });
        alert('Cập nhật thông tin người dùng thành công');
      }
      this.resetForm();
    } catch (err: any) {
      console.error(err?.error?.message);
    }
  }
  resetForm() {
    this.isUpdate = false;
    this.selectedUserId = null;
    this.userForm.reset();
  }
}
