import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class IdGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const id = route.paramMap.get('id');
    if (id) {
      return true;
    } else {
      this.router.navigate(['/error']);
      return false;
    }
  }
}
