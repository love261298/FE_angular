import { Component, inject, OnInit } from '@angular/core';
import { ButtonComponent } from '../../components/button/button.component';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    ButtonComponent,
    ReactiveFormsModule,
    RouterModule,
    NavbarComponent,
  ],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  private productService = inject(ProductService);
  data: any = [];
  isLoading = false;
  ngOnInit(): void {
    this.loadMore();
  }

  getImageSrc(imageData: { type: string; data: number[] }): string {
    if (!imageData || !imageData.data.length) return '';
    const uint8Array = new Uint8Array(imageData.data);
    const blob = new Blob([uint8Array], { type: 'image/jpeg' });
    return URL.createObjectURL(blob);
  }
  loadMore() {
    if (this.isLoading) return;
    this.isLoading = true;

    const lastId = this.data.length
      ? this.data[this.data.length - 1]._id
      : null;

    this.productService.getProducts(lastId).subscribe(
      (res) => {
        if (res.products.length) {
          this.data = [...this.data, ...res.products];
        } else {
          alert('Không còn sản phẩm để tải');
        }
        this.isLoading = false;
      },
      (err) => {
        console.error('Lỗi khi lấy sản phẩm', err);
        this.isLoading = false;
      }
    );
  }
}
