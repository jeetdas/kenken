let focusedCellId: string | null = null;

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
    // WIP
    const tar = event.target as HTMLInputElement;
    console.log('Validate: ' + tar.checked);
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