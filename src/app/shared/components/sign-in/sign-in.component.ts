import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, inject } from '@angular/core';
import { Router } from '@angular/router';

import { SignInMutation, SignInMutationVariables } from '../../../common/generated-types';
import { DataService } from '../../../core/providers/data/data.service';
import { StateService } from '../../../core/providers/state/state.service';

import { SIGN_IN } from './sign-in.graphql';

enum SignInMutationResponse {
    CurrentUser = 'CurrentUser',
    NativeAuthStrategyError = 'NativeAuthStrategyError',
    InvalidCredentialsError = 'InvalidCredentialsError',
}

@Component({
    selector: 'vsf-sign-in',
    templateUrl: './sign-in.component.html',
    styleUrls: ['./sign-in.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class SignInComponent {
    @Input() navigateToOnSuccess: string[] | undefined;
    @Input() displayRegisterLink = true;

    emailAddress: string;
    password: string;
    rememberMe = false;
    invalidCredentials = false;

    private dataService = inject(DataService);
    private stateService = inject(StateService);
    private router = inject(Router);
    private changeDetector = inject(ChangeDetectorRef);

    signIn() {
        this.dataService.mutate<SignInMutation, SignInMutationVariables>(SIGN_IN, {
            emailAddress: this.emailAddress,
            password: this.password,
            rememberMe: this.rememberMe,
        }).subscribe({
            next: ({login}) => {
                switch (login.__typename) {
                    case SignInMutationResponse.CurrentUser: {
                        this.stateService.setState('signedIn', true);
                        const commands = this.navigateToOnSuccess || ['/'];
                        this.router.navigate(commands);
                        break;
                    }
                    case SignInMutationResponse.NativeAuthStrategyError:
                    case SignInMutationResponse.InvalidCredentialsError:
                        this.displayCredentialsError();
                        break;
                }
            },
        });
    }

    private displayCredentialsError() {
        this.invalidCredentials = false;
        this.changeDetector.markForCheck();
        setTimeout(() => {
            this.invalidCredentials = true;
            this.changeDetector.markForCheck();
        }, 50);
    }
}
