import { ChangeDetectionStrategy, Component, Inject, } from '@angular/core';
import { Subject } from 'rxjs';

import { NotificationOptions, NOTIFICATION_OPTIONS } from '../../providers/notification/notification-types';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'vsf-notification',
    templateUrl: './notification.component.html',
    styleUrls: ['./notification.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule],
    standalone: true,
})
export class NotificationComponent {
    close = new Subject();
    constructor(@Inject(NOTIFICATION_OPTIONS) public options: NotificationOptions) { }
}
