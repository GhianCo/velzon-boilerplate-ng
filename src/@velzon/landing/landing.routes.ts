import {Routes} from '@angular/router';
import {IndexComponent} from "@velzon/landing/index/index.component";
import {NftComponent} from "@velzon/landing/nft/nft.component";
import {JobComponent} from "@velzon/landing/job/job.component";

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
