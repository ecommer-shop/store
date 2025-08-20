import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CartFragment } from '../../../common/generated-types';

@Component({
    selector: 'vsf-cart-totals',
    templateUrl: './cart-totals.component.html',
    styleUrls: ['./cart-totals.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class CartTotalsComponent {
    @Input() cart: CartFragment;
}
