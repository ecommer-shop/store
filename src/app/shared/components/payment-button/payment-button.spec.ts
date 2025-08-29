import { PaymentButton } from './payment-button';

describe('Payment', () => {
    let component: PaymentButton;

    beforeEach(() => {
        component = new PaymentButton();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
