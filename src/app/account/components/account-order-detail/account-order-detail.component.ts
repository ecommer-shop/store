import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, filter, map, switchMap } from 'rxjs';

import { GetOrderQuery, GetOrderQueryVariables } from '../../../common/generated-types';
import { notNullOrUndefined } from '../../../common/utils/not-null-or-undefined';
import { DataService } from '../../../core/providers/data/data.service';

import { GET_ORDER } from './account-order-detail.graphql';

@Component({
    selector: 'vsf-account-order-detail',
    templateUrl: './account-order-detail.component.html',
    styleUrls: ['./account-order-detail.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class AccountOrderDetailComponent implements OnInit {

    order$: Observable<GetOrderQuery['orderByCode'] | undefined>;
    constructor(private dataService: DataService, private route: ActivatedRoute) { }

    ngOnInit() {
        this.order$ = this.route.paramMap.pipe(
            map(pm => pm.get('code')),
            filter(notNullOrUndefined),
            switchMap(code => {
                return this.dataService.query<GetOrderQuery, GetOrderQueryVariables>(GET_ORDER, { code });
            }),
            map(data => data.orderByCode),
        );
    }

}
