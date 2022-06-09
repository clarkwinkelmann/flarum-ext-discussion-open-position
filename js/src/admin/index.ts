import app from 'flarum/admin/app';

app.initializers.add('discussion-open-position', () => {
    app.extensionData
        .for('clarkwinkelmann-discussion-open-position')
        .registerSetting({
            setting: 'discussion-open-position.defaultOpenLastRead',
            label: app.translator.trans('clarkwinkelmann-discussion-open-position.admin.settings.defaultOpenLastRead'),
            type: 'select',
            options: {
                always: app.translator.trans('clarkwinkelmann-discussion-open-position.admin.settings.openLastOptions.always'),
                unread: app.translator.trans('clarkwinkelmann-discussion-open-position.admin.settings.openLastOptions.unread'),
                never: app.translator.trans('clarkwinkelmann-discussion-open-position.admin.settings.openLastOptions.never'),
            },
            default: 'always',
        })
        .registerSetting({
            setting: 'discussion-open-position.suggestFirstTime',
            label: app.translator.trans('clarkwinkelmann-discussion-open-position.admin.settings.suggestFirstTime'),
            type: 'switch',
        });
});
