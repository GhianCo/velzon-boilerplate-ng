import {Routes} from '@angular/router';

import {ProductsComponent} from "@app/pages/ecommerce/products/products.component";
import {ProductDetailComponent} from "@app/pages/ecommerce/product-detail/product-detail.component";
import {AddProductComponent} from "@app/pages/ecommerce/add-product/add-product.component";
import {OrdersComponent} from "@app/pages/ecommerce/orders/orders.component";
import {OrdersDetailsComponent} from "@app/pages/ecommerce/orders-details/orders-details.component";
import {CustomersComponent} from "@app/pages/ecommerce/customers/customers.component";
import {CartComponent} from "@app/pages/ecommerce/cart/cart.component";
import {CheckoutComponent} from "@app/pages/ecommerce/checkout/checkout.component";
import {SellersComponent} from "@app/pages/ecommerce/sellers/sellers.component";
import {SellerDetailsComponent} from "@app/pages/ecommerce/seller-details/seller-details.component";

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
