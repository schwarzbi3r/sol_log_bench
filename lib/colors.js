"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.color = void 0;
exports.color = {
    byNum: (mess, fgNum, bgNum) => {
        mess = mess || '';
        fgNum = fgNum === undefined ? 31 : fgNum;
        bgNum = bgNum === undefined ? 47 : bgNum;
        return '\x1b[' + fgNum + 'm' + mess + '\x1b[0m';
    },
    black: (mess, fgNum) => exports.color.byNum(mess, 30, fgNum),
    red: (mess, fgNum) => exports.color.byNum(mess, 31, fgNum),
    green: (mess, fgNum) => exports.color.byNum(mess, 32, fgNum),
    yellow: (mess, fgNum) => exports.color.byNum(mess, 33, fgNum),
    blue: (mess, fgNum) => exports.color.byNum(mess, 34, fgNum),
    magenta: (mess, fgNum) => exports.color.byNum(mess, 35, fgNum),
    cyan: (mess, fgNum) => exports.color.byNum(mess, 36, fgNum),
    white: (mess, fgNum) => exports.color.byNum(mess, 37, fgNum),
};
