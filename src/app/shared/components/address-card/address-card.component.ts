import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { AddressFragment, OrderAddressFragment } from '../../../common/generated-types';

@Component({
    selector: 'vsf-address-card',
    templateUrl: './address-card.component.html',
    // styleUrls: ['./address-card.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class AddressCardComponent {
    @Input() address: OrderAddressFragment | AddressFragment;
    @Input() title = '';

    getCountryName(): string {
        if (!this.address.country) {
            return '';
        }
        if (typeof this.address.country === 'string') {
            return this.address.country;
        } else {
            return this.address.country.name;
        }
    }
}
