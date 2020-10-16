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
let isAccessibleCache
let points
let checkedCoords
let start
let end

const sumDigits = (x, y) => `${x}${y}`.split('').reduce((acc, cur) => acc + +cur, 0)
const checkIsAccessible = (x, y) => {
  const absX = Math.abs(x)
  const absY = Math.abs(y)
  const cacheKey = `${absX}${absY}`
  const isAccessible =
    isAccessibleCache[cacheKey] !== undefined ? isAccessibleCache[cacheKey] : sumDigits(absX, absY) <= digitSumLimit
  isAccessibleCache[cacheKey] = isAccessible

  return isAccessible
}

function setAccessible(accessiblePointCount) {
  accessiblePoints.innerText = `${accessiblePointCount}/${Math.pow(gridSize, 2)}`
  accessibleArea.innerText = `${accessiblePointCount * cellSize}/${Math.pow(gridSize * cellSize, 2)}`
}

function fillCell(x, y) {
  const coordString = `${x},${y}`
  if (checkedCoords.has(coordString) || x > gridSize || y > gridSize) {
    return
  }
  const isAccessible = checkIsAccessible(x, y)

  if (!isAccessible) {
    grid.fillStyle = isAccessible ? 'green' : 'red'
    grid.fillRect(x + (gridSize / 2) * cellSize, y + (gridSize / 2) * cellSize, cellSize, cellSize)
  }
  checkedCoords.add(coordString)

  return isAccessible
}

function generateGrid(size) {
  checkedCoords = new Set()
  isAccessibleCache = {}
  points = []
  start = -(gridSize / 2)
  end = gridSize / 2
  const gridArray = Array(end - start + 1)
    .fill()
    .map((_, i) => start + i)

  gridContainer.width = cellSize * size
  gridContainer.height = cellSize * size

  gridArray.forEach((x) => {
    const col = []
    gridArray.forEach((y) => {
      col.push(fillCell(x, y))
    })
    points.push(col)
  })

  checkedCoords = new Set()

  // countAccessible(end, end)

  return grid
}

const countAccessible = (x, y) => {
  const coordString = `${x},${y}`
  if (checkedCoords.has(coordString)) {
    return
  }
  if (x < 0 || y < 0 || x > points.length - 1 || y > points[x].length - 1) {
    return
  }
  checkedCoords.add(checkedCoords)

  grid.fillStyle = 'green'
  grid.fillRect(x * cellSize, y * cellSize, cellSize, cellSize)

  console.log(
    countAccessible(x + 1, y),
    countAccessible(x - 1, y),
    countAccessible(x, y + 1),
    countAccessible(x, y - 1)
  )
}

const updateCellSize = ({ target: { value } }) => {
  cellSize = parseInt(value, 10)
  generateGrid(gridSize)
}

const updateGridSize = ({ target: { value } }) => {
  gridSize = parseInt(value, 10)
  generateGrid(gridSize)
}

generateGrid(gridSize)

const getPixelPos = function (x, y) {
  return (y * gridContainer.width + x) * 4
}

const checkAccessibleArea = ({ offsetX, offsetY }) => {
  const dstImg = grid.getImageData(0, 0, gridContainer.width, gridContainer.height)
  const dstData = dstImg.data
  const startPos = getPixelPos(offsetX, offsetY)
  const startColor = {
    r: dstData[startPos],
    g: dstData[startPos + 1],
    b: dstData[startPos + 2],
    a: dstData[startPos + 3],
  }

  console.log(startColor)
}

cellSizeInput.addEventListener('change', updateCellSize, false)
gridSizeInput.addEventListener('change', updateGridSize, false)

gridContainer.addEventListener('click', checkAccessibleArea, false)
