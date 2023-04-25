let canvas = document.querySelector('#particles')
let ctx = canvas.getContext('2d')


canvas.style.width = innerWidth + 'px'
canvas.style.height = innerHeight + 'px'

let w = innerWidth * 4
let h = innerHeight * 4

canvas.width = w
canvas.height = h

let colors = []
function generateColors() {
  for (let i = 0; i < 15; i++) {
    let r = Math.floor(Math.random() * 256)
    let g = Math.floor(Math.random() * 256)
    let b = Math.floor(Math.random() * 256)
    colors.push(`rgb(${r}, ${g}, ${b})`)
  }
}

function getRGB(color) {
  let regexp = /rgba?\((?<r>\d{1,3}), (?<g>\d{1,3}), (?<b>\d{1,3})\)/
  let { groups } = color.match(regexp)
  return groups
}
generateColors()


let particles = []
let properties = {
  bgColor: '#111',
  particleColor: colors[Math.floor(Math.random() * colors.length)],
  particleRadius: 3,
  particleCount: 70,
  particleMaxVelocity: .5,
  lineLength: 100,
  particleLife: 6,
  changeColorTime: 500,
}


class Particle {
  constructor() {
    this.x = Math.random() * w
    this.y = Math.random() * h
    this.velocityX = Math.random() * (properties.particleMaxVelocity * 2) - properties.particleMaxVelocity
    this.velocityY = Math.random() * (properties.particleMaxVelocity * 2) - properties.particleMaxVelocity
    this.life = Math.random() * properties.particleLife * 60
  }

  position() {
    if (this.x + this.velocityX > w && this.velocityX > 0 || this.x + this.velocityX < 0 && this.velocityX < 0) {
      this.velocityX *= -1
    }
    if (this.y + this.velocityY > h && this.velocityY > 0 || this.y + this.velocityY < 0 && this.velocityY < 0) {
      this.velocityY *= -1
    }
    this.x += this.velocityX
    this.y += this.velocityY
  }
  decreaseLife() {
    this.life--
    if (this.life === 0) {
      this.x = Math.random() * w
      this.y = Math.random() * h
      this.velocityX = Math.random() * (properties.particleMaxVelocity * 2) - properties.particleMaxVelocity
      this.velocityY = Math.random() * (properties.particleMaxVelocity * 2) - properties.particleMaxVelocity
      this.life = Math.random() * properties.particleLife * 60
    }
  }

  render() {
    ctx.beginPath()
    ctx.arc(this.x, this.y, properties.particleRadius, 0, Math.PI * 2)
    ctx.closePath()
    ctx.fillStyle = properties.particleColor
    ctx.fill()
  }
}
init()
function init() {
  for (let i = 0; i < properties.particleCount; i++) {
    particles.push(new Particle())
  }
  loop()
}
function reDrawBg() {
  ctx.fillStyle = properties.bgColor
  ctx.fillRect(0, 0, w, h)
}
function reDrawParticles() {
  for (p of particles) {
    p.position()
    p.render()
    p.decreaseLife()
  }
}
function drawLines() {
  let x1, y1, x2, y2, length, opacity;
  for (let p of particles) {
    for (q of particles) {
      x1 = p.x
      y1 = p.y
      x2 = q.x
      y2 = q.y

      length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
      if (length < properties.lineLength) {
        opacity = 1 - length / properties.lineLength
        ctx.lineWidth = '0.5'
        let { r, g, b } = getRGB(properties.particleColor)
        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`
        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.lineTo(x2, y2)
        ctx.closePath()
        ctx.stroke()
      }
    }
  }
}
function loop() {
  if (properties.changeColorTime < 0) {
    properties.changeColorTime = 500
    properties.particleColor = colors[Math.floor(Math.random() * colors.length)]
  }
  properties.changeColorTime--
  reDrawBg()
  reDrawParticles()
  drawLines()
  requestAnimationFrame(loop)
}

window.onresize = function () {
  canvas.style.width = innerWidth + 'px'
  canvas.style.height = innerHeight + 'px'
  w = innerWidth * 4
  h = innerHeight * 4

  canvas.width = w
  canvas.height = h


}