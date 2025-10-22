import {Routes} from '@angular/router';

import {TransactionsComponent} from "@app/pages/crypto/transactions/transactions.component";
import {BuySellComponent} from "@app/pages/crypto/buy-sell/buy-sell.component";
import {OrdersComponent} from "@app/pages/crypto/orders/orders.component";
import {WalletComponent} from "@app/pages/crypto/wallet/wallet.component";
import {IcoComponent} from "@app/pages/crypto/ico/ico.component";
import {KycComponent} from "@app/pages/crypto/kyc/kyc.component";

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
