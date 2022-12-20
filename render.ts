#!/usr/bin/env node
import * as fs from 'fs'
import * as sb from 'structure-bytes'
import { Cage, Op, Puzzle, puzzleType, solutionType } from './types'

const PUZZLE_FILE = 'puzzle.html'
//Symbols to display instead of op strings
const DISPLAY_OPS = new Map<Op, string>()
	.set('=', '')
	.set('*', '×')
	.set('/', '÷')

const { argv } = process
if (argv.length !== 3) throw new Error('Usage: ./render.js path/to/cagings.sbv')

const readPuzzle = new Promise<Puzzle>((resolve, reject) => {
	sb.readValue({
		type: puzzleType,
		inStream: fs.createReadStream(argv[2])
	}, (err, value) => {
		if (err) reject(err)
		else resolve(value!)
	})
})
const readSolutions = new Promise<number[]>((resolve, reject) => {
	sb.readValue({
		type: solutionType,
		inStream: fs.createReadStream('solution.sbv')
	}, (err, solution) => {
		if (err) reject(err)
		else resolve(solution!)
	})
})

const inputButtonStyling = `
.input-button {
    background-color: rgba(51, 51, 51, 0.05);
    border-radius: 20px;
    border-width: 0;
    color: #4646e1;
    cursor: pointer;
    display: inline-block;
    font-family: "Haas Grot Text R Web", "Helvetica Neue", Helvetica, Arial, sans-serif;
    font-size: 25px;
    font-weight: 500;
    line-height: 20px;
    list-style: none;
    margin: 0 15px 0 0;
    padding: 2rem 2rem;
    text-align: center;
    transition: all 200ms;
    vertical-align: baseline;
    white-space: nowrap;
    user-select: none;
    -webkit-user-select: none;
    touch-action: manipulation;
}
`

const gameToggleButtonStyling = `
.game-toggle-button {
    background-color: rgba(51, 51, 51, 0.05);
    border-radius: 20px;
    border-width: 0;
    color: #4646e1;
    cursor: pointer;
    display: inline-block;
    font-family: "Haas Grot Text R Web", "Helvetica Neue", Helvetica, Arial, sans-serif;
    font-size: 25px;
    font-weight: 500;
    line-height: 20px;
    list-style: none;
    margin: 0 15px 0 0;
    padding: 1.3rem 2rem;
    text-align: center;
    transition: all 200ms;
    vertical-align: baseline;
    white-space: nowrap;
    user-select: none;
    -webkit-user-select: none;
    touch-action: manipulation;
}
`

const cellInputStyling = `
.input-overlay {
    font-size: 60px;
    display: block;
    text-align: center;
}
`

const noteInputStyling = `
.note-overlay {
    bottom: 2px;
    position: absolute;
    left: 6px;
    font-size: 26px;
	color: #0047AB;
}
`

const gameToggleBoxStyling = `
.game-toggles-box {
	margin-bottom: 1rem;
}
`

