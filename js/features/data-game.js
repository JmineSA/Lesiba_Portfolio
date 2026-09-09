// Interactive data-guessing mini-game.
/* ============================================================
   FEATURE: Interactive Data Game
============================================================ */
(function dataGame() {
  const container = document.querySelector('.game-container');
  if (!container) return;
  
  const questions = [
    {
      scenario: "A telecom company has 1 year of customer data. They want to predict which customers will churn next month. What's the best approach?",
      options: [
        "Simple average of past churn rates",
        "Build a Random Forest classifier",
        "Use linear regression",
        "No model needed"
      ],
      correct: 1,
      explanation: "✅ Random Forest is great for classification problems like churn prediction."
    },
    {
      scenario: "You have 10,000 patient records and want to predict wait times. Which model should you try?",
      options: [
        "Linear regression",
        "XGBoost with feature engineering",
        "Simple moving average",
        "K-means clustering"
      ],
      correct: 1,
      explanation: "✅ XGBoost handles non-linear relationships well."
    },
    {
      scenario: "A bank wants to detect fraudulent transactions in real-time. What's the best approach?",
      options: [
        "Batch processing with deep learning",
        "Random Forest with real-time scoring",
        "Manual review",
        "Simple rule-based system"
      ],
      correct: 1,
      explanation: "✅ Random Forest provides excellent speed and accuracy."
    },
    {
      scenario: "You need to forecast product demand for 6 months. Which method should you use?",
      options: [
        "Time series forecasting",
        "Random Forest regression",
        "K-means clustering",
        "Average of last 3 months"
      ],
      correct: 0,
      explanation: "✅ Time series methods are designed for forecasting."
    },
    {
      scenario: "A company has 100+ features. What's the first step to understand what drives churn?",
      options: [
        "Build a complex neural network",
        "EDA and feature importance with SHAP",
        "Use all features in a model",
        "Skip analysis"
      ],
      correct: 1,
      explanation: "✅ EDA and SHAP analysis help understand feature importance."
    },
    {
      scenario: "You're running an A/B test. How do you know if results are statistically significant?",
      options: [
        "Wait for 100 conversions",
        "Use hypothesis test with p-value < 0.05",
        "Just look at percentage difference",
        "Run for 1 day"
      ],
      correct: 1,
      explanation: "✅ Statistical significance testing ensures results aren't due to chance."
    },
    {
      scenario: "A retail store wants to increase sales. What's the best recommendation?",
      options: [
        "Association rule mining for recommendations",
        "Send same email to all",
        "Reduce all prices",
        "Focus only on new customers"
      ],
      correct: 0,
      explanation: "✅ Association rule mining finds patterns in purchase behavior."
    },
    {
      scenario: "Your model has 95% accuracy but fails on minority classes. What should you do?",
      options: [
        "Increase model complexity",
        "Use class weights or SMOTE",
        "Ignore minority classes",
        "Accept 95% accuracy"
      ],
      correct: 1,
      explanation: "✅ Addressing class imbalance ensures model performs well on all segments."
    },
    {
      scenario: "A healthcare provider wants to predict readmission risk. Most important consideration?",
      options: [
        "Model interpretability",
        "Maximum accuracy only",
        "Most complex model",
        "Ignore feature importance"
      ],
      correct: 0,
      explanation: "✅ In healthcare, interpretability is critical for clinical trust."
    },
    {
      scenario: "Your model performs well on training data but poorly on new data. Most likely issue?",
      options: [
        "Overfitting",
        "Underfitting",
        "Data leakage",
        "Not enough data"
      ],
      correct: 0,
      explanation: "✅ Overfitting occurs when a model learns training data too well but fails to generalize."
    }
  ];
  
  let currentQuestion = 0;
  let score = 0;
  let streak = 0;
  let answered = false;
  let shuffledQuestions = [];
  
  const scenarioEl = document.getElementById('gameScenario');
  const optionsEl = document.getElementById('gameOptions');
  const feedbackEl = document.getElementById('gameFeedback');
  const nextBtn = document.getElementById('gameNext');
  const restartBtn = document.getElementById('gameRestart');
  const scoreEl = document.getElementById('gameScore');
  const streakEl = document.getElementById('gameStreak');
  const roundEl = document.getElementById('gameRound');
  
  if (!scenarioEl || !optionsEl) return;
  
  function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }
  
  function loadQuestion() {
    if (currentQuestion >= shuffledQuestions.length) {
      endGame();
      return;
    }
    
    const q = shuffledQuestions[currentQuestion];
    scenarioEl.textContent = q.scenario;
    
    const shuffledOptions = shuffleArray([...q.options]);
    const correctIndex = shuffledOptions.indexOf(q.options[q.correct]);
    
    optionsEl.innerHTML = '';
    shuffledOptions.forEach((opt, idx) => {
      const btn = document.createElement('button');
      btn.className = 'game-option';
      btn.textContent = opt;
      btn.dataset.correct = (idx === correctIndex).toString();
      btn.addEventListener('click', () => handleAnswer(btn, idx === correctIndex));
      optionsEl.appendChild(btn);
    });
    
    feedbackEl.classList.remove('show', 'correct', 'wrong');
    feedbackEl.textContent = '';
    nextBtn.style.display = 'none';
    answered = false;
    roundEl.textContent = `${currentQuestion + 1}/${shuffledQuestions.length}`;
  }
  
  function handleAnswer(btn, isCorrect) {
    if (answered) return;
    answered = true;
    
    document.querySelectorAll('.game-option').forEach(b => b.disabled = true);
    
    document.querySelectorAll('.game-option').forEach(b => {
      if (b.dataset.correct === 'true') {
        b.classList.add('show-correct');
      }
    });
    
    if (isCorrect) {
      btn.classList.add('correct');
      score++;
      streak++;
      feedbackEl.className = 'game-feedback show correct';
      feedbackEl.textContent = shuffledQuestions[currentQuestion].explanation;
    } else {
      btn.classList.add('wrong');
      streak = 0;
      feedbackEl.className = 'game-feedback show wrong';
      feedbackEl.textContent = `❌ Oops! ${shuffledQuestions[currentQuestion].explanation}`;
    }
    
    scoreEl.textContent = score;
    streakEl.textContent = streak;
    
    if (currentQuestion < shuffledQuestions.length - 1) {
      nextBtn.style.display = 'inline-block';
      nextBtn.textContent = 'Next Question →';
    } else {
      nextBtn.style.display = 'inline-block';
      nextBtn.textContent = '🏆 See Results';
    }
  }
  
  function nextQuestion() {
    currentQuestion++;
    if (currentQuestion >= shuffledQuestions.length) {
      endGame();
    } else {
      loadQuestion();
    }
  }
  
  function endGame() {
    const total = shuffledQuestions.length;
    const pct = Math.round((score / total) * 100);
    
    let emoji = '😅';
    let message = 'Keep practicing!';
    if (pct >= 90) { emoji = '🏆'; message = 'Data Science Master!'; }
    else if (pct >= 70) { emoji = '🌟'; message = 'Great job!'; }
    else if (pct >= 50) { emoji = '💪'; message = 'Good effort!'; }
    
    scenarioEl.textContent = `${emoji} Game Over! You scored ${score}/${total} (${pct}%) - ${message}`;
    optionsEl.innerHTML = '';
    feedbackEl.classList.remove('show');
    nextBtn.style.display = 'none';
    restartBtn.style.display = 'inline-block';
  }
  
  function restartGame() {
    currentQuestion = 0;
    score = 0;
    streak = 0;
    shuffledQuestions = shuffleArray([...questions]).slice(0, 10);
    restartBtn.style.display = 'none';
    loadQuestion();
    scoreEl.textContent = score;
    streakEl.textContent = streak;
  }
  
  nextBtn.addEventListener('click', nextQuestion);
  restartBtn.addEventListener('click', restartGame);
  
  shuffledQuestions = shuffleArray([...questions]).slice(0, 10);
  loadQuestion();
  
  console.log('🎮 Data game ready!');
})();
