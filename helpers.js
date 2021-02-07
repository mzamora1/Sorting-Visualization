export const map = (value, a, b, c, d) => {
    const temp = (value - a) / (b - a); // first map value from (a..b) to (0..1)
    return Math.round(c + temp * (d - c)); // then map it from (0..1) to (c..d) and return it
}
export const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

export const globalSleep = 10;