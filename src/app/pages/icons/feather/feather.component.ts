import { Component, OnInit } from '@angular/core';
import { Icons } from './feather-icons.model';
import { IconsData } from '@appCore/data';
import { ToastService } from './toast-service';
import {BreadcrumbsComponent} from "@shared/breadcrumbs/breadcrumbs.component";
import {ToastsContainerfeathericon} from "@app/pages/icons/feather/toasts-container.component";
import {FeatherIconsModule} from "@sharedModules/feather-icons.module";

@Component({
  selector: 'app-feather',
  templateUrl: './feather.component.html',
  styleUrls: ['./feather.component.scss'],
  imports: [
    BreadcrumbsComponent,
    ToastsContainerfeathericon,
    FeatherIconsModule
  ],
  standalone: true
})

/**
 * Feather Component
 */
export class FeatherComponent implements OnInit {

  // bread crumb items
  breadCrumbItems!: Array<{}>;
  IconsData!: Icons[];

  constructor(public toastService: ToastService) { }

  ngOnInit(): void {
    /**
    * BreadCrumb
    */
    this.breadCrumbItems = [
      { label: 'Icons' },
      { label: 'Feather', active: true }
    ];

    setTimeout(() => {
      /***
      * All Data Get
      */
      this.fetchData();
    }, 300);
  }

  /**
   * Fetches the data
   */
  private fetchData() {
    this.IconsData = IconsData;
  }


  copytext(icon: any) {
    navigator.clipboard.writeText(icon);
    this.toastService.show(icon + ' icon Copied Successfully !!!', { classname: 'bg-success text-center text-white', delay: 5000 });
  }
}
