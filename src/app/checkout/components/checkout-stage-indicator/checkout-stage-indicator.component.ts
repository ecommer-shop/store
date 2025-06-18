import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
    selector: 'vsf-checkout-stage-indicator',
    templateUrl: './checkout-stage-indicator.component.html',
    // styleUrls: ['./checkout-stage-indicator.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class CheckoutStageIndicatorComponent  {
    @Input() signedIn = false;
    @Input() activeStage = 1;
}
