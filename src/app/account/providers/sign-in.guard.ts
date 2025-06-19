import { inject, Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

import { StateService } from '../../core/providers/state/state.service';

@Injectable({ providedIn: 'root' })
export class SignInGuard  {

    private stateService = inject(StateService);

    canActivate(): Observable<boolean> {
        return this.stateService.select(state => state.signedIn).pipe(
            map(signedIn => !signedIn),
        );
    }
}
