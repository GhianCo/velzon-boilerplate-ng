import {Routes} from '@angular/router';

import {ContactsComponent} from "@app/pages/crm/contacts/contacts.component";
import {CompaniesComponent} from "@app/pages/crm/companies/companies.component";
import {DealsComponent} from "@app/pages/crm/deals/deals.component";
import {LeadsComponent} from "@app/pages/crm/leads/leads.component";

export default [
  {
    path: "contacts",
    component: ContactsComponent
  },
  {
    path: "companies",
    component: CompaniesComponent
  },
  {
    path: "deals",
    component: DealsComponent
  },
  {
    path: "leads",
    component: LeadsComponent
  }
] as Routes;
