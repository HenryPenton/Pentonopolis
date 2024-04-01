type SystemConfiguration<NonCritical, Critical> = {
    [Property in keyof NonCritical]?: string;
} & {
    [Property in keyof Critical]: string;
};
export type VariableSet<UserDefinitions> = {
    [Property in keyof UserDefinitions]: string;
};
interface IConfiguration<NonCritical, Critical> {
    getConfigurationVariables: () => SystemConfiguration<NonCritical, Critical>;
    getConfigurationVariable: (variableName: keyof Critical) => SystemConfiguration<NonCritical, Critical>[keyof Critical];
}
export declare class Configuration<NonCritical, Critical> implements IConfiguration<NonCritical, Critical> {
    private nonCriticalEnvironmentVariables;
    private criticalEnvironmentVariables;
    private dataSources;
    private environment;
    constructor(nonCriticalEnvironmentVariables: VariableSet<NonCritical>, criticalEnvironmentVariables: VariableSet<Critical>, dataSources: {
        [key: string]: string | undefined;
    }[]);
    private detectDuplicates;
    private ensureCriticalEnvironmentVariablesExist;
    private buildEnvironmentVariableMap;
    private buildCriticalEnvironmentMap;
    private buildNonCriticalEnvironmentMap;
    getConfigurationVariables(): SystemConfiguration<NonCritical, Critical>;
    getConfigurationVariable(variableName: keyof Critical): SystemConfiguration<NonCritical, Critical>[keyof Critical];
    getConfigurationVariableOrUndefined(variableName: keyof NonCritical): SystemConfiguration<NonCritical, Critical>[keyof NonCritical];
}
export declare class EnvironmentVariableUndefinedError extends Error {
}
export declare class DuplicateConfigKeyError extends Error {
}
export {};
