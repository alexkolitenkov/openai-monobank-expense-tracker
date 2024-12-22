export function generateIds(n) {
    const ids = [];

    for (let i = 0; i < n; ++i) { // eslint-disable-line
        let id = generateId();

        if (ids.includes(id)) {
            while (ids.includes(id)) id = generateId();
        }

        ids.push(id);
    }

    return ids;
}

export function generateId() {
    const timestamp = `${Date.now()}`.slice(0, -3);

    return +`${timestamp}${getRandomInt(100000, 999999)}`;
}

function getRandomInt(min, max) {
    const minBorder = Math.ceil(min);
    const maxBorder = Math.floor(max);

    return Math.floor(Math.random() * (maxBorder - minBorder)) + minBorder;
}

export const asyncCallWithTimeout = async (asyncPromise, timeLimit) => {
    let timeoutHandle;

    const timeoutPromise = new Promise((_resolve, reject) => {
        timeoutHandle = setTimeout(
            () => reject(new Error('Async call timeout limit reached')),
            timeLimit
        );
    });

    return Promise.race([ asyncPromise, timeoutPromise ]).then(result => { // eslint-disable-line more/no-then
        clearTimeout(timeoutHandle);

        return result;
    });
};

export function generateConsecutiveIds(n) {
    const ids = [];
    const range = Math.floor(899_999 / n);

    for (let i = 0; i < n; ++i) { // eslint-disable-line
        const min = 100_000 + range * i;
        const max = 100_000 + range * (i + 1);
        const timestamp = `${Date.now()}`.slice(0, -3);
        const id        = +`${timestamp}${getRandomInt(min, max)}`;

        ids.push(id);
    }

    return ids;
}
