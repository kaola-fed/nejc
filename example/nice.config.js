var path = require('path');
var fs = require('fs');
var map = {};

module.exports = {
    'src': 'nej-nej',
    'dist': 'nej-commonjs',
    'ignoreFiles': ['nes'],
    'ext': ['.js'],
    'alias': {
        lib: path.resolve('./nej-nej'),
    },
    'outputAlias': {},
    'mode': 1,
    'plugins': [
        function({
            text,
            deps
        }) {
            var mapJson = './map.json';

            deps.forEach(dep => {
                if (!~dep.indexOf('nej-nej')) {
                    return;
                }
                dep = dep.replace(path.resolve('./nej-nej'), '');

                if (!map[dep])
                    map[dep] = 0;
                map[dep] += 1;
            });

            fs.writeFileSync(mapJson, JSON.stringify(getCommonJS(map, 5), null, 4));
            return text;
        }
    ]
};

function getCommonJS(map, num) {
    return Object.keys(map).reduce((prev, item) => {
        if (map[item] >= num) {
            prev[item] = map[item];
        }
        return prev;
    }, {})
}