document.addEventListener("DOMContentLoaded", () => {
    const option1 = document.getElementById("option1");
    const option2 = document.getElementById("option2");
    const nextBtn = document.getElementById("next-btn");
    const container = document.querySelector(".container");

    let votes = {}; // Store votes for each question
    let previousQuestions = new Set(); // Prevent instant repeats

    const questionTemplates = [
        "Would you rather {A} or {B}?",
        "Which would you prefer: {A} or {B}?",
        "If you had to pick one: {A} or {B}?",
        "Would you choose {A} or {B}?",
        "What's better: {A} or {B}?"
    ];

    const choicesA = [
        "have unlimited money",
        "be able to fly",
        "be invisible",
        "live forever",
        "have perfect memory",
        "time travel to the past",
        "speak every language",
        "be a famous actor",
        "be a superhero",
        "never feel pain"
    ];

    const choicesB = [
        "have unlimited knowledge",
        "read minds",
        "teleport anywhere",
        "be 10x stronger",
        "never need sleep",
        "time travel to the future",
        "play every instrument",
        "be a billionaire",
        "be the smartest person in the world",
        "never feel sadness"
    ];

    let currentQuestion = null;

    function getRandomElement(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    function generateUniqueQuestion() {
        let question, optionA, optionB;
        do {
            const template = getRandomElement(questionTemplates);
            optionA = getRandomElement(choicesA);
            optionB = getRandomElement(choicesB);

            question = template.replace("{A}", optionA).replace("{B}", optionB);

            // Ensure both options are valid (not empty)
        } while (previousQuestions.has(question) || !optionA || !optionB);

        previousQuestions.add(question);
        if (previousQuestions.size > 50) {
            previousQuestions.clear(); // Reset memory after 50 questions
        }

        return { option1: optionA, option2: optionB };
    }

    function loadQuestion() {
        container.style.opacity = "0"; // Start fade-out animation

        setTimeout(() => {
            currentQuestion = generateUniqueQuestion();
            option1.textContent = currentQuestion.option1;
            option2.textContent = currentQuestion.option2;

            // Reset styles and button states
            option1.disabled = false;
            option2.disabled = false;
            option1.style.background = "#ff6b6b";
            option2.style.background = "#ff6b6b";

            nextBtn.classList.remove("active");
            nextBtn.style.cursor = "not-allowed";
            nextBtn.disabled = true;

            // Remove any old results
            document.querySelectorAll(".results").forEach(el => el.remove());

            container.style.opacity = "1"; // Fade-in animation
        }, 300); // Wait for fade-out before loading new question
    }

    function handleVote(option) {
        // Initialize vote count if it doesn't exist
        if (!votes[currentQuestion.option1]) {
            votes[currentQuestion.option1] = { option1: 0, option2: 0 };
        }

        // Register the vote
        if (option === 1) {
            votes[currentQuestion.option1].option1++;
            option1.style.background = "#4CAF50";
        } else {
            votes[currentQuestion.option1].option2++;
            option2.style.background = "#4CAF50";
        }

        // Disable buttons after voting
        option1.disabled = true;
        option2.disabled = true;

        // Calculate and show vote percentages
        const totalVotes = votes[currentQuestion.option1].option1 + votes[currentQuestion.option1].option2;
        const percent1 = ((votes[currentQuestion.option1].option1 / totalVotes) * 100).toFixed(1);
        const percent2 = ((votes[currentQuestion.option1].option2 / totalVotes) * 100).toFixed(1);

        // Create result elements
        const result1 = document.createElement("div");
        result1.className = "results";
        result1.textContent = `${percent1}% chose this`;

        const result2 = document.createElement("div");
        result2.className = "results";
        result2.textContent = `${percent2}% chose this`;

        option1.parentNode.insertBefore(result1, option1.nextSibling);
        option2.parentNode.insertBefore(result2, option2.nextSibling);

        // Enable the "Next Question" button
        nextBtn.classList.add("active");
        nextBtn.style.cursor = "pointer";
        nextBtn.disabled = false;
    }

    option1.addEventListener("click", () => handleVote(1));
    option2.addEventListener("click", () => handleVote(2));
    nextBtn.addEventListener("click", loadQuestion);

    loadQuestion(); // Load the first question on start
});
