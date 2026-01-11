export const generateExercise = (operation, digits1, digits2) => {
  const min1 = Math.pow(10, digits1 - 1);
  const max1 = Math.pow(10, digits1) - 1;
  const min2 = Math.pow(10, digits2 - 1);
  const max2 = Math.pow(10, digits2) - 1;

  let num1 = Math.floor(Math.random() * (max1 - min1 + 1)) + min1;
  let num2 = Math.floor(Math.random() * (max2 - min2 + 1)) + min2;

  let correctAnswer;
  let opSymbol;
  let remainder = 0;
  let warning = null;

  switch (operation) {
    case 'addition':
      opSymbol = '+';
      correctAnswer = num1 + num2;
      break;
    case 'subtraction':
      opSymbol = '-';
      if (num1 < num2) {
        warning = "Watch out! The result will be a negative number!";
      }
      correctAnswer = num1 - num2;
      break;
    case 'multiplication':
      opSymbol = '×';
      correctAnswer = num1 * num2;
      break;
    case 'division':
      opSymbol = '÷';
      // Enforce n1 digits >= n2 digits
      if (digits1 < digits2) {
        // Swap or re-generate if constraints are violated by user choice
        // Actually, the UI should prevent this, but let's be safe.
        [num1, num2] = [num2, num1];
      }
      correctAnswer = Math.floor(num1 / num2);
      remainder = num1 % num2;
      break;
    default:
      throw new Error('Invalid operation');
  }

  return {
    num1,
    num2,
    operation: opSymbol,
    correctAnswer,
    remainder,
    warning,
    question: `${num1} ${opSymbol} ${num2} = ?`
  };
};

export const generateQuiz = (operation, count, digits1, digits2) => {
  const exercises = [];
  for (let i = 0; i < count; i++) {
    exercises.push(generateExercise(operation, digits1, digits2));
  }
  return exercises;
};
