import "./App.css";
import DigitButton from "./DigitButton";
import OperationButton from "./OperationButton";
import { useReducer } from "react";

// actions we can take using the calculator
export const ACTIONS = {
	ADD_DIGIT: "add-digit",
	CHOOSE_OPERATION: "choose-operation",
	CLEAR: "clear",
	DELETE_DIGIT: "delete-digit",
	EVALUATE: "evaluate",
};

// reducer(state, {"action" broken into type & payload})
// shows there will be different types of actions that pass parameters to payload
function reducer(state, { type, payload }) {
	switch (type) {
		case ACTIONS.ADD_DIGIT:
			if (state.overwrite) {
				return {
					...state,
					currOperand: payload.digit,
					overwrite: false,
				};
			}
			//no changes if putting a bunch of 0s at start
			if (payload.digit === "0" && state.currOperand === "0") return state;
			// no change or error if putting . as first
			if (payload.digit === "." && state.currOperand == null) {
				return state;
			}
			// no change if current includes at least 1 .
			if (payload.digit === "." && state.currOperand.includes("."))
				return state;
			return {
				// displays digit in output
				...state,
				currOperand: `${state.currOperand || ""}${payload.digit}`,
			};
		case ACTIONS.CHOOSE_OPERATION:
			if (state.currOperand == null && state.prevOperand == null) {
				return state;
			}
			if (state.currOperand == null) {
				return {
					...state,
					operation: payload.operation,
				};
			}
			if (state.prevOperand == null) {
				return {
					...state,
					operation: payload.operation,
					prevOperand: state.currOperand,
					currOperand: null,
				};
			}
			return {
				...state,
				prevOperand: evaluate(state),
				operation: payload.operation,
				currOperand: null,
			};
		case ACTIONS.CLEAR:
			// returns 0 as a placeholder and clears prev and operation
			return {
				...state,
				currOperand: "0",
				prevOperand: null,
				operation: null,
			};
		case ACTIONS.DELETE_DIGIT:
			if (state.overwrite) {
				return {
					...state,
					overwrite: false,
					currOperand: null,
				};
			}
			if (state.currOperand == null) return state;
			if (state.currOperand.length === 1) {
				return { ...state, currOperand: null };
			}
			return {
				...state,
				currOperand: state.currOperand.slice(0, -1),
			};
		case ACTIONS.EVALUATE:
			if (
				state.operation == null ||
				state.currOperand == null ||
				state.prevOperand == null
			) {
				return state;
			}
			return {
				...state,
				overwrite: true,
				prevOperand: null,
				operation: null,
				currOperand: evaluate(state),
			};
	}
}

function evaluate({ currOperand, prevOperand, operation }) {
	const prev = parseFloat(prevOperand);
	const curr = parseFloat(currOperand);
	if (isNaN(prev) || isNaN(curr)) return "";
	let computation = "";
	switch (operation) {
		case "+":
			computation = prev + curr;
			break;
		case "-":
			computation = prev - curr;
			break;
		case "*":
			computation = prev * curr;
			break;
		case "÷":
			computation = prev / curr;
			break;
	}
	return computation.toString();
}

const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
	maximumFractionDigits: 0,
});

function formatOperand(operand) {
	if (operand == null) return;
	const [integer, decimal] = operand.split(".");
	if (decimal == null) return INTEGER_FORMATTER.format(integer);
	return `${INTEGER_FORMATTER.format(integer)}.${decimal}`;
}

function App() {
	// const [{state variables}, dispatch] =
	// useReducer(function, default state which is empty object)
	const [{ currOperand, prevOperand, operation }, dispatch] = useReducer(
		reducer,
		{}
	);

	return (
		<div className="calculator-grid">
			<div className="output">
				<div className="prev-operand">
					{formatOperand(prevOperand)} {operation}
				</div>
				<div className="curr-operand">{formatOperand(currOperand)}</div>
			</div>
			<button
				className="span-two"
				onClick={() => dispatch({ type: ACTIONS.CLEAR })}
			>
				AC
			</button>
			<button onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}>
				DEL
			</button>
			<OperationButton operation="÷" dispatch={dispatch} />
			<DigitButton digit="1" dispatch={dispatch} />
			<DigitButton digit="2" dispatch={dispatch} />
			<DigitButton digit="3" dispatch={dispatch} />
			<OperationButton operation="*" dispatch={dispatch} />
			<DigitButton digit="4" dispatch={dispatch} />
			<DigitButton digit="5" dispatch={dispatch} />
			<DigitButton digit="6" dispatch={dispatch} />
			<OperationButton operation="+" dispatch={dispatch} />
			<DigitButton digit="7" dispatch={dispatch} />
			<DigitButton digit="8" dispatch={dispatch} />
			<DigitButton digit="9" dispatch={dispatch} />
			<OperationButton operation="-" dispatch={dispatch} />
			<DigitButton digit="." dispatch={dispatch} />
			<DigitButton digit="0" dispatch={dispatch} />
			<button
				className="span-two"
				onClick={() => dispatch({ type: ACTIONS.EVALUATE })}
			>
				=
			</button>
		</div>
	);
}

export default App;
