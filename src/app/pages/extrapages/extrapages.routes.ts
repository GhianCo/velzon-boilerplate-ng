import {Routes} from '@angular/router';
import {StarterComponent} from "@app/pages/extrapages/starter/starter.component";
import {ProfileComponent} from "@app/pages/extrapages/profile/profile/profile.component";
import {SettingsComponent} from "@app/pages/extrapages/profile/settings/settings.component";
import {TeamComponent} from "@app/pages/extrapages/team/team.component";
import {TimelineComponent} from "@app/pages/extrapages/timeline/timeline.component";
import {FaqsComponent} from "@app/pages/extrapages/faqs/faqs.component";
import {PricingComponent} from "@app/pages/extrapages/pricing/pricing.component";
import {GalleryComponent} from "@app/pages/extrapages/gallery/gallery.component";
import {SitemapComponent} from "@app/pages/extrapages/sitemap/sitemap.component";
import {SearchResultsComponent} from "@app/pages/extrapages/search-results/search-results.component";
import {PrivacyPolicyComponent} from "@app/pages/extrapages/privacy-policy/privacy-policy.component";
import {TermsConditionComponent} from "@app/pages/extrapages/terms-condition/terms-condition.component";
import {PagesBlogListComponent} from "@app/pages/extrapages/pages-blog-list/pages-blog-list.component";
import {PagesBlogGridComponent} from "@app/pages/extrapages/pages-blog-grid/pages-blog-grid.component";
import {PagesBlogOverviewComponent} from "@app/pages/extrapages/pages-blog-overview/pages-blog-overview.component";

export default [
  {
    path: 'starter',
    component: StarterComponent
  },
  {
    path: 'profile',
    component: ProfileComponent
  },
  {
    path: 'profile-setting',
    component: SettingsComponent
  },
  {
    path: 'team',
    component: TeamComponent
  },
  {
    path: 'timeline',
    component: TimelineComponent
  },
  {
    path: 'faqs',
    component: FaqsComponent
  },
  {
    path: 'pricing',
    component: PricingComponent
  },
  {
    path: 'gallery',
    component: GalleryComponent
  },
  {
    path: 'sitemap',
    component: SitemapComponent
  },
  {
    path: 'search-results',
    component: SearchResultsComponent
  },
  {
    path: 'privacy-policy',
    component: PrivacyPolicyComponent
  },
  {
    path: 'terms-condition',
    component: TermsConditionComponent
  },
  {
    path: 'pages-blog-list',
    component: PagesBlogListComponent
  },
  {
    path: 'pages-blog-grid',
    component: PagesBlogGridComponent
  },
  {
    path: 'pages-blog-overview',
    component: PagesBlogOverviewComponent
  }
] as Routes;
