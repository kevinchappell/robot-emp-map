import './styles.css'

const digitSumLimit = 23
const gridContainer = document.getElementById('grid')
const cellSizeInput = document.getElementById('cell-size')
const gridSizeInput = document.getElementById('grid-size')
const accessibleArea = document.getElementById('accessible-area')
const accessiblePoints = document.getElementById('accessible-points')
const grid = gridContainer.getContext('2d')

let cellSize = parseInt(cellSizeInput.value, 10)
let gridSize = parseInt(gridSizeInput.value, 10)

const sumDigits = (x, y) => `${x}${y}`.split('').reduce((acc, cur) => acc + parseInt(cur, 10), 0)

function setAccessible(accessiblePointCount) {
  accessiblePoints.innerText = `${accessiblePointCount}/${Math.pow(gridSize, 2)}`
  accessibleArea.innerText = `${accessiblePointCount * cellSize}/${Math.pow(gridSize * cellSize, 2)}`
}
function fillCell(x, y, fillColor) {
  grid.fillStyle = fillColor
  grid.fillRect(x * cellSize, y * cellSize, cellSize, cellSize)
}

function generateGrid(size) {
  let accessiblePointCount = 0
  const gridArray = [...Array(Math.round(size)).keys()]
  gridContainer.width = cellSize * size
  gridContainer.height = cellSize * size

  gridArray.forEach((x) => {
    gridArray.forEach((y) => {
      const isAccessible = sumDigits(x, y) <= digitSumLimit
      accessiblePointCount += +isAccessible

      const fillColor = isAccessible ? 'green' : 'red'
      fillCell(x, y, fillColor)
    })
  })

  setAccessible(accessiblePointCount)

  return grid
}

const updateCellSize = ({ target: { value } }) => {
  cellSize = parseInt(value, 10)
  generateGrid(gridSize)
}

const updateGridSize = ({ target: { value } }) => generateGrid(parseInt(value, 10))

cellSizeInput.addEventListener('change', updateCellSize, false)
gridSizeInput.addEventListener('change', updateGridSize, false)

generateGrid(gridSize)
