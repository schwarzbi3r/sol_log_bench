export const color = {
    byNum: (mess: string, fgNum: number) => {
        mess = mess || "";
        return "\x1b[" + fgNum + "m" + mess + "\x1b[0m";
    },
    black: (mess: string) => color.byNum(mess, 30),
    red: (mess: string) => color.byNum(mess, 31),
    green: (mess: string) => color.byNum(mess, 32),
    yellow: (mess: string) => color.byNum(mess, 33),
    blue: (mess: string) => color.byNum(mess, 34),
    magenta: (mess: string) => color.byNum(mess, 35),
    cyan: (mess: string) => color.byNum(mess, 36),
    white: (mess: string) => color.byNum(mess, 37),
};