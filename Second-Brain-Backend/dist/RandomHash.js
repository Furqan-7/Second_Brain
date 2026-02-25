export function random(len) {
    let options = "9238192874uhasdfgasiudfyasidfhasidh";
    let length = options.length;
    let ans = "";
    for (let i = 0; i < len; i++) {
        ans += options[Math.floor(Math.random() * length)];
    }
    return ans;
}
//# sourceMappingURL=RandomHash.js.map