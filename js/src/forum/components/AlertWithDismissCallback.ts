import Alert, {AlertAttrs} from 'flarum/common/components/Alert';

export interface AlertWithDismissCallbackAttrs extends AlertAttrs {
    // Flarum's ondismiss cannot be used by extensions since it's bound to AlertManagerState in AlertManager
    ondismiss2?: Function
}

export default class AlertWithDismissCallback extends Alert<AlertWithDismissCallbackAttrs> {
    static initAttrs(attrs: AlertWithDismissCallbackAttrs): void {
        if (attrs.ondismiss2) {
            const originalOnDismiss = attrs.ondismiss || (() => {
            });

            attrs.ondismiss = () => {
                originalOnDismiss();
                attrs.ondismiss2!();
            };
        }
    }
}
