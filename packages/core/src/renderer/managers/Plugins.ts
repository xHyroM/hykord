import { Plugin } from '@hykord/structures/Plugin';
import { mkdirIfNotExists } from '@hykord/fs/promises';
import { readdir } from 'fs/promises';
import { join } from 'path';
import Logger from '@hykord/logger';
import { compare } from 'semver';

export class PluginsManager {
    public location: string;
    private plugins: Map<string, Plugin>;
    private modules: {
        utilities: typeof import('@hykord/utilities');
    };

    constructor() {
        this.location = null;
        this.plugins = new Map();
    }

    public async register(plugin: Plugin) {
        console.log('REGISTRRRRRRRRRR');
        if (
            Array.from(this.plugins.keys()).includes(plugin.name) &&
            compare(plugin?.version || '0.0.1', this.plugins.get(plugin.name)?.version) === 0
        ) return;
        console.log('register');

        this.plugins.set(plugin.name, plugin);
    }

    public async init() {
        this.location = `${process.env.HOME || process.env.USERPROFILE}/.hykord/${window.GLOBAL_ENV.RELEASE_CHANNEL}/plugins`;
        this.modules = {
            utilities: require('@hykord/utilities'),
        }

        await mkdirIfNotExists(this.location);
        await this.loadPlugins();
    }

    public async togglePlugin(plugin: Plugin): Promise<boolean> {
        if (plugin.enabled) {
            window.hykord.settings.addToSeting('hykord.disabled_plugins', this.modules.utilities.nameToId(plugin.name));
            await this.disablePlugin(plugin);

            return false;
        } else {
            window.hykord.settings.removeFromSeting('hykord.disabled_plugins', this.modules.utilities.nameToId(plugin.name));
            await this.enablePlugin(plugin);

            return true;
        }
    }

    public async enablePlugin(plugin: Plugin) {
        if ((window.hykord.settings.getSetting('hykord.disabled_plugins', []) as string[]).includes(this.modules.utilities.nameToId(plugin.name))) return false;

        plugin.loading = true;
        await plugin.onEnable();
        plugin.enabled = true;
        plugin.loading = false;

        return true;
    }

    public async disablePlugin(plugin: Plugin) {
        await plugin.onDisable();
        plugin.enabled = false;
    }

    public async initializePlugin(name: string) {
        Logger.info(`Initializing plugin ${name}.`);

        await Promise.resolve(import(join(this.location, name, 'dist', 'index.js')))
            .catch(error => {
                Logger.err(`Failed to initialize plugin ${name} - ${error.code ?? ''} ${error.message}`);
            })
            .then(() => {
                Logger.info(`Plugin ${name} has been initialized.`);
            })
    }

    public async loadPlugin(plugin: Plugin) {
        Logger.info(`Loading plugin ${plugin.name}.`);

        await Promise.resolve(this.enablePlugin(plugin))
            .catch(error => {
                Logger.err(`Failed to load plugin ${plugin.name} - ${error.code ?? ''} ${error.message}`);

                plugin.broken = true;
            })
            .then((v: boolean) => {
                if (!v) {
                    Logger.warn(`Skipping plugin ${plugin.name} because it's disabled.`);

                    return;
                }

                Logger.info(`Plugin ${plugin.name} has been loaded.`);

                plugin.enabled = true;
                plugin.loading = false;
            })
    }

    public async loadPlugins() {
        for (const pluginDirectory of await readdir(this.location, { withFileTypes: true })) {
            if (!pluginDirectory.isDirectory()) continue;

            await this.initializePlugin(pluginDirectory.name);
        }

        for (const plugin of Array.from(this.plugins.values())) {
            if (!plugin.enabled) await this.loadPlugin(plugin);
            else Logger.warn(`Plugin ${plugin.name} is already enabled!`);
        }
    }

    public getPlugin(name: string) {
        return this.plugins.get(name);
    }

    public getAllPlugins() {
        return Array.from(this.plugins.values());
    }
}