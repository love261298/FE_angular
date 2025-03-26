import { UserService } from './../../services/user.service';
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ButtonComponent } from '../../components/button/button.component';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    CommonModule,
    ButtonComponent,
    ReactiveFormsModule,
    RouterModule,
    NavbarComponent,
  ],
  templateUrl: './user.component.html',
})
export class UserComponent implements OnInit {
  private userService = inject(UserService);
  private fb = inject(FormBuilder);

  data: any[] = [];
  isUpdate = false;
  userForm!: FormGroup;
  selectedUserId: string | null = null;

  async ngOnInit() {
    this.initForm();
    await this.loadUsers();
  }
  setIsUpdate() {
    this.isUpdate = false;
  }
  // Khởi tạo form
  initForm() {
    this.userForm = this.fb.group({
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10,11}$')]],
      name: ['', Validators.required],
      role: ['user', Validators.required],
    });
  }

  // Tải danh sách user từ API
  async loadUsers() {
    try {
      const res = await firstValueFrom(this.userService.getUser());
      this.data = res.user;
    } catch (err: any) {
      console.error(err?.error?.message);
    }
  }

  // Cập nhật thông tin user
  updateUser(user: any) {
    this.userForm.patchValue({
      name: user?.name || '',
      phone: user?.phone || '',
      role: user?.role || 'user',
    });
    this.selectedUserId = user.id;
    this.isUpdate = true;
  }

  // Xóa user có xác nhận
  async deleteUser(id: string) {
    if (!confirm('Bạn có chắc chắn muốn xóa người dùng này không?')) return;

    try {
      await firstValueFrom(this.userService.deleteUser(id));
      alert('Xóa người dùng thành công');
      this.data = this.data.filter((user) => user.id !== id);
    } catch (err: any) {
      console.error(err?.error?.message);
    }
  }

  // Xử lý form submit (cập nhật/thêm mới user)
  async submitForm() {
    if (this.userForm.invalid) {
      alert('Vui lòng điền đầy đủ thông tin hợp lệ.');
      return;
    }

    const formData = { ...this.userForm.value };

    try {
      if (this.isUpdate && this.selectedUserId !== null) {
        // Cập nhật user
        formData.id = this.selectedUserId;
        await firstValueFrom(this.userService.updateUser(formData));
        alert('Cập nhật thông tin người dùng thành công');
        this.data = this.data.map((user) =>
          user.id === formData.id ? { ...user, ...formData } : user
        );
      }
      // Reset form và trạng thái
      this.resetForm();
    } catch (err: any) {
      console.error(err?.error?.message);
    }
  }

  // Reset form sau khi hoàn thành thao tác
  resetForm() {
    this.isUpdate = false;
    this.selectedUserId = null;
    this.userForm.reset();
  }
}
