import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { VerifyMutation, VerifyMutationVariables } from '../../../common/generated-types';
import { DataService } from '../../../core/providers/data/data.service';
import { StateService } from '../../../core/providers/state/state.service';

import { VERIFY } from './verify.graphql';
import { AUTH, NAV } from 'src/app/common/constants';

@Component({
    selector: 'vsf-verify',
    templateUrl: './verify.component.html',
    // styleUrls: ['./verify.component.scss'],
    changeDetection: ChangeDetectionStrategy.Default,
    standalone: false
})
export class VerifyComponent {
    password = '';

    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private dataService = inject(DataService);
    private stateService = inject(StateService);

    verify() {
        const password = this.password;
        const token = this.route.snapshot.queryParamMap.get(AUTH.token);

        if (password && token) {
            this.dataService.mutate<VerifyMutation, VerifyMutationVariables>(VERIFY, {
                password,
                token,
            }).subscribe(() => {
                this.stateService.setState('signedIn', true);
                this.router.navigate([NAV.account]);
            });
        }
    }
}