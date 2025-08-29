import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '@core/providers/data/data.service';
import { merge, Observable, shareReplay, switchMap } from 'rxjs';

import { ActiveService } from '@app/core/providers/active/active.service';
import { StateService } from '@app/core/providers/state/state.service';
import { GetActiveOrderQuery } from '@common/generated-types';

@Component({
    selector: 'vsf-checkout-payment',
    templateUrl: './checkout-payment.component.html',
    // styleUrls: ['./checkout-payment.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class CheckoutPaymentComponent implements OnInit {
    cart$: Observable<GetActiveOrderQuery['activeOrder']>;

    private readonly route = inject(ActivatedRoute);
    private readonly dataService = inject(DataService);
    private readonly stateService = inject(StateService);
    private readonly activeService = inject(ActiveService);

    ngOnInit() {
        this.cart$ = merge(
            this.stateService.select(state => state.activeOrderId),
            this.stateService.select(state => state.signedIn),
        ).pipe(
            switchMap(() => this.activeService.activeOrder$),
            shareReplay(1),
        );
    }
}
