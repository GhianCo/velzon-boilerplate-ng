import {Routes} from '@angular/router';
import {BasicComponent} from "@app/pages/form/basic/basic.component";
import {SelectComponent} from "@app/pages/form/select/select.component";
import {CheckboxsRadiosComponent} from "@app/pages/form/checkboxs-radios/checkboxs-radios.component";
import {PickersComponent} from "@app/pages/form/pickers/pickers.component";
import {MasksComponent} from "@app/pages/form/masks/masks.component";
import {AdvancedComponent} from "@app/pages/form/advanced/advanced.component";
import {RangeSlidersComponent} from "@app/pages/form/range-sliders/range-sliders.component";
import {ValidationComponent} from "@app/pages/form/validation/validation.component";
import {WizardComponent} from "@app/pages/form/wizard/wizard.component";
import {EditorsComponent} from "@app/pages/form/editors/editors.component";
import {FileUploadsComponent} from "@app/pages/form/file-uploads/file-uploads.component";
import {LayoutsComponent} from "@app/pages/form/layouts/layouts.component";

export default [
  {
    path:"basic",
    component: BasicComponent
  },
  {
    path:"select",
    component: SelectComponent
  },
  {
    path:"checkboxs-radios",
    component: CheckboxsRadiosComponent
  },
  {
    path:"pickers",
    component: PickersComponent
  },
  {
    path:"masks",
    component: MasksComponent
  },
  {
    path:"advanced",
    component: AdvancedComponent
  },
  {
    path:"range-sliders",
    component: RangeSlidersComponent
  },
  {
    path:"validation",
    component: ValidationComponent
  },
  {
    path:"wizard",
    component: WizardComponent
  },
  {
    path:"editors",
    component: EditorsComponent
  },
  {
    path:"file-uploads",
    component: FileUploadsComponent
  },
  {
    path:"layouts",
    component: LayoutsComponent
  }
] as Routes;
