import {Routes} from '@angular/router';

import {ProductsComponent} from "./products/products.component";
import {ProductDetailComponent} from "./product-detail/product-detail.component";
import {AddProductComponent} from "./add-product/add-product.component";
import {OrdersComponent} from "./orders/orders.component";
import {OrdersDetailsComponent} from "./orders-details/orders-details.component";
import {CustomersComponent} from "./customers/customers.component";
import {CartComponent} from "./cart/cart.component";
import {CheckoutComponent} from "./checkout/checkout.component";
import {SellersComponent} from "./sellers/sellers.component";
import {SellerDetailsComponent} from "./seller-details/seller-details.component";

export default [
  {
    path: "products",
    component: ProductsComponent
  },
  {
    path: "product-detail/:any",
    component: ProductDetailComponent
  },
  {
    path: "add-product",
    component: AddProductComponent
  },
  {
    path: "orders",
    component: OrdersComponent
  },
  {
    path: "order-details",
    component: OrdersDetailsComponent
  },
  {
    path: "customers",
    component: CustomersComponent
  },
  {
    path: "cart",
    component: CartComponent
  },
  {
    path: "checkout",
    component: CheckoutComponent
  },
  {
    path: "sellers",
    component: SellersComponent
  },
  {
    path: "seller-details",
    component: SellerDetailsComponent
  }
] as Routes;
