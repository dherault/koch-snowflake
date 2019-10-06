const canvas = document.getElementsByTagName('canvas')[0]
const _ = canvas.getContext('2d')

let width = canvas.width = window.innerWidth
let height = canvas.height = window.innerHeight
let xMouse = 0
let yMouse = 0
let xWindow = 0
let yWindow = 0

const piByThree = Math.PI / 3
const xStart = canvas.width / 3
const length = canvas.width / 3
const sideLength = length / (2 * (1 + Math.cos(piByThree)))
const heightLength = length * Math.cos(piByThree) + sideLength * Math.cos(piByThree)
const yStart = (canvas.height - heightLength) / 2

function scaleX(x) {
  return (x - xWindow) * canvas.width / width
}

function scaleY(y) {
  return (y - yWindow) * canvas.height / height
}

function triangle(_, n, x, y, l, a = 0) {
  const s = l / (2 * (1 + Math.cos(piByThree)))

  const x1 = x + s * Math.cos(a)
  const y1 = y + s * Math.sin(a)
  const x2 = x1 + s * Math.cos(a - piByThree)
  const y2 = y1 + s * Math.sin(a - piByThree)
  const x3 = x2 + s * Math.cos(a + piByThree)
  const y3 = y2 + s * Math.sin(a + piByThree)
  const x4 = x + l * Math.cos(a)
  const y4 = y + l * Math.sin(a)

  if (
    Math.min(x, x2, x4) > xWindow + width
    || Math.max(x, x2, x4) < xWindow
    || Math.min(y, y2, y4) > yWindow + height
    || Math.max(y, y2, y4) < yWindow
  ) {
    return
  }

  if (n !== 0) {
    triangle(_, n - 1, x, y, s, a)
    triangle(_, n - 1, x1, y1, s, a - piByThree)
    triangle(_, n - 1, x2, y2, s, a + piByThree)
    triangle(_, n - 1, x3, y3, s, a)

    return
  }

  _.moveTo(scaleX(x), scaleY(y))
  _.lineTo(scaleX(x1), scaleY(y1))
  _.lineTo(scaleX(x2), scaleY(y2))
  _.lineTo(scaleX(x3), scaleY(y3))
  _.lineTo(scaleX(x4), scaleY(y4))
}

function draw() {
  const depth = Math.round(4 + 0.9 * Math.log(canvas.width / width))

  _.clearRect(0, 0, canvas.width, canvas.height)
  _.beginPath()
  _.moveTo(xStart, yStart)
  triangle(_, depth, xStart, yStart, length)
  triangle(_, depth, canvas.width / 2, yStart + length * Math.sin(piByThree), length, -2 * piByThree)
  triangle(_, depth, xStart + length, yStart, length, -4 * piByThree)
  _.closePath()
  _.stroke()
}

document.addEventListener('mousemove', event => {
  xMouse = event.clientX * width / canvas.width + xWindow
  yMouse = event.clientY * height / canvas.height + yWindow
  draw()
})

canvas.addEventListener('wheel', event => {
  event.preventDefault()

  const zoom = 1 + event.deltaY * 0.0006
  width = width * zoom
  height = height * zoom
  xWindow = xMouse - (xMouse - xWindow) * zoom
  yWindow = yMouse - (yMouse - yWindow) * zoom

  width = Math.max(0, Math.min(canvas.width, width))
  height = Math.max(0, Math.min(canvas.height, height))
  xWindow = Math.max(0, Math.min(canvas.width - width, xWindow))
  yWindow = Math.max(0, Math.min(canvas.height - height, yWindow))

  draw()
})

window.addEventListener('load', draw)
