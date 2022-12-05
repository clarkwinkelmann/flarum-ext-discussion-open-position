import SettingsPage from 'flarum/forum/components/SettingsPage';

declare module 'flarum/forum/components/SettingsPage' {
    export default interface SettingsPage {
        discussionOpenLastReadLoading?: string | null
    }
}
