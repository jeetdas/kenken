let focusedCellId: string | null = null;
let validateCurrentGame: boolean = false;

function cellClick(event: Event) {
    const target = event.target as Element;
    let targetCell = target.id;
    
    if (targetCell && targetCell != null) {
        // clear out previous click info
        if (focusedCellId) {
            let previousSelected = document.getElementById(focusedCellId);
            previousSelected!.classList.remove('bg-yellow');
        }

        // store as focused cell
        focusedCellId = target.id;
        console.log(focusedCellId);
        target.classList.add('bg-yellow');
    }

    event.stopPropagation();
}

function inputClick(event: Event) {
    const target = event.target as HTMLInputElement;
    console.log(target.value);
    if (focusedCellId) {
        let inputOverlay = document.getElementById("input-overlay-" + focusedCellId);
        if (inputOverlay) {
            inputOverlay.textContent = target.value;
        }
    }

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

function validateInput(event: Event) {
    let correctCount = 0;
    let incorrectCount = 0;
    const tar = event.target as HTMLInputElement;
    validateCurrentGame = tar.checked;
    console.log('Validate: ' + tar.checked);
    if (validateCurrentGame) {
        let inputCells = document.querySelectorAll('[id^="input-overlay-"]');
        inputCells.forEach(inputCell => {
            const splitName = inputCell.id.split('-'); 
            let [row, col] = [splitName[2], splitName[3]];
            const solutionCell = document.getElementById(`${'solution-overlay-' + row + '-' + col}`);
            let solutionValue = solutionCell!.textContent;
            if (inputCell.textContent != "" && inputCell.textContent != null) {
                if (inputCell.textContent == solutionValue) {
                    correctCount++
                    // solutionCell!.style.backgroundColor = "#00FF00";
                }
                else {
                    incorrectCount++;
                    // solutionCell!.style.backgroundColor = "#FF0000";
                }
            }
        });
        console.log("Correct" + correctCount);
        console.log("Inorrect" + incorrectCount);
    }
}

document.onkeydown = function(event) {
    let isNum = !isNaN(parseInt(event.key));

    if (focusedCellId && isNum) {
        let inputOverlay = document.getElementById("input-overlay-" + focusedCellId);
        if (inputOverlay) {
            inputOverlay.textContent = event.key;
        }
    }
}