import { addPlugin } from '../loaders/plugin';

// Plugins:
import { MessageAPI } from './messageApi';
import { SettingsAPI } from './settingsApi';
import { Settings } from './settings';
import { Experiments } from './experiments';

addPlugin(new SettingsAPI());
addPlugin(new MessageAPI());
addPlugin(new Settings());
addPlugin(new Experiments());

// TODO: auto generate with esbuild
