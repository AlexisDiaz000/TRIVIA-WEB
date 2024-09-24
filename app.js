document.addEventListener('DOMContentLoaded', () => {
    const questionElement = document.getElementById('question');
    const answersElement = document.getElementById('answers');
    const nextQuestionButton = document.getElementById('next-question');
    const resultElement = document.getElementById('result');
    const containerElement = document.querySelector('.container');
    const correctCountElement = document.getElementById('correct-count');
    const incorrectCountElement = document.getElementById('incorrect-count');
    const correctSound = document.getElementById('correct-sound');
    const incorrectSound = document.getElementById('incorrect-sound');

    let correctAnswer = '';
    let correctCount = 0;
    let incorrectCount = 0;

    const getQuestion = async () => {
        try {
            const response = await fetch('https://opentdb.com/api.php?amount=1&type=multiple&lang=es');
            const data = await response.json();
            return data.results[0];
        } catch (error) {
            console.error('Error al obtener la pregunta:', error);
        }
    };

    const displayQuestion = (questionData) => {
        questionElement.innerHTML = decodeHTML(questionData.question);
        correctAnswer = questionData.correct_answer;

        const answers = [...questionData.incorrect_answers, questionData.correct_answer];
        shuffleArray(answers);

        answersElement.innerHTML = '';
        answers.forEach(answer => {
            const button = document.createElement('button');
            button.innerHTML = decodeHTML(answer);
            button.addEventListener('click', () => checkAnswer(button, answer));
            answersElement.appendChild(button);
        });

        resultElement.textContent = '';
        questionElement.classList.add('fade-in');
        answersElement.classList.add('fade-in');
        containerElement.classList.add('pulse');
    };

    const checkAnswer = (button, answer) => {
        const buttons = answersElement.getElementsByTagName('button');
        for (let btn of buttons) {
            btn.disabled = true;
        }

        if (answer === correctAnswer) {
            button.classList.add('correct');
            resultElement.textContent = '¡Correcto!';
            containerElement.classList.add('pulse');
            correctSound.play();
            correctCount++;
            correctCountElement.textContent = `Correctas: ${correctCount}`;
        } else {
            button.classList.add('incorrect');
            resultElement.textContent = 'Incorrecto. La respuesta correcta era: ' + decodeHTML(correctAnswer);
            containerElement.classList.add('shake');
            incorrectSound.play();
            incorrectCount++;
            incorrectCountElement.textContent = `Incorrectas: ${incorrectCount}`;
        }

        setTimeout(() => {
            containerElement.classList.remove('pulse', 'shake');
        }, 1000);
    };

    const loadNewQuestion = async () => {
        containerElement.classList.remove('pulse', 'shake');
        const question = await getQuestion();
        displayQuestion(question);
    };

    nextQuestionButton.addEventListener('click', loadNewQuestion);

    // Cargar la primera pregunta al iniciar la aplicación
    loadNewQuestion();
});

// Función para decodificar entidades HTML
function decodeHTML(html) {
    var txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
}

// Función para mezclar un array aleatoriamente
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}