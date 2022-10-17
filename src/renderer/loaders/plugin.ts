import { PluginInfo } from '@hykord/hooks';
import { Patch } from '@hykord/webpack/types';
import { LoaderLogger as Logger } from '@common';
import { BetterSet } from '../utils';
const { join } = window.require<typeof import('path')>('path');
const { readdir, readFile, exists, mkdir } =
  window.require<typeof import('../../preload/polyfill/fs/promises')>(
    'fs/promises'
  );

export const plugins: BetterSet<PluginInfo> = new BetterSet();
export const patches: Patch[] = [];

export const directory = join(HykordNative.getDirectory(), 'plugins');

const load = async () => {
  // Load internal plugins
  await import('../plugins');

  // Load external plugins
  if (!(await exists(directory))) await mkdir(directory);

  for (const file of await readdir(directory)) {
    try {
      const module = { filename: file, exports: {} as any };
      const fileContent = await readFile(join(directory, file), 'utf-8');
      
      const fn = new Function('require', 'module', 'exports', '__filename', '__dirname', fileContent);
      fn(window.require, module, module.exports, module.filename, directory, fileContent);

      const pl = new module.exports();
      pl.$fileName = file;

      addPlugin(pl);
    } catch (error: any) {
      Logger.err(`Failed to load plugin ${file}: ${error.message}`);
    }
  }

  for (const plugin of plugins) {
    if (plugin.$toggleable && !(await HykordNative.getManagers().getSettings().get('hykord.enabled.plugins', new Set())).has(plugin.$cleanName!)) continue;

    togglePlugin(plugin);
  }

  document.removeEventListener('DOMContentLoaded', load);
};

export const init = async () => {
  document.addEventListener('DOMContentLoaded', load);
};

export const addPlugin = async (plugin: PluginInfo) => {
  if (plugin.patches) {
    for (const patch of plugin.patches) {
      patch.plugin = plugin.name!;
      if (!Array.isArray(patch.replacement)) patch.replacement = [patch.replacement];
      
      if (patch.condition) {
        if (await patch.condition()) patches.push(patch);
      } else patches.push(patch);
    }
  }
  
  plugins.add(plugin);

  plugins.sort((a, b) => a.name.localeCompare(b.name));
};

export const enablePlugin = async (plugin: PluginInfo) => {
  Logger.info('Loading plugin', plugin.name);

  try {
    await plugin.start?.();
    plugin!.$enabled = true;

    Logger.info('Plugin', plugin.name, 'has been loaded!');
  } catch (error: any) {
    Logger.err(`Failed to start plugin ${plugin.name}: ${error.message}`);
  }
};

export const disablePlugin = async (plugin: PluginInfo) => {
  Logger.info('Disabling plugin', plugin.name);

  try {
    await plugin.stop?.();
    plugin!.$enabled = false;

    Logger.info('Plugin', plugin.name, 'has been disabled!');
  } catch (error: any) {
    Logger.err(`Failed to stop plugin ${plugin.name}: ${error.message}`);
  }
};

export const removePlugin = async (plugin: PluginInfo) => {
  plugins.delete(plugin);
};

export const togglePlugin = async (plugin: PluginInfo) => {
  if (plugin.$enabled) await disablePlugin(plugin);
  else await enablePlugin(plugin);
};
