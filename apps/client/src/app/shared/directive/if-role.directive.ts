import {
  ComponentFactoryResolver,
  Directive,
  Input,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import {UserRole} from '../../../../../../libs/shared_models/enum/user-role';
import {RoleSelectionService} from '../../private/service/role-selection/role-selection.service';

@Directive({
  selector: '[ifRole]',
})
export class IfRoleDirective {
  @Input() set ifRole(roles: UserRole[]) {
    const isAuthorized = this.roleSelectionService.hasRole(roles)
    if (isAuthorized && !this.hasView) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
    } else if (!isAuthorized) {
       if (this.hasView) {
        this.hideElement();
      }
    }
  }

  private hasView = false;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private roleSelectionService: RoleSelectionService,
    private resolver: ComponentFactoryResolver
  ) {}

  hideElement() {
    this.viewContainer.clear();
    this.hasView = false;
  }
}
