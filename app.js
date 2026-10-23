const questions = [
  {
    kicker: "permission prompt",
    prompt: "mallow maps asks to use your location. Which setting is the safer place to start?",
    answers: [
      "allow all the time, so the app can always keep my route up to date.",
      "allow only while using the app, and check whether approximate location is enough.",
      "turn on every location option now; i can figure out the details later..."
    ],
    correct: 1,
    rightTitle: "good call: share less by default.",
    rightCopy: "navigation usually needs your location while you’re using it—not around the clock. approximate location may be enough for a nearby search. check what the app actually needs and revisit permissions later.",
    wrongTitle: "pause and ask what the app needs.",
    wrongCopy: "always-on or overly precise access can create a longer, more detailed trail than a single trip requires. start with the narrowest permission that still lets the feature work."
  },
  {
    kicker: "data detective",
    prompt: "what could someone infer from a navigation app that stores a person’s location over time?",
    answers: [
      "only the street they are standing on right now.",
      "their repeated places and routines, such as home, school, work, or regular visits.",
      "nothing useful unless the app also records their messages."
    ],
    correct: 1,
    rightTitle: "exactly!! patterns can be revealing!!",
    rightCopy: "a sequence of time-stamped locations can point to recurring places and routines. a location trail can be sensitive even when it contains no message text or name.",
    wrongTitle: "think beyond one pin on a map.",
    wrongCopy: "a single point is only a snapshot. repeated location points, especially with timestamps, can form a pattern that reveals routines and sensitive visits."
  },
  {
    kicker: "privacy tune-up",
    prompt: "you’re finished navigating. which action is the most useful privacy check?",
    answers: [
      "review location permissions, limit background access, and check whether location history can be deleted.",
      "post a screenshot of the full route so friends know where you went.",
      "assume uninstalling the app automatically erases every copy of its data."
    ],
    correct: 0,
    rightTitle: "a strong, practical check.",
    rightCopy: "review permissions and the app’s history and deletion controls. Settings and policies differ, so check the specific app. Avoid posting a route that exposes places or routines you want private.",
    wrongTitle: "a small check beats an assumption.",
    wrongCopy: "public route sharing can expose sensitive places, and uninstalling does not necessarily delete information already stored by a service. review permissions and the app’s retention and deletion options."
  }
];

const answerList = document.querySelector("#answer-list");
const questionKicker = document.querySelector("#question-kicker");
const questionHeading = document.querySelector("#question");
const progressLabel = document.querySelector("#progress-label");
const progressBar = document.querySelector(".progress-track");
const progressFill = document.querySelector(".progress-fill");
const feedback = document.querySelector("#feedback");
const feedbackTitle = document.querySelector("#feedback-title");
const feedbackCopy = document.querySelector("#feedback-copy");
const nextButton = document.querySelector("#next-button");
const resetButton = document.querySelector("#reset-button");
const quizFooterMessage = document.querySelector(".quiz-footer > span");

let currentQuestion = 0;
let score = 0;

function renderQuestion() {
  const item = questions[currentQuestion];
  questionKicker.textContent = item.kicker;
  questionHeading.textContent = item.prompt;
  progressLabel.textContent = `decision ${currentQuestion + 1} of ${questions.length}`;
  progressFill.style.width = `${(currentQuestion / questions.length) * 100}%`;
  progressBar.setAttribute("aria-valuenow", String(currentQuestion));
  feedback.hidden = true;
  answerList.replaceChildren();

  item.answers.forEach((answer, index) => {
    const button = document.createElement("button");
    const letter = document.createElement("span");
    letter.className = "answer-letter";
    letter.setAttribute("aria-hidden", "true");
    letter.textContent = String.fromCharCode(65 + index);
    button.type = "button";
    button.className = "answer-button";
    button.append(letter, document.createTextNode(answer));
    button.addEventListener("click", () => chooseAnswer(index));
    answerList.append(button);
  });
}

function chooseAnswer(selectedIndex) {
  const item = questions[currentQuestion];
  const isCorrect = selectedIndex === item.correct;
  const buttons = answerList.querySelectorAll(".answer-button");

  buttons.forEach((button, index) => {
    button.disabled = true;
    if (index === item.correct) button.classList.add("is-correct");
    if (index === selectedIndex && !isCorrect) button.classList.add("is-incorrect");
  });

  if (isCorrect) score += 1;
  feedbackTitle.textContent = isCorrect ? item.rightTitle : item.wrongTitle;
  feedbackCopy.textContent = isCorrect ? item.rightCopy : item.wrongCopy;
  feedback.hidden = false;
  nextButton.textContent = currentQuestion === questions.length - 1 ? "See your field note →" : "Next decision →";
  nextButton.focus();
}

function showSummary() {
  questionKicker.textContent = "case closed";
  questionHeading.textContent = `you spotted ${score} of ${questions.length} privacy clues!!`;
  answerList.replaceChildren();
  feedbackTitle.textContent = score === questions.length ? "a thoughtful privacy advocate." : "every choice is a chance to learn.";
  feedbackCopy.textContent = "remember: location can reveal routines; start with the least access an app needs; and check the app’s own controls. laws vary by place and may cover only specific people, services, or data.";
  nextButton.hidden = true;
  nextButton.hidden = true;
  feedback.hidden = false;
  progressLabel.textContent = "case complete";
  progressFill.style.width = "100%";
  progressBar.setAttribute("aria-valuenow", String(questions.length));
  quizFooterMessage.textContent = "you can revisit the case whenever you like ♡";
  resetButton.hidden = false;
  questionHeading.focus({ preventScroll: true });
}

nextButton.addEventListener("click", () => {
  if (currentQuestion === questions.length - 1) {
    showSummary();
    return;
  }
  currentQuestion += 1;
  renderQuestion();
  questionHeading.focus({ preventScroll: true });
});

resetButton.addEventListener("click", () => {
  currentQuestion = 0;
  score = 0;
  nextButton.hidden = false;
  resetButton.hidden = true;
  quizFooterMessage.innerHTML = '<span aria-hidden="true">♡</span> think it through; there’s no trick';
  renderQuestion();
  questionHeading.focus({ preventScroll: true });
  document.querySelector("#case").scrollIntoView({ behavior: "smooth", block: "start" });
});

renderQuestion();
