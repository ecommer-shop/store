import { Overlay, OverlayConfig } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal'; // Removed PortalInjector from here
import { Injectable, Injector } from '@angular/core'; // Ensure Injector is imported
import { race, timer, finalize, take } from 'rxjs';

import { NotificationComponent } from '../../components/notification/notification.component';

import { NOTIFICATION_OPTIONS, NotificationOptions } from './notification-types';

/**
 * This service is responsible for instantiating a ModalDialog component and
 * embedding the specified component within.
 */
@Injectable({providedIn: 'root'})
export class NotificationService {
    constructor(private overlay: Overlay, private injector: Injector) {
    }

    /**
     * Display a "toast" notification.
     */
    notify(options: NotificationOptions) {
        const positionStrategy = this.overlay.position().global().top('16px').right('16px');
        const scrollStrategy = this.overlay.scrollStrategies.noop();
        const overlayRef = this.overlay.create(
            new OverlayConfig({
                scrollStrategy,
                positionStrategy,
                hasBackdrop: false,
            }),
        );
        const closeFn = () => {
            if (overlayRef.hasAttached()) {
                const notificationEl = overlayRef.overlayElement.querySelector('vsf-notification');
                if (notificationEl) {
                    notificationEl.classList.add('remove');
                }
                setTimeout(() => overlayRef.dispose(), 250);
            }
        };

        // --- CHANGE STARTS HERE ---
        const portal = new ComponentPortal(
            NotificationComponent,
            null,
            this.createNotificationInjector(options, closeFn), // Call the updated private method
        );
        // --- CHANGE ENDS HERE ---

        const notificationRef = overlayRef.attach(portal);

        return race<any>(notificationRef.instance.close, timer(options.duration)).pipe(
            take(1),
            finalize(() => closeFn()),
        );
    }

    error(message: string) {
        return this.notify({
            title: 'An error occurred',
            message,
            duration: 10000,
            type: 'error',
        });
    }

    success(message: string) {
        return this.notify({
            title: 'Success',
            message,
            duration: 5000,
            type: 'error',
        });
    }

    info(message: string) {
        return this.notify({
            title: 'Information',
            message,
            duration: 5000,
            type: 'info',
        });
    }

    // --- CHANGE STARTS HERE ---
    private createNotificationInjector(options: NotificationOptions, closeFn: () => void): Injector {
        options.templateContext = {
            ...options.templateContext,
            closeFn,
        };
        return Injector.create({
            parent: this.injector,
            providers: [
                { provide: NOTIFICATION_OPTIONS, useValue: options }
            ]
        });
    }
    // --- CHANGE ENDS HERE ---
}