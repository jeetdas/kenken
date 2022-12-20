let focusedCellId: string | null = null; // Currently clicked on cell
let validateCurrentGame: boolean = false; // Validate game if this true
let noteMode: boolean = false; // Note mode defaults to false

const CORRECT_COLOR = "#00FF00";
const INCORRECT_COLOR = "#FF0000";

const BUTTON_HIGHLIGHT_COLOR = "rgb(51 51 51 / 31%)";
const BUTTON_BASE_COLOR = "rgba(51, 51, 51, 0.05)";

function cellClick(event: Event) {
    let target = event.target as Element;
    let targetCell = target.id;
    
    if (targetCell && targetCell != null) {
        // clear out previous click info
        if (focusedCellId) {
            let previousSelected = document.getElementById(focusedCellId);
            previousSelected!.classList.remove('bg-yellow');
        }

        // store as focused cell
        focusedCellId = targetCell;
        console.log(focusedCellId);
        target.classList.add('bg-yellow');
    }

    event.stopPropagation();
}

function inputClick(event: Event) {
    const target = event.target as HTMLInputElement;
    console.log(target.value);
    if (focusedCellId) {
        if (noteMode) {
            let noteOverlay = document.getElementById("note-overlay-" + focusedCellId);
            if (noteOverlay) {
                let currentHints = noteOverlay.textContent != "" ? noteOverlay.textContent!.split(',') : [];
                if (!currentHints.includes(target.value)) {
                    currentHints = currentHints.concat(target.value).sort();
                } else {
                    currentHints = currentHints.filter(e => e!== target.value).sort();
                }
                noteOverlay.textContent = currentHints!.join(',');
            }
        } else {
            let inputOverlay = document.getElementById("input-overlay-" + focusedCellId);
            if (inputOverlay) {
                inputOverlay.textContent = target.value;
            }
        }
    }

    validateInput();
    event.stopPropagation();
}

function showSolution(event: Event) {
    const checkBox = event.target as HTMLInputElement;
    let solutionSpans = Array.from(document.getElementsByClassName('solution-span'));
    solutionSpans.forEach(element => {
        if (checkBox.checked)
            element.classList.add('show-solution');
        else
            element.classList.remove('show-solution');
    });
}

function flipValidate(event: Event) {
    const tar = event.target as HTMLInputElement;
    validateCurrentGame = tar.checked;
    console.log('Validate: ' + validateCurrentGame);

    validateInput();
}

function flipNoteMode() {
    noteMode = !noteMode;
    if (noteMode)
        document.getElementById('flip-note-button')!.style.backgroundColor = BUTTON_HIGHLIGHT_COLOR;
    else
        document.getElementById('flip-note-button')!.style.backgroundColor = BUTTON_BASE_COLOR;
}

function validateInput() {
    let correctCount = 0;
    let incorrectCount = 0;
    if (validateCurrentGame) {
        let inputCells = document.querySelectorAll('[id^="input-overlay-"]');
        inputCells.forEach(inputCell => {
            const splitName = inputCell.id.split('-'); 
            let [row, col] = [splitName[2], splitName[3]];
            const solutionCell = document.getElementById(`${'solution-overlay-' + row + '-' + col}`);
            let solutionValue = solutionCell!.textContent;
            const cell = document.getElementById(row + '-' + col)!;
            if (inputCell.textContent != "" && inputCell.textContent != null) {
                if (inputCell.textContent == solutionValue) {
                    correctCount++
                    cell.style.backgroundColor = CORRECT_COLOR;
                }
                else {
                    incorrectCount++;
                    cell.style.backgroundColor = INCORRECT_COLOR;
                }
            }
        });
        console.log("Correct" + correctCount);
        console.log("Incorrect" + incorrectCount);
    }
}

document.onkeydown = function(event) {
    let isNum = !isNaN(parseInt(event.key));

    if (noteMode && isNum) {
        let noteOverlay = document.getElementById("note-overlay-" + focusedCellId);
        if (noteOverlay) {
            let currentHints = noteOverlay.textContent != "" ? noteOverlay.textContent!.split(',') : [];
            if (!currentHints.includes(event.key)) {
                currentHints = currentHints.concat(event.key).sort();
            } else {
                currentHints = currentHints.filter(e => e!== event.key).sort();
            }
            noteOverlay.textContent = currentHints!.join(',');
        }
    } else if (focusedCellId && isNum) {
        let inputOverlay = document.getElementById("input-overlay-" + focusedCellId);
        if (inputOverlay) {
            inputOverlay.textContent = event.key;
        }
    }

    validateInput();
}