import {Routes} from '@angular/router';
import {ExploreComponent} from "./explore/explore.component";
import {AuctionComponent} from "./auction/auction.component";
import {WalletComponent} from "./wallet/wallet.component";
import {CreatorsComponent} from "./creators/creators.component";
import {CreateComponent} from "./create/create.component";
import {CollectionsComponent} from "./collections/collections.component";
import {ItemDetailsComponent} from "./item-details/item-details.component";
import {MarketplaceComponent} from "./marketplace/marketplace.component";
import {RankingComponent} from "./ranking/ranking.component";

export default [
  {
    path: "explore",
    component: ExploreComponent
  },
  {
    path: "auction",
    component: AuctionComponent
  },
  {
    path: "wallet",
    component: WalletComponent
  },
  {
    path: "creators",
    component: CreatorsComponent
  },
  {
    path: "create",
    component: CreateComponent
  },
  {
    path: "collections",
    component: CollectionsComponent
  },
  {
    path: "item-details",
    component: ItemDetailsComponent
  },
  {
    path: "marketplace",
    component: MarketplaceComponent
  },
  {
    path: "raking",
    component: RankingComponent
  }
] as Routes;
