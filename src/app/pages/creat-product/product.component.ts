import { Title } from '@angular/platform-browser';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonComponent } from '../../components/button/button.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonComponent,
    NavbarComponent,
  ],
  styleUrls: ['./product.component.css'],
})
export class ProductComponent implements OnInit {
  private r = inject(Router);
  check: string = 'create';
  private router = inject(ActivatedRoute);
  productForm: FormGroup;
  selectedFile: File | null = null;
  private productService = inject(ProductService);

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.productForm = this.fb.group({
      id: [''],
      title: [''],
      price: [''],
      image: [null],
    });
  }

  ngOnInit(): void {
    this.router.queryParams.subscribe({
      next: (res) => {
        this.productForm.patchValue({
          id: res['_id'] || '',
          title: res['title'] || '',
          price: res['price'] || '',
        });
        this.check = res['check'];
      },
    });
    console.log(this.check);
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  getImageSrc(imageData: { type: string; data: number[] }): string {
    if (!imageData || !imageData.data.length) return '';
    const uint8Array = new Uint8Array(imageData.data);
    const blob = new Blob([uint8Array], { type: 'image/jpeg' });
    return URL.createObjectURL(blob);
  }
  submitForm() {
    if (this.check !== 'delete') {
      if (!this.selectedFile) {
        alert('Vui lòng chọn một hình ảnh!');
        return;
      }
      const formData = new FormData();
      formData.append('title', this.productForm.get('title')?.value);
      formData.append('price', this.productForm.get('price')?.value);
      formData.append('image', this.selectedFile);
      if (this.productForm.value.id) {
        this.productService
          .update(this.productForm.value.id, formData)
          .subscribe({
            next: (response) => {
              console.log('Cập nhật sản phẩm thành công', response);
              alert('Cập nhật sản phẩm thành công');
              this.productForm.reset();
            },
            error: (err) => {
              console.error('Lỗi khi thêm sản phẩm:', err.error.message);
              alert('Thêm sản phẩm thất bại!');
            },
          });
      } else {
        this.productService.createProduct(formData).subscribe({
          next: (response) => {
            console.log('Cập nhật sản phẩm thành công', response);
            alert('Cập nhật sản phẩm thành công');
            this.productForm.reset();
          },
          error: (err) => {
            console.error('Lỗi khi thêm sản phẩm:', err.error.message);
            alert('Thêm sản phẩm thất bại!');
          },
        });
      }
    } else {
      this.productService.deleteProduct(this.productForm.value.id).subscribe({
        next: (response) => {
          alert('Xóa sản phẩm thành công!');
          this.productForm.reset();
        },
        error: (error) => {
          alert('Xóa sản phẩm thất bại!');
        },
      });
    }
    setTimeout(() => {
      this.r.navigate(['/dashboard']);
    }, 500);
  }
}
