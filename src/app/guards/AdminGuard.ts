import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { map, Observable, take } from "rxjs";
import { AuthService } from "../services/auth-services";

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): 
    boolean | UrlTree | Promise<boolean | UrlTree> | Observable<boolean | UrlTree> {
        return this.authService.userSub.pipe(
            take(1),
            map(user => {
                const isAuth = !!user;
                const isAdmin = user?.role === 'Admin';
                if (isAuth && isAdmin) {
                    return true;
                } else {
                    return this.router.createUrlTree(['/home']);
                }
            })
        );
    }
}