Promise.all([readPuzzle, readSolutions])
	.then(([puzzle, solution]) => {
		const { max, cages } = puzzle!
		// We know which cell belongs to which cage here, color accordingly
		console.log(JSON.stringify(cages));
		const puzzleDisplaySizing = Math.floor(50/max); // Being used as rem
		const boxCage = new Map<string, Cage>() //map of '1 2' to cage
		const boxOps = new Map<string, string>() //map of '1 2' to cage operation to display
		for (const cage of cages) {
			const { op, val, boxes } = cage
			let topLeftBox: [number, number] = [Infinity, Infinity]
			for (const [r, c] of boxes) {
				boxCage.set([r, c].join(' '), cage)
				const [topLeftR, topLeftC] = topLeftBox
				if (r < topLeftR || (r === topLeftR && c < topLeftC)) topLeftBox = [r, c]
			}
			let displayOp = DISPLAY_OPS.get(op)
			if (displayOp === undefined) displayOp = op
			boxOps.set(topLeftBox.join(' '), val + displayOp)
		}
		const out: string[] = []
		out.push('<head><style>')
		out.push(
			'table{position:relative;top:10px;border-collapse:collapse; margin-left: auto; margin-right: auto;}',
			`td{position:relative;width:${puzzleDisplaySizing}rem;height:${puzzleDisplaySizing}rem;border:1.5px dashed black;font-family:Arial,Helvetica,sans-serif}`,
			'td.top{border-top:2px solid black}',
			'td.left{border-left:2px solid black}',
			'td.right{border-right:2px solid black}',
			'td.bottom{border-bottom:2px solid black}',
			'span.op{position:absolute;top:0;font-size:32px}',
			'.solution-span{display:none;position:absolute;top:5px;right:16px;font-size:28px}',
			'.show-solution { display: block }',
			'.bg-yellow { background-color: yellow }',
			'.input-box { padding-top: 100px; text-align: center; }',
			inputButtonStyling,
			cellInputStyling,
			noteInputStyling,
			gameToggleBoxStyling,
			gameToggleButtonStyling
		)
		out.push('</style><script type="text/javascript" src="puzzle_render.js"></script></head>')
		out.push('<body>')
		out.push('Show solutions<input type=checkbox onClick="showSolution(event)">')
		out.push('Validate input<input type=checkbox onClick="flipValidate(event)">');
		out.push('<table>')
		for (let r = 0; r < max; r++) {
			out.push('<tr>')
			for (let c = 0; c < max; c++) {
				const boxId = [r, c].join(' ')
				const thisCage = boxCage.get(boxId)
				const borders: string[] = []
				if (r === 0 || boxCage.get([r - 1, c].join(' ')) !== thisCage) borders.push('top')
				if (c === 0 || boxCage.get([r, c - 1].join(' ')) !== thisCage) borders.push('left')
				if (c === max - 1 || boxCage.get([r, c + 1].join(' ')) !== thisCage) borders.push('right')
				if (r === max - 1 || boxCage.get([r + 1, c].join(' ')) !== thisCage) borders.push('bottom')
				out.push('<td')
				out.push(' onclick="cellClick(event)"')
				out.push(' id="' + r + "-" + c + '"')
				if (borders.length) out.push(' class="' + borders.join(' ') + '"')
				out.push('>')
				const op = boxOps.get(boxId)
				if (op) out.push('<span class=op>', op, '</span>')
				out.push(`<span id=${"solution-overlay-" + r + "-" + c} class="solution-span">`, String(solution[r * max + c]), '</span>')
				out.push(`<span id=${"note-overlay-" + r + "-" + c} class="note-overlay">`, '</span>')
				out.push(`<span id=${"input-overlay-" + r + "-" + c} class="input-overlay"></span>`)
				out.push('</td>')
			}
			out.push('</tr>')
		}
		out.push('</table>');
		out.push('<div class="input-box">');
		out.push('<div class="game-toggles-box">');
		out.push(`<button onClick='inputClick(event)' class="game-toggle-button" type="button">Undo</button>`)
		out.push(`<button onClick='inputClick(event)' class="game-toggle-button" type="button">Erase</button>`)
		out.push(`<button onClick='flipNoteMode()' class="game-toggle-button" id="flip-note-button" type="button">Notes</button>`)
		out.push(`<button onClick='inputClick(event)' class="game-toggle-button" type="button">Hint</button>`)
		out.push('</div>');
		for (let numInput = 0; numInput < max; ++numInput) {
			out.push(`<button onClick='inputClick(event)' class="input-button" type="button" value="${numInput + 1}">${numInput + 1}</button>`)
		}
		out.push('</div>');
		out.push('</body>')
		fs.writeFile(PUZZLE_FILE, out.join(''), err => {
			if (err) throw err
		})
	})
.catch(console.error)