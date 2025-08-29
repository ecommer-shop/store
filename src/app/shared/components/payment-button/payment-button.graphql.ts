import { gql } from 'apollo-angular';

export const GET_PAYMENT_SIGNATURE = gql`
  query GetPaymentSignature($amountInCents: Int!) {
      signature: GetPaymentSignature(amountInCents: $amountInCents)
  }
`;
