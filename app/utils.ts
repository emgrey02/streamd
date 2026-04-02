export function getDate(birthday: string) {
    const birthArray = birthday.split('-');
    const months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ];
    const month = months[+birthArray[1] - 1];
    return `${month} ${birthArray[2]}, ${birthArray[0]}`;
}

export function getRuntime(min: number) {
    const hrs = (min / 60).toFixed(0);
    const mins = min % 60;
    return `${hrs}h ${mins}m`;
}

export function convertQuantity(amt: number) {
    const str = amt.toString().split('');
    str.splice(-3, 0, ',');
    str.splice(-7, 0, ',');
    if (str.length >= 12) str.splice(-11, 0, ',');
    if (str.length === 8) str.splice(0, 1);
    const finalStr = str.join('');
    return `$${finalStr}`;
}

export function capitalizeCategory(cat: string) {
    if (cat.includes('_')) {
        const array = cat.split('_');
        const firstLetterCap = array[0].slice(0, 1).toUpperCase();
        const secondLetterCap = array[1].slice(0, 1).toUpperCase();

        array[0] = firstLetterCap + array[0].slice(1);
        array[1] = secondLetterCap + array[1].slice(1);

        if (array[2]) {
            const thirdLetterCap = array[2]?.slice(0, 1).toUpperCase();
            array[2] = thirdLetterCap + array[2]?.slice(1);
        }

        return `${array.join(' ')}`;
    } else {
        const capLetter = cat.slice(0, 1).toUpperCase();
        let capCat = `${capLetter}${cat.slice(1)}`;
        if (capCat === 'Movie') capCat = 'Movies';
        return capCat;
    }
}

export function fromURLToTitle(cont: string) {
    if (cont === 'movie') {
        return 'Movies';
    } else if (cont === 'tv') {
        return 'Shows';
    } else if (cont === 'trending') {
        return 'Trending';
    }
}
