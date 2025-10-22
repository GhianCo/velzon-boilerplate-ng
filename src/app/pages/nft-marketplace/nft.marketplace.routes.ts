import {Routes} from '@angular/router';
import {ExploreComponent} from "@app/pages/nft-marketplace/explore/explore.component";
import {AuctionComponent} from "@app/pages/nft-marketplace/auction/auction.component";
import {WalletComponent} from "@app/pages/nft-marketplace/wallet/wallet.component";
import {CreatorsComponent} from "@app/pages/nft-marketplace/creators/creators.component";
import {CreateComponent} from "@app/pages/nft-marketplace/create/create.component";
import {CollectionsComponent} from "@app/pages/nft-marketplace/collections/collections.component";
import {ItemDetailsComponent} from "@app/pages/nft-marketplace/item-details/item-details.component";
import {MarketplaceComponent} from "@app/pages/nft-marketplace/marketplace/marketplace.component";
import {RankingComponent} from "@app/pages/nft-marketplace/ranking/ranking.component";

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
