document.addEventListener("DOMContentLoaded", () => {
    createSquares();

    let guessedWords = [[]];
    let availableSpace = 1;

    window.alert("INSTRUCTIONS: \n\nEach guess must be a valid, 5 letter word, IN ENGLISH. \nThe colour of the tiles tells you each letter's correctness: \nGreen means the letter is in the word and in the right spot. \nYellow means it is in the word but in the wrong spot. \nGrey means it is not in the word at all. \n\nHave fun!")

    let wordList = []
    let word = ""

    async function getRandomWord() {
        try {
        const response = await fetch('words.json'); 
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
    
        const words = await response.json();
        const randomWord = words[Math.floor(Math.random() * words.length)];
        console.log(`Word: ${randomWord}`);

        wordList = words;
        word = randomWord;
        } catch (error) {
        console.error('Error fetching or parsing JSON:', error);
        }
    }
  
    getRandomWord();
    
    let guessedWordCount = 0;

    const keys = document.querySelectorAll('.keyboard-row button');

    function getTileColor(letter, index){
        const isCorrectLetter = word.includes(letter);
        if (!isCorrectLetter) {
            return "rgb(58, 58, 60";
        }

        const letterInThatPosition = word.charAt(index)
        const isCorrectPosition = letter === letterInThatPosition

        if (isCorrectPosition){
            return "rgb(83, 141, 78)";
        }

        return "rgb(181, 159, 59)";
    }

    function handleSubmitWord() {
        const currentWordArr = getCurrentWordArr(availableSpace-1);
        if (currentWordArr.length !== 5) {
            window.alert("word must be 5 letters");
        }

        const currentWord = currentWordArr.join("");

        if (wordList.includes(currentWord)){
            const firstLetterId = availableSpace - 5;
            const interval = 200;
            currentWordArr.forEach((letter, index) => {
                setTimeout(() => {
                    const tileColor = getTileColor(letter, index);

                    const letterId = firstLetterId + index;
                    const letterEl = document.getElementById(letterId);
                    letterEl.classList.add("animate__flipInX");
                    letterEl.style = `background-color:${tileColor};border-color:${tileColor}`;
                }, interval * index);
            });
            guessedWordCount += 1

            if (currentWord === word) {
                window.alert("well done");
            }

            else if (guessedWords.length === 6) {
                window.alert(`you suck, the word was ${word}`);
            }
        
            guessedWords.push([]);;
        }

        else {
            window.alert("word does not exist") 
        }

        
    }

    function getCurrentWordArr(position) {
        //const numberOfGuessedWords = guessedWords.length;
        return guessedWords[Math.floor((position-1)/5)];
    }

    function updateGuessedWords(letter){
        const currentWordArr = getCurrentWordArr(availableSpace);

        if (currentWordArr && currentWordArr.length < 5){
            currentWordArr.push(letter);

            const availableSpaceEl = document.getElementById(availableSpace);
            availableSpace = availableSpace + 1;

            availableSpaceEl.textContent = letter;
        }
    }

    function createSquares(){
        const gameBoard = document.getElementById("board")

        for (let index = 0; index < 30; index++){
            let square = document.createElement("div");
            square.classList.add("animate__animated");
            square.classList.add("square");
            square.setAttribute("id", index + 1);
            gameBoard.appendChild(square);
        }
    }

    function handleDeleteLetter() {
        if ((availableSpace - 1) % 5 == 0) {
            return;
        }
        
        const currentWordArr = getCurrentWordArr(availableSpace-1)
        const removedLetter = currentWordArr.pop()

        guessedWords[guessedWords.length - 1] = currentWordArr

        const lastLetterEl = document.getElementById(String(availableSpace - 1))

        lastLetterEl.textContent = ''
        lastLetterEl.style = `background-color:black`;

        availableSpace = availableSpace - 1
    }

    for (let index = 0; index < keys.length; index ++){
        keys[index].onclick = ({target}) => {
            const letter = target.getAttribute("data-key");

            if (letter === 'enter') {
                handleSubmitWord()
                return;
            }

            if (letter == 'del') {
                handleDeleteLetter();
                return;
            }

            updateGuessedWords(letter);
        }
    }

    window.addEventListener('keydown', logKey);

    function logKey(e) {
        const bannedCodes = [ 'Space', 'BracketLeft', 'BracketRight', 'Slash', 'Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5', 'Digit6', 'Digit7', 'Digit8', 'Digit9', 'Digit0', 'Minus', 'Equal', 'Tab', 'Comma', 'Period', 'Backslash', 'Shift', 'CapsLock', ';', "'", 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12', 'Home', 'End', 'PageUp', 'PageDown', 'Backquote']

        const bannedKeys = ['Escape', 'Control', 'Alt', 'Meta', 'Shift']

        if (bannedKeys.includes(e.key) || bannedCodes.includes(e.code)) {
            return;
        }

        if (e.key == 'Enter') {
            handleSubmitWord()
            return;
        }

        if (e.key == 'Backspace') {
            handleDeleteLetter()
            return
        }

        else {
            updateGuessedWords(e.key)
        }
    };


});
