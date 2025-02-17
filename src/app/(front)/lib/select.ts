export let selectedSquares: any[] = [];

export function getSelectedSquares() {
  return selectedSquares;
}

export function updateSelectedSquares(newSelection: any[]) {
  selectedSquares = [...newSelection];
}
