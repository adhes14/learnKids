import { generateQuiz } from './src/math.js';
import { saveResult, getHistory, clearHistory } from './src/storage.js';

// State
let currentQuiz = [];
let currentIndex = 0;
let userAnswers = [];
let currentOperation = '';

// DOM Elements
const screens = {
    setup: document.getElementById('setup-screen'),
    quiz: document.getElementById('quiz-screen'),
    results: document.getElementById('results-screen'),
    history: document.getElementById('history-screen')
};

// Setup Screen Elements
const startBtn = document.getElementById('start-btn');
const viewHistoryBtn = document.getElementById('view-history-btn');
const opSelect = document.getElementById('operation');
const countInput = document.getElementById('count');
const digitsInput = document.getElementById('digits');

// Quiz Screen Elements
const currentStepText = document.getElementById('current-step');
const progressFill = document.getElementById('progress-fill');
const questionText = document.getElementById('question-text');
const answerInput = document.getElementById('answer-input');
const nextBtn = document.getElementById('next-btn');

// Results Screen Elements
const scoreSummary = document.getElementById('score-summary');
const resultsDetails = document.getElementById('results-details');
const playAgainBtn = document.getElementById('play-again-btn');
const homeBtn = document.getElementById('home-btn');

// History Screen Elements
const historyList = document.getElementById('history-list');
const historyHomeBtn = document.getElementById('history-home-btn');
const clearHistoryBtn = document.getElementById('clear-history-btn');

// --- Functions ---

function showScreen(screenId) {
    Object.values(screens).forEach(s => s.classList.remove('active'));
    screens[screenId].classList.add('active');
}

function startQuiz() {
    currentOperation = opSelect.value;
    const count = parseInt(countInput.value) || 10;
    const digits = parseInt(digitsInput.value) || 1;

    currentQuiz = generateQuiz(currentOperation, count, digits);
    currentIndex = 0;
    userAnswers = [];

    updateQuizUI();
    showScreen('quiz');
    answerInput.focus();
}

function updateQuizUI() {
    const current = currentQuiz[currentIndex];
    currentStepText.innerText = `Question ${currentIndex + 1} of ${currentQuiz.length}`;
    progressFill.style.width = `${(currentIndex / currentQuiz.length) * 100}%`;
    questionText.innerText = current.question;
    answerInput.value = '';
}

function handleNext() {
    const answer = parseInt(answerInput.value);
    if (isNaN(answer)) {
        alert('Please enter a number!');
        return;
    }

    userAnswers.push(answer);

    if (currentIndex < currentQuiz.length - 1) {
        currentIndex++;
        updateQuizUI();
        answerInput.focus();
    } else {
        finishQuiz();
    }
}

function finishQuiz() {
    const results = currentQuiz.map((q, i) => ({
        ...q,
        userAnswer: userAnswers[i],
        isCorrect: q.correctAnswer === userAnswers[i]
    }));

    const correctCount = results.filter(r => r.isCorrect).length;

    // Save to history
    saveResult({
        operation: currentOperation,
        score: `${correctCount}/${results.length}`,
        total: results.length,
        correct: correctCount,
        timestamp: Date.now()
    });

    // Update Results UI
    scoreSummary.innerText = `You got ${correctCount} / ${results.length}!`;
    resultsDetails.innerHTML = results.map(r => `
    <div class="result-item">
      <span>${r.num1} ${r.operation} ${r.num2} = ${r.correctAnswer}</span>
      <span class="${r.isCorrect ? 'correct' : 'incorrect'}">
        Your answer: ${r.userAnswer} ${r.isCorrect ? '✅' : '❌'}
      </span>
    </div>
  `).join('');

    showScreen('results');
}

function showHistory() {
    const history = getHistory();
    if (history.length === 0) {
        historyList.innerHTML = '<p style="text-align:center; padding: 20px;">No games yet. Go play! 🚀</p>';
    } else {
        historyList.innerHTML = history.map(h => `
      <div class="history-card">
        <strong>${h.operation.toUpperCase()}</strong> - ${h.date}<br>
        Score: <span style="font-weight:bold; color:var(--secondary)">${h.score}</span>
      </div>
    `).join('');
    }
    showScreen('history');
}

// --- Event Listeners ---

startBtn.addEventListener('click', startQuiz);
viewHistoryBtn.addEventListener('click', showHistory);
homeBtn.addEventListener('click', () => showScreen('setup'));
historyHomeBtn.addEventListener('click', () => showScreen('setup'));
playAgainBtn.addEventListener('click', startQuiz);

nextBtn.addEventListener('click', handleNext);

answerInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleNext();
});

clearHistoryBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to clear your history?')) {
        clearHistory();
        showHistory();
    }
});

// Initialize
showScreen('setup');
