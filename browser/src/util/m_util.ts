export class M_Util {
    constructor() {
    }

    // create svg image in resources folder from string
    createSvgFile(s: string, filename: string) {
        const fs = require('fs');
        fs.writeFileSync(`public/resources/${filename}`, s);

}   
}