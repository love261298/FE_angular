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
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  private productService = inject(ProductService);
  data: any = [];
  ngOnInit(): void {
    this.productService.getProducts().subscribe({
      next: (res) => {
        this.data = res.products;
      },
      error: (err) => {
        console.log(err.error.message);
      },
    });
  }

  getImageSrc(imageData: { type: string; data: number[] }): string {
    if (!imageData || !imageData.data.length) return '';
    const uint8Array = new Uint8Array(imageData.data);
    const blob = new Blob([uint8Array], { type: 'image/jpeg' });
    return URL.createObjectURL(blob);
  }

  getProductById(id: string): void {
    this.productService.getProductById(id).subscribe({
      next: (res) => {
        this.data = res.products;
      },
      error: (err) => {
        console.log(err.error.message);
      },
    });
  }
}
