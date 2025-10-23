import {Routes} from '@angular/router';

import {TransactionsComponent} from "./transactions/transactions.component";
import {BuySellComponent} from "./buy-sell/buy-sell.component";
import {OrdersComponent} from "./orders/orders.component";
import {WalletComponent} from "./wallet/wallet.component";
import {IcoComponent} from "./ico/ico.component";
import {KycComponent} from "./kyc/kyc.component";

export default [
  {
    path: "transactions",
    component: TransactionsComponent
  },
  {
    path: "buy-sell",
    component: BuySellComponent
  },
  {
    path: "orders",
    component: OrdersComponent
  },
  {
    path: "wallet",
    component: WalletComponent
  },
  {
    path: "ico",
    component: IcoComponent
  },
  {
    path: "kyc",
    component: KycComponent
  }
] as Routes;
