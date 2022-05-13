import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { delay, switchMap, tap } from 'rxjs';
import { Details, Order } from 'src/app/shared/interfaces/order.interface';
import { Store } from 'src/app/shared/interfaces/stores.interface';
import { DataService } from 'src/app/shared/services/data.service';
import { ShoppingCartService } from 'src/app/shared/services/shopping-cart.service';
import { Product } from '../products/interface/product.interface';
import { ProductsService } from '../products/services/products.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
})
export class CheckoutComponent implements OnInit {
  model = {
    name: '',
    store: '',
    shippingAddress: '',
    city: '',
  };

  isDelivery = true;

  cart: Product[] = [];

  stores: Store[] = [];

  constructor(
    private dataSvc: DataService,
    private shoppingCartsSvc: ShoppingCartService,
    private router: Router,
    private productSvc: ProductsService
  ) {
    this.checkIfCartIsEmpty();
  }

  ngOnInit(): void {
    this.getStore();
    this.getDataCart();
    this.prepareDetails();
  }

  onPickupOrDelivery(value: boolean): void {
    this.isDelivery = value;
  }

  onSubmit({ value: formData }: NgForm): void {
    const data: Order = {
      ...formData,
      date: this.getCurrentDate(),
      isDelivery: this.isDelivery,
    };
    this.dataSvc
      .saveOrder(data)
      .pipe(
        tap((res) => console.log('Order ->', res)),
        switchMap(({ id: orderId }) => {
          const details = this.prepareDetails();
          return this.dataSvc.saveDetailsOrder({ details, orderId });
        }),
        tap(() => this.router.navigate(['/checkout/thank-you-page'])),
        delay(2000),
        tap(() => this.shoppingCartsSvc.resetCart())
      )
      .subscribe();
  }

  private getStore(): void {
    this.dataSvc
      .getStores()
      .pipe(tap((stores: Store[]) => (this.stores = stores)))
      .subscribe();
  }

  private getCurrentDate(): string {
    return new Date().toLocaleDateString();
  }

  private prepareDetails(): Details[] {
    const details: Details[] = [];
    this.cart.forEach((product: Product) => {
      setTimeout(() => {
        const { id: productId, name: productName, quantity, stock } = product;
        const updateStock = stock - quantity;
        this.productSvc
          .updateStock(productId, updateStock)
          .pipe(tap(() => details.push({ productId, productName, quantity })))
          .subscribe();
      }, 1000);
    });
    return details;
  }

  private getDataCart(): void {
    this.shoppingCartsSvc.cartAction$
      .pipe(tap((products: Product[]) => (this.cart = products)))
      .subscribe();
  }

  private checkIfCartIsEmpty(): void {
    this.shoppingCartsSvc.cartAction$.pipe(
      tap((products: Product[]) => {
        if (Array.isArray(products && !products.length)) {
          this.router.navigate(['/products']);
        }
      })
    );
  }
}
