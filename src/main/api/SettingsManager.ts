import { join } from 'path';
import { deepen, convertToMap, CoreLogger as Logger } from '@common';
import { writeFile } from 'fs/promises';

const requireAndIfNotExistsCreate = (path: string, fallback: any): string => {
    try {
        return require(path);
    } catch (e) {
        return fallback;
    }
}

export type PossibleSettingValue = string | boolean | number | string[] | undefined | null;
export type KnownSettings = 
    'hykord.quickCss' |
    'hykord.react-dev-tools' |
    'hykord.disable-science-requests';

export class SettingsManager {
    private readonly location: string;
    private settings: Map<KnownSettings, PossibleSettingValue> = new Map();

    constructor(location: string) {
        Logger.debug('Constructing SettingsManager');

        this.location = join(location, 'settings.json');

        const config = requireAndIfNotExistsCreate(
            this.location,
            {}
        )

        this.settings = convertToMap(config);
    }

    public getSetting(name: KnownSettings, defaultValue?: PossibleSettingValue): PossibleSettingValue {
        return this.settings.get(name) || defaultValue;
    }

    public setSetting(name: KnownSettings, value: PossibleSettingValue): Map<KnownSettings, PossibleSettingValue> {
        return this.settings.set(name, value);
    }

    public async save() {
        return await writeFile(this.location, JSON.stringify(deepen(this.settings)));
    }
}

export default new SettingsManager(join(`${process.env.HOME || process.env.USERPROFILE}`, '.hykord'));