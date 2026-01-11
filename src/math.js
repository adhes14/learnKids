export const generateExercise = (operation, digits) => {
  const min = Math.pow(10, digits - 1);
  const max = Math.pow(10, digits) - 1;

  let num1 = Math.floor(Math.random() * (max - min + 1)) + min;
  let num2 = Math.floor(Math.random() * (max - min + 1)) + min;

  let correctAnswer;
  let opSymbol;

  switch (operation) {
    case 'addition':
      opSymbol = '+';
      correctAnswer = num1 + num2;
      break;
    case 'subtraction':
      opSymbol = '-';
      // Ensure num1 is always greater or equal to num2 for kids
      if (num1 < num2) [num1, num2] = [num2, num1];
      correctAnswer = num1 - num2;
      break;
    case 'multiplication':
      opSymbol = '×';
      correctAnswer = num1 * num2;
      break;
    case 'division':
      opSymbol = '÷';
      // Ensure no division by zero and whole number result
      // We generate num2 and result, then calculate num1
      num2 = Math.floor(Math.random() * (max - min + 1)) + min;
      const result = Math.floor(Math.random() * (max - min + 1)) + min;
      num1 = num2 * result;
      correctAnswer = result;
      break;
    default:
      throw new Error('Invalid operation');
  }

  return {
    num1,
    num2,
    operation: opSymbol,
    correctAnswer,
    question: `${num1} ${opSymbol} ${num2} = ?`
  };
};

export const generateQuiz = (operation, count, digits) => {
  const exercises = [];
  for (let i = 0; i < count; i++) {
    exercises.push(generateExercise(operation, digits));
  }
  return exercises;
};
