import { Component, inject, Input } from '@angular/core';
import { CartFragment, GetPaymentSignatureQuery } from '@common/generated-types';
import { DataService } from '@core/providers/data/data.service';
import { environment } from '@envs/environment';
import { firstValueFrom, map } from 'rxjs';
import { GET_PAYMENT_SIGNATURE } from './payment-button.graphql';

declare global {
    interface Window {
        WidgetCheckout?: unknown;
    }
}

@Component({
    selector: 'vsf-payment-button',
    template: `
    <button class="btn btn-primary" (click)="getSignature()">
      Pay
    </button>
    {{ signature }} | {{ cart.code }}
  `,
    standalone: false,
})
export class PaymentButton {
    @Input() cart: CartFragment;
    signature = '';
    loading = false;

    private readonly dataService = inject(DataService);

    async getSignature() {
        const amountInCents = Math.round(this.cart.totalWithTax * 100);
        this.signature = await firstValueFrom(
            this.dataService
                .query<GetPaymentSignatureQuery>(GET_PAYMENT_SIGNATURE, { amountInCents })
                .pipe(map((data) => data.signature)),
        );
    }
    private ensureWompiLoaded(): Promise<void> {
        return new Promise((resolve, reject) => {
            const windowWithWompi = window as any;
            if (windowWithWompi.WidgetCheckout) return resolve();
            const script = document.createElement('script');
            script.src = 'https://checkout.wompi.co/widget.js';
            script.async = true;
            script.onload = () => resolve();
            script.onerror = () => reject(new Error('Failed to load Wompi widget'));
            document.head.appendChild(script);
        });
    }

    async pay() {
        this.loading = true;
        try {
            await this.ensureWompiLoaded();

            // If Vendure totals are in minor units already, COP needs ×100 for Wompi.
            const amountInCents = Math.round(this.cart.totalWithTax * 100);

            this.signature = await firstValueFrom(
                this.dataService
                    .query<GetPaymentSignatureQuery>(GET_PAYMENT_SIGNATURE, { amountInCents })
                    .pipe(map((data) => data.signature)),
            );
            const W = (window as any).WidgetCheckout;
            if (!W) throw new Error('Wompi WidgetCheckout not available');

            const checkout = new W({
                currency: 'COP',
                amountInCents,
                reference: this.cart.code,
                publicKey: environment.paymentPublicKey, // don’t use process.env in browser code
                signature: { integrity: this.signature },    // important: object with integrity
                redirectUrl: window.location.origin + '/checkout/confirmation/' + this.cart.code,
            });

            checkout.open((result: any) => {
                console.log('Wompi result', result);
                // Rely on webhook to finalize the order/payment state.
            });
        } catch (error) {
            console.error('Error initiating Wompi payment:', error);
            // show a toast to the user
        } finally {
            this.loading = false;
        }
    }
}
