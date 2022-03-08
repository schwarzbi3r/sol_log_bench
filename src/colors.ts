export const color = {
    byNum: (mess: string, fgNum: number, bgNum?: number) => {
        mess = mess || '';
        fgNum = fgNum === undefined ? 31 : fgNum;
        bgNum = bgNum === undefined ? 47 : bgNum;
        return '\x1b[' + fgNum + 'm' + mess + '\x1b[0m';
    },
    black: (mess: string, fgNum?: number) => color.byNum(mess, 30, fgNum),
    red: (mess: string, fgNum?: number) => color.byNum(mess, 31, fgNum),
    green: (mess: string, fgNum?: number) => color.byNum(mess, 32, fgNum),
    yellow: (mess: string, fgNum?: number) => color.byNum(mess, 33, fgNum),
    blue: (mess: string, fgNum?: number) => color.byNum(mess, 34, fgNum),
    magenta: (mess: string, fgNum?: number) => color.byNum(mess, 35, fgNum),
    cyan: (mess: string, fgNum?: number) => color.byNum(mess, 36, fgNum),
    white: (mess: string, fgNum?: number) => color.byNum(mess, 37, fgNum),
};