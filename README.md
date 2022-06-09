# Discussion Open Position

[![MIT license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/clarkwinkelmann/flarum-ext-discussion-open-position/blob/master/LICENSE.txt) [![Latest Stable Version](https://img.shields.io/packagist/v/clarkwinkelmann/flarum-ext-discussion-open-position.svg)](https://packagist.org/packages/clarkwinkelmann/flarum-ext-discussion-open-position) [![Total Downloads](https://img.shields.io/packagist/dt/clarkwinkelmann/flarum-ext-discussion-open-position.svg)](https://packagist.org/packages/clarkwinkelmann/flarum-ext-discussion-open-position) [![Donate](https://img.shields.io/badge/paypal-donate-yellow.svg)](https://www.paypal.me/clarkwinkelmann)

This extension allows users to create discussions and replies without revealing their usernames except to moderators.

This extension controls the position (scroll/"page") at which a discussion is opened when selected in the discussion list.

This is done through a new preference that controls when a discussion should be "opened at last read post":

- Always (Flarum built-in default)
- Only when there are unread posts
- Never = Always open discussion at the top

You can configure a global default in the admin panel and users can change it via their preferences.

The optional "Prompt" setting is experimental.
It shows a message in the discussion allowing the user to change their preference on the first visit.
Unfortunately the message is very long, so it's not very user-friendly.

## Installation

    composer require clarkwinkelmann/flarum-ext-discussion-open-position

## Support

This extension is under **minimal maintenance**.

It was developed for a client and released as open-source for the benefit of the community.
I might publish simple bugfixes or compatibility updates for free.

You can [contact me](https://clarkwinkelmann.com/flarum) to sponsor additional features or updates.

Support is offered on a "best effort" basis through the Flarum community thread.

## Links

- [GitHub](https://github.com/clarkwinkelmann/flarum-ext-discussion-open-position)
- [Packagist](https://packagist.org/packages/clarkwinkelmann/flarum-ext-discussion-open-position)
