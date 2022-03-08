interface Benchmark {
    name: string;
    begin: number;
    end: number;
    logLines: string[];
    children: Benchmark[];
}
export declare function parseLogs(logs: string[]): Benchmark;
export declare function walkLogs(logs: string[], idx: number): [number, Benchmark];
export interface PrintOptionArg {
    indent?: number;
    color?: boolean;
    verbosity?: number;
    thresholds?: number[];
    writer?(str: string): void;
}
export declare function printLogs(b: Benchmark, options?: PrintOptionArg): void;
export declare function parseAndPrintLogs(logs: string[], options?: PrintOptionArg): void;
export {};
