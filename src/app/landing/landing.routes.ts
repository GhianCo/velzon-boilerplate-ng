import {Routes} from '@angular/router';
import {IndexComponent} from "@app/landing/index/index.component";
import {NftComponent} from "@app/landing/nft/nft.component";
import {JobComponent} from "@app/landing/job/job.component";

export default [
  {
    path: "",
    component: IndexComponent
  },
  {
    path: "nft",
    component: NftComponent
  },
  {
    path: "job",
    component: JobComponent
  }
] as Routes;
