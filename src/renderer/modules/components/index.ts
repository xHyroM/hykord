// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck - too many issuess
// Some components from https://github.com/Vendicated/Vencord/blob/main/src/webpack/common.tsx

import type Components from 'discord-types/components';
import { Filters, waitForSync } from '@hykord/webpack';

export * as Styles from './styles';
export const Forms = {} as {
    FormTitle: Components.FormTitle;
    FormSection: any;
    FormDivider: any;
    FormText: Components.FormText;
}

export let Card: Components.Card;
export let Button: any;
export let Switch: any;
export let Checkbox: any
export let Tooltip: Components.Tooltip;
export let TextInput: Components.TextInput;

// Alerts
export let Alerts: {
    show(alert: {
        title: any;
        body?: React.ReactNode;
        className?: string;
        confirmColor?: string;
        cancelText?: string;
        confirmText?: string;
        secondaryConfirmText?: string;
        onCancel?(): void;
        onConfirm?(): void;
        onConfirmSecondary?(): void;
    }): void;
    close(): void;
};

// Toasts
enum ToastType {
    MESSAGE,
    SUCCESS,
    FAILURE,
    CUSTOM,
};

enum ToastPosition {
    TOP,
    BOTTOM,
};

export const Toasts = {
    Type: ToastType,
    Position: ToastPosition,
    genId: () => (Math.random() || Math.random()).toString(36).slice(2),

    ...{} as {
        show(data: {
            message: string,
            id: string,
            type: ToastType,
            options?: {
                position?: ToastPosition;
                component?: React.ReactNode,
                duration?: number;
            };
        }): void;
        pop(): void;
    }
};

// Custom components:
export const Inputs = {} as {
    Switch: typeof import('./inputs/Switch').Switch;
}

export let Flex: typeof import('./Flex').Flex;
export let ErrorBoundary: typeof import('./ErrorBoundary').ErrorBoundary;
export let Link: typeof import('./Link').Link;

waitForSync('useState', () => {
    ErrorBoundary = require('./ErrorBoundary').ErrorBoundary;
    Flex = require('./Flex').Flex;
    Link = require('./Link').Link;
});

waitForSync(m => m.Tags && Filters.byCode('errorSeparator')(m), m => Forms.FormTitle = m);
waitForSync(m => m.Tags && Filters.byCode('titleClassName', 'sectionTitle')(m), m => Forms.FormSection = m);
waitForSync(m => m.Types?.INPUT_PLACEHOLDER, m => Forms.FormText = m);
waitForSync(Filters.byCode('().divider', 'style'), m => Forms.FormDivider = m, 1);

waitForSync(['Hovers', 'Looks', 'Sizes'], m => Button = m);
waitForSync(Filters.byCode('helpdeskArticleId'), m => {
    Switch = m;
    Inputs.Switch = require('./inputs/Switch').Switch;
});

waitForSync(Filters.byCode('input', 'createElement', 'checkbox'), m => Checkbox = m);

waitForSync(['Positions', 'Colors'], m => Tooltip = m);
waitForSync(['defaultProps', 'Sizes', 'contextType'], m => TextInput = m);

waitForSync(m => m.Types?.PRIMARY === 'cardPrimary', m => Card = m);

// Alerts
waitForSync(['show', 'close'], m => Alerts = m);

// Toasts
waitForSync(Filters.byCode('currentToast?'), m => Toasts.show = m);
waitForSync(Filters.byCode('currentToast:null'), m => Toasts.pop = m);