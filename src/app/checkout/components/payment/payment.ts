import { Component, inject, Input } from '@angular/core';
import { CartFragment, GetPaymentSignatureQuery } from '@app/common/generated-types';
import { DataService } from '@app/core/providers/data/data.service';
import { map, Observable } from 'rxjs';
import { GET_PAYMENT_SIGNATURE } from './payment.graphql';

declare global {
    interface Window {
        WidgetCheckout?: any;
    }
}

@Component({
    selector: 'vsf-payment',
    template: `
    <button class="btn btn-primary" (click)="getSignature()" [disabled]="loading">
      Pay with Wompi, signature : {{ signature$ | async }}
    </button>
  `,
    standalone: false
})
export class Payment {
    @Input() cart: CartFragment;
    signature$: Observable<string>;
    loading = false;

    private readonly dataService = inject(DataService);

    async getSignature() {
        this.loading = true;
        try {
            const amountInCents = Math.round(this.cart.totalWithTax * 100);
            this.signature$ = this.dataService.query<GetPaymentSignatureQuery>(GET_PAYMENT_SIGNATURE, { amountInCents }).pipe(
                map(data => data.signature)
            );
            console.log('payments');
        } catch (error) {
            console.error('Error getting signature:', error);
            throw error;
        } finally {
            this.loading = false;
        }
    }

    // async pay() {
    //     this.loading = true;
    //     try {
    //         const amountInCents = this.cart.totalWithTax * 100;
    //         // Get the secure signature from your Shop API
    //         const signature = await this.paymentService.getSignature(amountInCents);
    //         // Optionally use order.code as your merchant reference
    //         const reference = order.code;
    //         // Initialize Wompi widget with signature
    //         const checkout = new window.WidgetCheckout({
    //             currency: 'COP',
    //             amountInCents,
    //             reference,
    //             publicKey: 'pub_test_xxx', // your Wompi public key
    //             // For signature/secure integrity:
    //             signature: signature, // or integrity if your widget key name differs
    //             redirectUrl: window.location.origin + '/checkout/payment-result', // optional
    //         });
    //         checkout.open((result: any) => {
    //             // result contains status, transactionId, etc. You can show immediate feedback
    //             // but rely on the webhook to finalize the order/payment state.
    //             console.log('Wompi result', result);
    //         });
    //     } catch (e) {
    //         console.error(e);
    //         // show a toast/error message to the shopper
    //     } finally {
    //         this.loading = false;
    //     }
    // }
}
