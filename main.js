import { generateQuiz } from './src/math.js';
import { saveResult, getHistory, clearHistory, saveUserName, getUserName, getUsersList } from './src/storage.js';

// State
let currentQuiz = [];
let currentIndex = 0;
let userAnswers = [];
let currentOperation = '';

// DOM Elements
const screens = {
    onboarding: document.getElementById('onboarding-screen'),
    setup: document.getElementById('setup-screen'),
    quiz: document.getElementById('quiz-screen'),
    results: document.getElementById('results-screen'),
    history: document.getElementById('history-screen')
};

// Onboarding Elements
const userNameInput = document.getElementById('user-name-input');
const saveUserBtn = document.getElementById('save-user-btn');
const existingUsersSection = document.getElementById('existing-users-section');
const usersListContainer = document.getElementById('users-list-container');
const welcomeTitle = document.getElementById('welcome-title');

// Setup Screen Elements
const startBtn = document.getElementById('start-btn');
const viewHistoryBtn = document.getElementById('view-history-btn');
const switchUserBtn = document.getElementById('switch-user-btn');
const opSelect = document.getElementById('operation');
const countInput = document.getElementById('count');
const digits1Input = document.getElementById('digits1');
const digits2Input = document.getElementById('digits2');

// Quiz Screen Elements
const currentStepText = document.getElementById('current-step');
const progressFill = document.getElementById('progress-fill');
const questionText = document.getElementById('question-text');
const answerInput = document.getElementById('answer-input');
const remainderInput = document.getElementById('remainder-input');
const remainderContainer = document.getElementById('remainder-container');
const quizWarning = document.getElementById('quiz-warning');
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

function init() {
    const name = getUserName();
    if (name) {
        welcomeTitle.innerText = `Welcome, ${name}! 🎨`;
        showScreen('setup');
    } else {
        showOnboarding();
    }
}

function showOnboarding() {
    const users = getUsersList();
    if (users.length > 0) {
        existingUsersSection.style.display = 'block';
        usersListContainer.innerHTML = users.map(user => `
            <button class="btn-secondary user-chip" data-user="${user}">${user}</button>
        `).join('');

        // Add listeners to chips
        document.querySelectorAll('.user-chip').forEach(btn => {
            btn.addEventListener('click', () => {
                selectUser(btn.dataset.user);
            });
        });
    } else {
        existingUsersSection.style.display = 'none';
    }
    userNameInput.value = '';
    showScreen('onboarding');
}

function selectUser(name) {
    saveUserName(name);
    welcomeTitle.innerText = `Welcome, ${name}! 🎨`;
    showScreen('setup');
}

function startQuiz() {
    currentOperation = opSelect.value;
    const count = parseInt(countInput.value) || 10;
    const d1 = parseInt(digits1Input.value) || 1;
    const d2 = parseInt(digits2Input.value) || 1;

    currentQuiz = generateQuiz(currentOperation, count, d1, d2);
    currentIndex = 0;
    userAnswers = [];

    updateQuizUI();
    showScreen('quiz');
}

function updateQuizUI() {
    const current = currentQuiz[currentIndex];
    currentStepText.innerText = `Question ${currentIndex + 1} of ${currentQuiz.length}`;
    progressFill.style.width = `${(currentIndex / currentQuiz.length) * 100}%`;
    questionText.innerText = current.question;

    answerInput.value = '';
    remainderInput.value = '';

    quizWarning.innerText = current.warning || '';

    if (currentOperation === 'division') {
        remainderContainer.style.display = 'block';
    } else {
        remainderContainer.style.display = 'none';
    }

    answerInput.focus();
}

function handleNext() {
    const answer = parseInt(answerInput.value);
    const remainder = parseInt(remainderInput.value) || 0;

    if (isNaN(answer)) {
        alert('Please enter a number!');
        return;
    }

    userAnswers.push({ answer, remainder });

    if (currentIndex < currentQuiz.length - 1) {
        currentIndex++;
        updateQuizUI();
    } else {
        finishQuiz();
    }
}

function finishQuiz() {
    const results = currentQuiz.map((q, i) => {
        const u = userAnswers[i];
        const isCorrect = q.correctAnswer === u.answer && q.remainder === u.remainder;
        return { ...q, userAnswer: u.answer, userRemainder: u.remainder, isCorrect };
    });

    const correctCount = results.filter(r => r.isCorrect).length;

    saveResult({
        operation: currentOperation,
        score: `${correctCount}/${results.length}`,
        total: results.length,
        correct: correctCount,
        timestamp: Date.now()
    });

    scoreSummary.innerText = `You got ${correctCount} / ${results.length}!`;
    resultsDetails.innerHTML = results.map(r => `
        <div class="result-item" style="flex-direction: column; align-items: flex-start; gap: 5px;">
            <div style="width: 100%; display: flex; justify-content: space-between;">
                <strong>${r.num1} ${r.operation} ${r.num2}</strong>
                <span class="${r.isCorrect ? 'correct' : 'incorrect'}">
                    ${r.isCorrect ? 'Correct! ✅' : 'Oops! ❌'}
                </span>
            </div>
            <div style="font-size: 0.9rem; color: #666;">
                The answer was ${r.correctAnswer}${r.operation === '÷' ? ` R ${r.remainder}` : ''}.
                Your answer: ${r.userAnswer}${r.operation === '÷' ? ` R ${r.userRemainder}` : ''}.
            </div>
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
                User: ${h.userName || 'Unknown'}<br>
                Score: <span style="font-weight:bold; color:var(--secondary)">${h.score}</span>
            </div>
        `).join('');
    }
    showScreen('history');
}

// --- Event Listeners ---

saveUserBtn.addEventListener('click', () => {
    const name = userNameInput.value.trim();
    if (name) {
        selectUser(name);
    } else {
        alert('Please enter your name!');
    }
});

switchUserBtn.addEventListener('click', () => {
    showOnboarding();
});

startBtn.addEventListener('click', startQuiz);
viewHistoryBtn.addEventListener('click', showHistory);
homeBtn.addEventListener('click', () => showScreen('setup'));
historyHomeBtn.addEventListener('click', () => showScreen('setup'));
playAgainBtn.addEventListener('click', startQuiz);

nextBtn.addEventListener('click', handleNext);

[answerInput, remainderInput].forEach(inp => {
    inp.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleNext();
    });
});

clearHistoryBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to clear your history?')) {
        clearHistory();
        showHistory();
    }
});

// Initialize
init();
