export abstract class Theme {
    // Required properties
    public abstract readonly name: string;
    public abstract readonly version: string;
    public abstract readonly author: string;
    public abstract start(): string;

    // Optional properties
    public description: string | null = null;
    public license: string | null = null;
    public showInSettings: boolean = true;
    public cssId: string | null = null;
    public internal: boolean = false;
}