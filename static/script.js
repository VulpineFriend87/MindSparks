let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let questionHistory = [];
let selectedLanguage = 'en';

const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const resultScreen = document.getElementById('result-screen');
const loadingScreen = document.getElementById('loading-screen');
const questionText = document.getElementById('question-text');
const answersContainer = document.getElementById('answers');
const scoreElement = document.getElementById('score');
const finalScoreElement = document.getElementById('final-score');
const progressBar = document.querySelector('.progress');
const currentQuestionElement = document.getElementById('current-question');
const totalQuestionsElement = document.getElementById('total-questions');
const correctAnswersElement = document.getElementById('correct-answers');
const totalQuestionsResultElement = document.getElementById('total-questions-result');
const questionsReviewList = document.getElementById('questions-review-list');

document.getElementById('start-btn').addEventListener('click', startGame);
document.getElementById('play-again-btn').addEventListener('click', startGame);

function showLoadingScreen() {
    loadingScreen.style.display = 'flex';
    loadingScreen.style.opacity = '0';
    setTimeout(() => {
        loadingScreen.style.opacity = '1';
    }, 10);
}

function hideLoadingScreen() {
    loadingScreen.style.opacity = '0';
    setTimeout(() => {
        loadingScreen.style.display = 'none';
    }, 300);
}

async function fetchQuestions() {
    showLoadingScreen();
    try {
        const lang = document.getElementById('language-select').value;
        const response = await fetch(`/get_questions?lang=${lang}`);
        const data = await response.json();

        if (!data.results || !Array.isArray(data.results)) {
            throw new Error('Invalid response format');
        }

        questions = data.results.map(q => ({
            question: q.question,
            answers: shuffleArray([...q.incorrect_answers, q.correct_answer]),
            correctAnswer: q.correct_answer
        }));

        currentQuestionIndex = 0;
        score = 0;
        hideLoadingScreen();
        return questions.length > 0;
    } catch (error) {
        console.error('Error fetching questions:', error);
        hideLoadingScreen();
        return false;
    }
}

async function startGame() {
    score = 0;
    currentQuestionIndex = 0;
    questionHistory = [];
    scoreElement.textContent = score;

    startScreen.classList.add('hidden');
    resultScreen.classList.add('hidden');

    const success = await fetchQuestions();
    if (success) {
        totalQuestionsElement.textContent = questions.length;
        totalQuestionsResultElement.textContent = questions.length;
        gameScreen.classList.remove('hidden');
        showQuestion();
    } else {
        alert('Failed to fetch questions. Please try again.');
        startScreen.classList.remove('hidden');
    }
}

function showQuestion() {
    const question = questions[currentQuestionIndex];
    currentQuestionElement.textContent = currentQuestionIndex + 1;

    // Add exit animation to current question
    questionText.classList.add('question-exit');

    setTimeout(() => {
        questionText.innerHTML = question.question;
        progressBar.style.width = `${((currentQuestionIndex + 1) / questions.length) * 100}%`;

        // Remove exit class and add enter animation
        questionText.classList.remove('question-exit');
        questionText.classList.add('question-enter');

        // Clear and rebuild answers
        answersContainer.innerHTML = '';
        question.answers.forEach((answer, index) => {
            const button = document.createElement('button');
            button.className = 'answer-btn';
            button.style.opacity = '0';
            button.style.transform = 'translateY(20px)';
            button.innerHTML = answer;
            button.addEventListener('click', () => checkAnswer(answer, button));
            answersContainer.appendChild(button);

            // Stagger the animation of answer buttons
            setTimeout(() => {
                button.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
                button.style.opacity = '1';
                button.style.transform = 'translateY(0)';
            }, index * 100);
        });

        // Remove enter animation after it completes
        setTimeout(() => {
            questionText.classList.remove('question-enter');
        }, 300);
    }, 300);
}

function checkAnswer(selectedAnswer, selectedButton) {
    const question = questions[currentQuestionIndex];
    const buttons = document.querySelectorAll('.answer-btn');
    buttons.forEach(button => button.disabled = true);

    const isCorrect = selectedAnswer === question.correctAnswer;

    questionHistory.push({
        questionNumber: currentQuestionIndex + 1,
        question: question.question,
        yourAnswer: selectedAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect: isCorrect
    });

    if (isCorrect) {
        selectedButton.classList.add('correct');
        score++;
        scoreElement.textContent = score;
    } else {
        selectedButton.classList.add('wrong');
        buttons.forEach(button => {
            if (button.innerHTML === question.correctAnswer) {
                button.classList.add('correct');
            }
        });
    }

    setTimeout(() => {
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            showQuestion();
        } else {
            endGame();
        }
    }, 1500);
}

function endGame() {
    gameScreen.classList.add('hidden');
    resultScreen.classList.remove('hidden');
    finalScoreElement.textContent = score;
    correctAnswersElement.textContent = score;
}

function shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5);
}

async function loadLanguages() {
    try {
        const response = await fetch('/get_languages');
        const languages = await response.json();
        const select = document.getElementById('language-select');
        select.innerHTML = '';

        Object.entries(languages).forEach(([code, name]) => {
            const option = document.createElement('option');
            option.value = code;
            option.textContent = name;
            if (code === 'en') {
                option.selected = true;
            }
            select.appendChild(option);
        });
        
        // Set the selected language variable
        selectedLanguage = 'en';
    } catch (error) {
        console.error('Error loading languages:', error);
    }
}

document.addEventListener('DOMContentLoaded', loadLanguages);

document.getElementById('language-select').addEventListener('change', (e) => {
    selectedLanguage = e.target.value;
});
