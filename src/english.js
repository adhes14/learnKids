export const numberToEnglish = (num) => {
    if (num === 0) return 'zero';

    const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
    const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
    const teens = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];

    const convertLessThanOneThousand = (n) => {
        let result = '';

        if (n >= 100) {
            result += ones[Math.floor(n / 100)] + ' hundred ';
            n %= 100;
        }

        if (n >= 10 && n <= 19) {
            result += teens[n - 10] + ' ';
        } else if (n >= 20) {
            result += tens[Math.floor(n / 10)];
            if (n % 10 > 0) {
                result += '-' + ones[n % 10] + ' ';
            } else {
                result += ' ';
            }
        } else if (n > 0) {
            result += ones[n] + ' ';
        }

        return result.trim().replace(/ +/g, ' ');
    };

    let result = '';

    if (num >= 1000) {
        result += convertLessThanOneThousand(Math.floor(num / 1000)) + ' thousand ';
        num %= 1000;
    }

    result += convertLessThanOneThousand(num);

    return result.trim();
};

export const generateEnglishExercise = (digits) => {
    const min = Math.pow(10, digits - 1);
    const max = Math.pow(10, digits) - 1;

    const actualMin = digits === 1 ? 0 : min;
    const num = Math.floor(Math.random() * (max - actualMin + 1)) + actualMin;

    return {
        num1: num,
        num2: null,  // Fill structure to match math object somewhat
        operation: 'english',
        correctAnswer: numberToEnglish(num),
        question: `${num}`,
        warning: null,
        remainder: 0 // Keep consistent with results screen
    };
};

export const generateEnglishQuiz = (count, digits) => {
    const exercises = [];
    for (let i = 0; i < count; i++) {
        exercises.push(generateEnglishExercise(digits));
    }
    return exercises;
};
