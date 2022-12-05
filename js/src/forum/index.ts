import app from 'flarum/forum/app';
import {extend} from 'flarum/common/extend';
import Button from 'flarum/common/components/Button';
import Link from 'flarum/common/components/Link';
import LinkButton from 'flarum/common/components/LinkButton';
import LoadingIndicator from 'flarum/common/components/LoadingIndicator';
import Select from 'flarum/common/components/Select';
import FieldSet from 'flarum/common/components/FieldSet';
import icon from 'flarum/common/helpers/icon';
import Discussion from 'flarum/common/models/Discussion';
import DiscussionListItem from 'flarum/forum/components/DiscussionListItem';
import DiscussionPage from 'flarum/forum/components/DiscussionPage';
import SettingsPage from 'flarum/forum/components/SettingsPage';
import AlertWithDismissCallback, {AlertWithDismissCallbackAttrs} from './components/AlertWithDismissCallback';
import shouldRedirectDiscussionToBlog from './utils/shouldRedirectDiscussionToBlog';

function getOpenLastReadPreference() {
    // Retrieve the user preference or the default
    // For guests this will always be the default
    return app.session.user?.preferences()?.discussionOpenLastRead || app.forum.attribute('discussionOpenLastReadDefault');
}

app.initializers.add('discussion-open-position', () => {
    extend(DiscussionListItem.prototype, 'view', function (vdom) {
        // If we are on a search results page, there's special logic to open the most relevant post
        // We don't want to change that
        if (this.attrs.params.q) {
            return;
        }

        const openLast = getOpenLastReadPreference();

        // Since "always" is what Flarum does natively, don't try changing anything
        if (openLast === 'always') {
            return;
        }

        const discussion: Discussion = this.attrs.discussion;

        (vdom.children as any[]).forEach(vdom => {
            if (!vdom || !vdom.attrs || !vdom.attrs.className || vdom.attrs.className.indexOf('DiscussionListItem-content') === -1) {
                return;
            }

            (vdom.children as any[]).forEach(vdom => {
                if (!vdom || vdom.tag !== Link) {
                    return;
                }

                let jumpTo = 0;

                if (openLast === 'unread' && discussion.isUnread()) {
                    // Same logic as in DiscussionListItem to calculate open location
                    jumpTo = Math.min(discussion.lastPostNumber() || 0, (discussion.lastReadPostNumber() || 0) + 1);
                }

                let href: string;

                // v17development/flarum-blog overrides the app.route.discussion method and does its own "near" calculation inside
                // The easiest solution to ignore that custom calculation is to generate our own blog link here with the intended value
                // Same logic as Blog to determinate when the discussion link should be replaced with a blog link
                if (shouldRedirectDiscussionToBlog(discussion)) {
                    if (jumpTo > 1) {
                        href = app.route('blogArticle.near', {
                            id: discussion.slug(),
                            near: jumpTo,
                        });
                    } else {
                        href = app.route('blogArticle', {
                            id: discussion.slug(),
                        });
                    }
                } else {
                    href = app.route.discussion(discussion, jumpTo);
                }

                vdom.attrs.href = href;
            });
        });
    });

    extend(DiscussionPage.prototype, 'show', function (returnValue, discussion) {
        // Don't prompt guests to change their setting, they can't do it
        if (!app.session.user) {
            return;
        }

        // If option is disabled, skip
        if (!app.forum.attribute('discussionOpenLastReadPrompt')) {
            return;
        }

        // If the user already configured something, don't prompt them again
        if (app.session.user.preferences()?.discussionOpenLastRead) {
            return;
        }

        const defaultOpenLast = app.forum.attribute('discussionOpenLastReadDefault');

        // Don't show any prompt when unread is the default, since it's a sensible balance already
        if (defaultOpenLast === 'unread') {
            return;
        }

        // If there are no replies, the user wouldn't understand the difference between the 2 options, so we'll not show the alert this time
        if (discussion.replyCount() === 0) {
            return;
        }

        const preference = defaultOpenLast === 'always' ? 'never' : 'always';

        const controls = [
            Button.component({
                className: 'Button Button--link',
                onclick: () => {
                    app.session.user!.savePreferences({discussionOpenLastRead: preference}).then(() => {
                        app.alerts.dismiss(alertId);
                    });
                },
            }, app.translator.trans('clarkwinkelmann-discussion-open-position.forum.firstTimePrompt.openLastOptions.' + preference)),
            LinkButton.component({
                className: 'Button Button--link',
                href: app.route('settings'), // Unfortunately there's no way to scroll to an anchor
                onclick: () => {
                    app.alerts.dismiss(alertId);
                },
            }, app.translator.trans('clarkwinkelmann-discussion-open-position.forum.firstTimePrompt.more'))
        ];

        // For some reason typescript type-hints from Flarum don't accept extended Alerts or Alert attrs
        const alertId = app.alerts.show(AlertWithDismissCallback as any, {
            type: 'info',
            controls,
            ondismiss2: () => {
                // Save the default as preference so the alert isn't shown again
                app.session.user!.savePreferences({discussionOpenLastRead: defaultOpenLast});
            },
        } as AlertWithDismissCallbackAttrs, app.translator.trans('clarkwinkelmann-discussion-open-position.forum.firstTimePrompt.from' + (defaultOpenLast === 'always' ? 'Always' : 'Never')));
    });

    extend(SettingsPage.prototype, 'settingsItems', function (items) {
        const openLast = getOpenLastReadPreference();

        items.add(
            'discussionOpenLastRead',
            FieldSet.component({
                label: app.translator.trans('clarkwinkelmann-discussion-open-position.forum.preferences.discussionOpenLastRead'),
                className: 'Settings-discussionOpenLastRead',
            }, [
                m('.Form-group', [
                    Select.component({
                        options: {
                            always: app.translator.trans('clarkwinkelmann-discussion-open-position.forum.preferences.openLastOptions.always'),
                            unread: app.translator.trans('clarkwinkelmann-discussion-open-position.forum.preferences.openLastOptions.unread'),
                            never: app.translator.trans('clarkwinkelmann-discussion-open-position.forum.preferences.openLastOptions.never'),
                        },
                        value: openLast,
                        onchange: (value: string) => {
                            this.discussionOpenLastReadLoading = 'saving';

                            this.user!.savePreferences({discussionOpenLastRead: value}).then(() => {
                                this.discussionOpenLastReadLoading = 'saved';
                                m.redraw();

                                setTimeout(() => {
                                    this.discussionOpenLastReadLoading = null;
                                    m.redraw();
                                }, 2000);
                            }).catch(error => {
                                this.discussionOpenLastReadLoading = 'error';
                                m.redraw();

                                // Intentionally don't reset state after error

                                throw error;
                            });
                        },
                        disabled: this.discussionOpenLastReadLoading === 'saving',
                    }, app.translator.trans('flarum-subscriptions.forum.settings.follow_after_reply_label')),
                    this.discussionOpenLastReadLoading === 'saving' ? m('span.Settings-discussionOpenLastRead-state', LoadingIndicator.component({
                        display: 'inline',
                    })) : null,
                    this.discussionOpenLastReadLoading === 'saved' ? m('span.Settings-discussionOpenLastRead-state.Settings-discussionOpenLastRead-saved', icon('fas fa-check')) : null,
                    this.discussionOpenLastReadLoading === 'error' ? m('span.Settings-discussionOpenLastRead-state.Settings-discussionOpenLastRead-error', icon('fas fa-exclamation-circle')) : null,
                ]),
            ])
        );
    });
});
