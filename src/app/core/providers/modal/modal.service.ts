import { Overlay, OverlayConfig } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal'; // Removed PortalInjector from here
import { Injectable, Injector, Type } from '@angular/core'; // Ensure Injector is imported
import { Observable, race, finalize, mapTo, take } from 'rxjs';

import { ModalDialogComponent } from '../../components/modal-dialog/modal-dialog.component';

import { Dialog, DIALOG_COMPONENT, MODAL_OPTIONS, ModalOptions } from './modal-types';

/**
 * This service is responsible for instantiating a ModalDialog component and
 * embedding the specified component within.
 */
@Injectable({ providedIn: 'root' })
export class ModalService {
    constructor(private overlay: Overlay, private injector: Injector) {}

    /**
     * Create a modal from a component. The component must implement the {@link Dialog} interface.
     * Additionally, the component should include templates for the title and the buttons to be
     * displayed in the modal dialog. See example:
     *
     * @example
     * ```
     * class MyDialog implements Dialog {
     * resolveWith: (result?: any) => void;
     *
     * okay() {
     * doSomeWork().subscribe(result => {
     * this.resolveWith(result);
     * })
     * }
     *
     * cancel() {
     * this.resolveWith(false);
     * }
     * }
     * ```
     *
     * ```
     * <ng-template vsfDialogTitle>Title of the modal</ng-template>
     *
     * <p>
     * My Content
     * </p>
     *
     * <ng-template vsfDialogButtons>
     * <button type="button"
     * class="btn"
     * (click)="cancel()">Cancel</button>
     * <button type="button"
     * class="btn btn-primary"
     * (click)="okay()">Okay</button>
     * </ng-template>
     * ```
     */
    fromComponent<T extends Dialog<any>, R>(
        component: Type<T> & Type<Dialog<R>>,
        options?: ModalOptions<T>,
    ): Observable<R | undefined> {
        const positionStrategy = this.overlay.position().global().centerHorizontally().centerVertically();
        const scrollStrategy = this.overlay.scrollStrategies.block();
        const overlayRef = this.overlay.create(new OverlayConfig({
            scrollStrategy,
            positionStrategy,
            hasBackdrop: true,
        }));

        // --- CHANGE STARTS HERE ---
        const portal = new ComponentPortal(
            ModalDialogComponent,
            null,
            this.createModalInjector(component, options) // Call the updated private method
        );
        // --- CHANGE ENDS HERE ---

        const modal = overlayRef.attach(portal);
        setTimeout(() => modal.changeDetectorRef.markForCheck());

        const close$ = new Observable<R>(subscriber => {
            modal.instance.closeModal = (result: R) => {
                subscriber.next(result);
                subscriber.complete();
            };
        });
        const backdropClick$ = overlayRef.backdropClick().pipe(mapTo(undefined));

        return race(close$, backdropClick$).pipe(
            take(1),
            finalize(() => overlayRef.dispose()),
        );
    }

    // --- CHANGE STARTS HERE ---
    private createModalInjector<T, R>(component: Type<T> & Type<Dialog<R>>, options?: ModalOptions<T>): Injector {
        return Injector.create({
            parent: this.injector,
            providers: [
                { provide: DIALOG_COMPONENT, useValue: component },
                { provide: MODAL_OPTIONS, useValue: options },
            ],
        });
    }
    // --- CHANGE ENDS HERE ---
}