import { Theme } from '@hykord/structures';
import { LoaderLogger as Logger } from '@common';
import { quickCss, getMetadata } from '../utils';
import { patchCss, unpatchCss } from '@hykord/patcher';
import type { ITheme } from '@hykord/structures/Theme';
const { join } = window.require<typeof import('path')>('path');
const { readdir, exists, mkdir, readAndIfNotExistsCreate, readFile } = window.require<typeof import('../../preload/polyfill/fs/promises')>('fs/promises');

export const themes: ITheme[] = [];

export const loadQuickCss = async () => {
    quickCss.load(await readAndIfNotExistsCreate(join(Hykord.directory, 'quickCss.css')));
};

const load = async() => {
    // Load internal themes
    await import('../themes');

    // Load quickCss
    if (await HykordNative.getManagers().getSettings().get('hykord.quick-css')) await loadQuickCss();

    // Load external themes
    const directory = join(HykordNative.getDirectory(), 'themes');
    if (!(await exists(directory))) await mkdir(directory);

    for (const file of await readdir(directory)) {
       if (file.endsWith('.css')) {
            try {
                const css = await readFile(join(directory, file), { encoding: 'utf-8' });
                const metadata = getMetadata(css);

                // Parse metadata
                addTheme({
                    name: metadata.name,
                    description: metadata.description,
                    version: metadata.version,
                    author: metadata.author,
                    license: metadata.license,
                    cssId: metadata.cssId,
                    toggleable: true,
                    start: () => css.toString()
                })
            } catch(error: any) {
                Logger.err(`Failed to load theme ${file}: ${error.message}`);
            }
        } else {
            try {
                const themeExports = await import(join(directory, file));
                addTheme(themeExports.default ? new themeExports.default() : new themeExports());
            } catch(error: any) {
                Logger.err(`Failed to load theme ${file}: ${error.message}`);
            }
        }
    }

    for (const theme of themes) {
        Logger.info('Loading theme', theme.name);
        toggleTheme(theme);
        Logger.info('Theme', theme.name, 'has been loaded!');
    }

    document.removeEventListener('DOMContentLoaded', load);
}

export const init = () => {
    document.addEventListener('DOMContentLoaded', load);
}

export const addTheme = async(theme: Theme) => {
    themes.push(theme);
}

export const enableTheme = (theme: Theme) => {
    theme!.$enabled = true;
    patchCss(theme.start(), theme.cssId ?? theme.name);
}

export const disableTheme = (theme: Theme) => {
    theme!.$enabled = false;
    unpatchCss(theme.cssId ?? theme.name);
}

export const toggleTheme = (theme: Theme) => {
    if (theme.$enabled) disableTheme(theme);
    else enableTheme(theme);
}