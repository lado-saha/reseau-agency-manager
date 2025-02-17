export let selectedSquares = [];

export function getSelectedSquares() {
  return selectedSquares;
}

export function updateSelectedSquares(newSelection) {
  selectedSquares = [...newSelection];
}
