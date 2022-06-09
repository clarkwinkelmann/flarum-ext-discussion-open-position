<?php

namespace ClarkWinkelmann\DiscussionOpenPosition;

use Flarum\Extend;

return [
    (new Extend\Frontend('admin'))
        ->js(__DIR__ . '/js/dist/admin.js'),

    (new Extend\Frontend('forum'))
        ->js(__DIR__ . '/js/dist/forum.js')
        ->css(__DIR__ . '/less/forum.less'),

    new Extend\Locales(__DIR__ . '/locale'),

    (new Extend\Settings())
        ->default('discussion-open-position.defaultOpenLastRead', 'always')
        ->serializeToForum('discussionOpenLastReadDefault', 'discussion-open-position.defaultOpenLastRead', function ($value) {
            // This workaround might be needed because of https://github.com/flarum/framework/issues/3438
            return $value ?: 'always';
        })
        ->serializeToForum('discussionOpenLastReadPrompt', 'discussion-open-position.suggestFirstTime', 'boolval'),

    (new Extend\User())
        ->registerPreference('discussionOpenLastRead'),
];
