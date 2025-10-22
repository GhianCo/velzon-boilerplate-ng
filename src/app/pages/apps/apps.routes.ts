import { Routes } from '@angular/router';

import {MainCalendarComponent} from "@app/pages/apps/calendar/main-calendar/main-calendar.component";
import {MonthGridComponent} from "@app/pages/apps/calendar/month-grid/month-grid.component";
import {ChatComponent} from "@app/pages/apps/chat/chat.component";
import {MailboxComponent} from "@app/pages/apps/mailbox/mailbox.component";
import {WidgetsComponent} from "@app/pages/apps/widgets/widgets.component";
import {EmailBasicComponent} from "@app/pages/apps/email/email-basic/email-basic.component";
import {EmailEcommerceComponent} from "@app/pages/apps/email/email-ecommerce/email-ecommerce.component";
import {FileManagerComponent} from "@app/pages/apps/file-manager/file-manager.component";
import {TodoComponent} from "@app/pages/apps/todo/todo.component";
import {ApikeyComponent} from "@app/pages/apps/apikey/apikey.component";

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
