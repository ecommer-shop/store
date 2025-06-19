import {gql} from 'apollo-angular';


import { ERROR_RESULT_FRAGMENT } from '../../../common/graphql/fragments.graphql';

export const SIGN_IN = gql`
    fragment ErrorResult on ErrorResult {
        errorCode
        message
    }
    mutation SignIn($emailAddress: String!, $password: String!, $rememberMe: Boolean!) {
        login(username: $emailAddress, password: $password, rememberMe: $rememberMe) {
            ...on CurrentUser {
                id
            }
            ...ErrorResult
        }
    }
    ${ERROR_RESULT_FRAGMENT}
`;
