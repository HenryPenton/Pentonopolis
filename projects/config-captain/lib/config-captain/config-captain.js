"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DuplicateConfigKeyError = exports.EnvironmentVariableUndefinedError = exports.Configuration = void 0;
class Configuration {
    constructor(nonCriticalEnvironmentVariables, criticalEnvironmentVariables, dataSources) {
        this.nonCriticalEnvironmentVariables = nonCriticalEnvironmentVariables;
        this.criticalEnvironmentVariables = criticalEnvironmentVariables;
        this.dataSources = dataSources;
        this.environment = {};
        this.detectDuplicates();
        this.ensureCriticalEnvironmentVariablesExist();
        this.buildNonCriticalEnvironmentMap();
        this.buildCriticalEnvironmentMap();
    }
    detectDuplicates() {
        const criticalKeys = Object.keys(this.criticalEnvironmentVariables);
        const nonCriticalKeys = Object.keys(this.nonCriticalEnvironmentVariables);
        const totalSize = criticalKeys.length + nonCriticalKeys.length;
        const deduplicatedSize = new Set([...criticalKeys, ...nonCriticalKeys])
            .size;
        if (deduplicatedSize !== totalSize) {
            throw new DuplicateConfigKeyError("Two or more variables have been defined with the same name.");
        }
    }
    ensureCriticalEnvironmentVariablesExist() {
        const missingVariables = [];
        for (const objectValue of Object.values(this.criticalEnvironmentVariables)) {
            const criticalEntry = objectValue;
            let variableFound = false;
            for (const dataSource of this.dataSources) {
                if (dataSource[criticalEntry]) {
                    variableFound = true;
                    break;
                }
            }
            if (!variableFound) {
                missingVariables.push(criticalEntry);
            }
        }
        const totalErrors = missingVariables.length;
        if (totalErrors === 1) {
            throw new EnvironmentVariableUndefinedError(`The environment variable ${missingVariables[0]} was undefined`);
        }
        if (totalErrors > 0) {
            const lastName = missingVariables.pop();
            const errorString = missingVariables.join(", ") + ` and ${lastName}`;
            throw new EnvironmentVariableUndefinedError(`The environment variables ${errorString} were undefined`);
        }
    }
    buildEnvironmentVariableMap(variables) {
        Object.entries(variables).forEach(([userGivenName, entry]) => {
            for (const dataSource of this.dataSources) {
                const variableName = entry;
                const currentIterationValue = dataSource[variableName];
                this.environment = {
                    ...this.environment,
                    [userGivenName]: dataSource[variableName],
                };
                if (currentIterationValue) {
                    break;
                }
            }
        });
    }
    buildCriticalEnvironmentMap() {
        this.buildEnvironmentVariableMap(this.criticalEnvironmentVariables);
    }
    buildNonCriticalEnvironmentMap() {
        this.buildEnvironmentVariableMap(this.nonCriticalEnvironmentVariables);
    }
    getConfigurationVariables() {
        return this.environment;
    }
    getConfigurationVariable(variableName) {
        return this.environment[variableName];
    }
    getConfigurationVariableOrUndefined(variableName) {
        return this.environment[variableName];
    }
}
exports.Configuration = Configuration;
class EnvironmentVariableUndefinedError extends Error {
}
exports.EnvironmentVariableUndefinedError = EnvironmentVariableUndefinedError;
class DuplicateConfigKeyError extends Error {
}
exports.DuplicateConfigKeyError = DuplicateConfigKeyError;
