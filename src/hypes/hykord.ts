export enum HykordIpcEvents {
    'GET_SETTING_SYNC' = 'HYKORD_GET_SETTING_SYNC',
    'GET_SETTING' = 'HYKORD_GET_SETTING',
    'SET_SETTING_SYNC' = 'HYKORD_SET_SETTING_SYNC',
    'SET_SETTING' = 'HYKORD_SET_SETTING',
    'SAVE_SETTINGS' = 'HYKORD_SAVE_SETTINGS',
}

export type KnownSettings = 
    'hykord.quickCss' |
    'hykord.react-dev-tools' |
    'hykord.disable-science-requests' |
    'hykord.unsafe-require';