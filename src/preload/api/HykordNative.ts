import * as polyfill from '../polyfill';
import { join } from 'path';
import { ipcRenderer } from 'electron';
import { HykordIpcEvents } from '@hypes';
import { PreloadLogger as Logger } from '@common';

const getDirectory = () => join(`${process.env.HOME || process.env.USERPROFILE}`, '.hykord');

export default {
    getDirectory: getDirectory,
    getManagers: () => ({
        getSettings: () => ({
            getSync: (name: string, defaultValue?: string) => ipcRenderer.sendSync(HykordIpcEvents.GET_SETTING_SYNC, name, defaultValue),
            get: (name: string, defaultValue?: string) => ipcRenderer.invoke(HykordIpcEvents.GET_SETTING, name, defaultValue),
            /**
             * Doesn't save the settings, just adds to the cache
             * 
             * @deprecated Use SET_SETTING instead
             */
            setSync: (name: string, value: any) => ipcRenderer.sendSync(HykordIpcEvents.SET_SETTING_SYNC, name, value),
            set: (name: string, value: any) => ipcRenderer.invoke(HykordIpcEvents.SET_SETTING, name, value),
            save: () => ipcRenderer.invoke(HykordIpcEvents.SAVE_SETTINGS)
        })
    }),
    getDirname: () => __dirname,
    getVersions: () => process.versions,
    getPolyfillRemote: () => polyfill,
    require: (mod: string) => {
        const allowed = ipcRenderer.sendSync(HykordIpcEvents.GET_SETTING_SYNC, 'hykord.unsafe-require');
        if (!allowed) {
            Logger.err(`Unsafe require is disabled, cannot require ${mod}`);
            return null;
        }

        return require(mod);
    }
}