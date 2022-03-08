import { color } from "./colors"

const COMPUTE_LIMIT = 200000

interface Benchmark {
    name: string,
    begin: number,
    end: number,
    logLines: string[],
    children: Benchmark[],
}

interface ParseResult {
    type: string,
    name?: string,
    units?: number,
}

// parseLogs returns a number of the total consumed compute units.
// User should log compute units at the beginning of the benchmark,
// Then after the benchmark, in order to get a more accurate total
const parseLine = (line: string): ParseResult => {

    let match = line.match(/Program consumption: ([0-9]+) units remaining/)
    if (match && match.length > 1) {
        return {
            type: "units",
            units: COMPUTE_LIMIT - parseInt(match[1], 10)
        }
    }

    match = line.match(/consumed ([0-9]+) of [0-9]+ compute units/)
    if (match && match.length > 1) {
        return {
            type: "units",
            units: parseInt(match[1], 10)
        }
    }

    match = line.match(/Program log: Instruction: (.+)$/)
    if (match && match.length > 1) {
        return {
            type: "label",
            name: match[1]
        }
    }

    match = line.match(/Program log: Bench: (.+)$/)
    if (match && match.length > 1) {
        return {
            type: "label",
            name: match[1]
        }
    }

    return { type: "nomatch" }
}

export function parseLogs(logs: string[]): Benchmark {
    return walkLogs(logs, 0)[1]
}

// Returns next index and benchmark
export function walkLogs(logs: string[], idx: number): [number, Benchmark] {
    const benchmark: Benchmark = {
        name: "",
        begin: -1,
        end: -1,
        logLines: [],
        children: [],
    }

    // Start with a general instruction wrapper
    if (idx === 0) {
        benchmark.begin = 0
    }

    let i = idx;
    while (i < logs.length) {
        const line = logs[i];
        const result = parseLine(line)
        benchmark.logLines.push(line);
        
        if (result.type === "label") {
            // Is an identifier log line
            if (benchmark.name) {
                // Currently inside a node, process child node
                const [nextIdx, child] = walkLogs(logs, i);
                benchmark.logLines.pop() // Remove log lines belonging to children
                benchmark.children.push(child);
                i = nextIdx;
            } else if (result.name) {
                benchmark.name = result.name;
                i += 1;
            }
        } else if (result.type === "units" && result.units) {
            if (benchmark.begin >= 0) {
                benchmark.end = result.units;
                return [i + 1, benchmark]
            }
            benchmark.begin = result.units;
            i += 1;
        } else {
            i += 1;
        }
    }
    throw Error("Error parsing logs")
}


// Printer portion of sol_log_bench

export interface PrintOptionArg {
    indent?: number,
    color?: boolean,
    verbosity?: number,
    thresholds?: number[],
    writer?(str: string): void,
}
interface PrintOption {
    indent: number,
    color: boolean,
    verbosity: number,
    thresholds: number[],
    writer(str: string): void,
}

const defaultPrintOptions = (options?: PrintOptionArg): PrintOption => {
    const defaults = {
        indent: 2,
        color: true,
        verbosity: 1,
        thresholds: [10000, 20000],
        writer: (str: string) => {
            process.stdout.write(str);
        },
    };
    return {...defaults, ...options}
}

const printNode = (node: Benchmark, curIndent: number, options: PrintOption): void => {
    const indent = options.indent;
    const indentSpace = " ".repeat(curIndent)
    const indentLead = indentSpace + "↪ "

    const units = node.end - node.begin;
    const line = `${indentLead}Benchmark: ${node.name} - ${units} compute units\n`;

    if (options.color) {
        const colors = [color.green, color.yellow, color.red]
        const colorCode = options.thresholds.findIndex((max) => max >= units);
        colorCode >= 0 ?
            options.writer(colors[colorCode](line)) :
            options.writer(colors[2](line))
    } else {
        options.writer(line)
    }


    if (options.verbosity > 1) {
        node.logLines.forEach((c) => process.stdout.write(`${indentSpace}  ${c}\n`));
    }

    if (node.children.length > 0) {
        node.children.forEach((c) => printNode(c, curIndent + indent, options));
    }
}

export function printLogs(b: Benchmark, options?: PrintOptionArg): void {
    const printOptions = defaultPrintOptions(options)
    printOptions.writer("\nCompute Units Benchmark\n-----------------------\n")
    printNode(b, 0, printOptions)
    printOptions.writer("-----------------------\n\n")
}

export function parseAndPrintLogs(logs: string[], options?: PrintOptionArg): void {
    const parsedLogs = parseLogs(logs)
    printLogs(parsedLogs, options)
}