"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseAndPrintLogs = exports.printLogs = exports.walkLogs = exports.parseLogs = void 0;
const colors_1 = require("./colors");
const COMPUTE_LIMIT = 200000;
// parseLogs returns a number of the total consumed compute units.
// User should log compute units at the beginning of the benchmark,
// Then after the benchmark, in order to get a more accurate total
const parseLine = (line) => {
    let match = line.match(/Program consumption: ([0-9]+) units remaining/);
    if (match && match.length > 1) {
        return {
            type: "units",
            units: COMPUTE_LIMIT - parseInt(match[1], 10)
        };
    }
    match = line.match(/consumed ([0-9]+) of [0-9]+ compute units/);
    if (match && match.length > 1) {
        return {
            type: "units",
            units: parseInt(match[1], 10)
        };
    }
    match = line.match(/Program log: Instruction: (.+)$/);
    if (match && match.length > 1) {
        return {
            type: "label",
            name: match[1]
        };
    }
    match = line.match(/Program log: Bench: (.+)$/);
    if (match && match.length > 1) {
        return {
            type: "label",
            name: match[1]
        };
    }
    return { type: "nomatch" };
};
function parseLogs(logs) {
    return walkLogs(logs, 0)[1];
}
exports.parseLogs = parseLogs;
// Returns next index and benchmark
function walkLogs(logs, idx) {
    const benchmark = {
        name: "",
        begin: -1,
        end: -1,
        logLines: [],
        children: [],
    };
    // Start with a general instruction wrapper
    if (idx === 0) {
        benchmark.begin = 0;
    }
    let i = idx;
    while (i < logs.length) {
        const line = logs[i];
        const result = parseLine(line);
        benchmark.logLines.push(line);
        if (result.type === "label") {
            // Is an identifier log line
            if (benchmark.name) {
                // Currently inside a node, process child node
                const [nextIdx, child] = walkLogs(logs, i);
                benchmark.logLines.pop(); // Remove log lines belonging to children
                benchmark.children.push(child);
                i = nextIdx;
            }
            else if (result.name) {
                benchmark.name = result.name;
                i += 1;
            }
        }
        else if (result.type === "units" && result.units) {
            if (benchmark.begin >= 0) {
                benchmark.end = result.units;
                return [i + 1, benchmark];
            }
            benchmark.begin = result.units;
            i += 1;
        }
        else {
            i += 1;
        }
    }
    throw Error("Error parsing logs");
}
exports.walkLogs = walkLogs;
const defaultPrintOptions = (options) => {
    const defaults = {
        indent: 2,
        color: true,
        verbosity: 1,
        thresholds: [10000, 20000],
        writer: (str) => {
            process.stdout.write(str);
        },
    };
    return Object.assign(Object.assign({}, defaults), options);
};
const printNode = (node, curIndent, options) => {
    const indent = options.indent;
    const indentSpace = " ".repeat(curIndent);
    const indentLead = indentSpace + "↪ ";
    const units = node.end - node.begin;
    const line = `${indentLead}Benchmark: ${node.name} - ${units} compute units\n`;
    if (options.color) {
        const colors = [colors_1.color.green, colors_1.color.yellow, colors_1.color.red];
        const colorCode = options.thresholds.findIndex((max) => max >= units);
        colorCode >= 0 ?
            options.writer(colors[colorCode](line)) :
            options.writer(colors[2](line));
    }
    else {
        options.writer(line);
    }
    if (options.verbosity > 1) {
        node.logLines.forEach((c) => process.stdout.write(`${indentSpace}  ${c}\n`));
    }
    if (node.children.length > 0) {
        node.children.forEach((c) => printNode(c, curIndent + indent, options));
    }
};
function printLogs(b, options) {
    const printOptions = defaultPrintOptions(options);
    printOptions.writer("\nCompute Units Benchmark\n-----------------------\n");
    printNode(b, 0, printOptions);
    printOptions.writer("-----------------------\n\n");
}
exports.printLogs = printLogs;
function parseAndPrintLogs(logs, options) {
    const parsedLogs = parseLogs(logs);
    printLogs(parsedLogs, options);
}
exports.parseAndPrintLogs = parseAndPrintLogs;
