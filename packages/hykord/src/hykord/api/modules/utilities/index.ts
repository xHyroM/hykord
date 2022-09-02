import { registerPluginSection } from "@hykord/api/ui/userSettingsHykord"

export * as modals from './modals';

export const registerSection = registerPluginSection;

export const linkify = (text: string) => {
    return text.replace(/(((https?:\/\/)|(www\.))[^\s]+)/g, (url) => '<a href="' + url + '">' + url + '</a>');
}