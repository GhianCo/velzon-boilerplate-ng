import { Routes } from '@angular/router';

import {MainCalendarComponent} from "./calendar/main-calendar/main-calendar.component";
import {MonthGridComponent} from "./calendar/month-grid/month-grid.component";
import {ChatComponent} from "./chat/chat.component";
import {MailboxComponent} from "./mailbox/mailbox.component";
import {WidgetsComponent} from "./widgets/widgets.component";
import {EmailBasicComponent} from "./email/email-basic/email-basic.component";
import {EmailEcommerceComponent} from "./email/email-ecommerce/email-ecommerce.component";
import {FileManagerComponent} from "./file-manager/file-manager.component";
import {TodoComponent} from "./todo/todo.component";
import {ApikeyComponent} from "./apikey/apikey.component";

export default [
  {
    path: "calendar",
    component: MainCalendarComponent
  },
  {
    path: "month-grid",
    component: MonthGridComponent
  },
  {
    path: "chat",
    component: ChatComponent
  },
  {
    path: "mailbox",
    component: MailboxComponent
  },
  {
    path: "widgets",
    component: WidgetsComponent
  },
  {
    path: "email-basic",
    component: EmailBasicComponent
  },
  {
    path: "email-ecommerce",
    component: EmailEcommerceComponent
  },
  {
    path: "file-manager",
    component: FileManagerComponent
  },
  {
    path: "todo",
    component: TodoComponent
  },
  {
    path: "apikey",
    component: ApikeyComponent
  },
  {
    path: 'jobs', loadChildren: () => import('./jobs/jobs.routes')
  },
] as Routes;
