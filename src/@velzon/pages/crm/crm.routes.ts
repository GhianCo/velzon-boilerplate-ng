import {Routes} from '@angular/router';

import {ContactsComponent} from "./contacts/contacts.component";
import {CompaniesComponent} from "./companies/companies.component";
import {DealsComponent} from "./deals/deals.component";
import {LeadsComponent} from "./leads/leads.component";

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
