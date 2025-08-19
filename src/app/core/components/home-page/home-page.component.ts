import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { gql } from 'apollo-angular';
import { map, Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { GetCollectionsQuery } from '../../../common/generated-types';
import { DataService } from '../../providers/data/data.service';

@Component({
    selector: 'vsf-home-page',
    templateUrl: './home-page.component.html',
    styleUrls: ['./home-page.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class HomePageComponent implements OnInit {

    collections$: Observable<GetCollectionsQuery['collections']['items']>;
    heroImage: SafeUrl;

    private dataService = inject(DataService);

    ngOnInit(): void {
        this.collections$ = this.dataService.query<GetCollectionsQuery>(GET_COLLECTIONS, {
            options: { take: 50 },
        }).pipe(map(({ collections }) => collections.items));
        this.heroImage = this.getHeroImageUrl();
    }

    private getHeroImageUrl(): string {
        const { apiHost, apiPort } = environment;
        return `${apiHost}:${apiPort}/assets/preview/a2/thomas-serer-420833-unsplash__preview.jpg`;
    }

}

const GET_COLLECTIONS = gql`
    query GetCollections($options: CollectionListOptions) {
        collections(options: $options) {
            items {
                id
                name
                slug
                parent {
                    id
                    slug
                    name
                }
                featuredAsset {
                    id
                    preview
                }
            }
        }
    }
`;
