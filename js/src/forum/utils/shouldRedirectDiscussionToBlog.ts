import app from 'flarum/forum/app';
import Discussion from 'flarum/common/models/Discussion';

// Code copied from https://github.com/v17development/flarum-blog/blob/v0.6.4/js/src/forum/utils/discussionRouting.js
// But adapted for Typescript and made shorter with early returns
export default function (discussion: Discussion): boolean {
    // Check makes code slightly more efficient and avoids any issue since Tags is not a required extension when not using Blog
    if (!('v17development-blog' in flarum.extensions)) {
        return false;
    }

    const discussionRedirectEnabled = app.forum.attribute('blogRedirectsEnabled') === 'both' || app.forum.attribute('blogRedirectsEnabled') === 'discussions_only';

    const discussionTags = discussion.tags() || [];

    if (discussionRedirectEnabled && discussionTags.length > 0) {
        const blogTags = app.forum.attribute<string[]>('blogTags');

        return discussionTags.some(tag => {
            if (!tag) {
                return false;
            }

            const parent = tag.parent() || null;

            return blogTags.indexOf(tag.id()!) !== -1 || (parent && blogTags.indexOf(parent.id()!) !== -1);
        });
    }

    return false;
}
