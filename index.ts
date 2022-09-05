const ROTATION_SPEED = 0.1 * Math.PI / 180

const canvas = document.getElementById("circle_border") as HTMLCanvasElement
const width = canvas.width
const center = width/2
const bctx = (document.getElementById("circle_border") as HTMLCanvasElement).getContext("2d") as CanvasRenderingContext2D
const fctx = (document.getElementById("circle_fill") as HTMLCanvasElement).getContext("2d") as CanvasRenderingContext2D
const fbctx = (document.getElementById("circle_fborder") as HTMLCanvasElement).getContext("2d") as CanvasRenderingContext2D
const sctx = (document.getElementById("circle_sphere") as HTMLCanvasElement).getContext("2d") as CanvasRenderingContext2D

const bslider = document.getElementById("radius_border") as HTMLInputElement
const fslider = document.getElementById("radius_fill") as HTMLInputElement
const fbslider = document.getElementById("radius_fborder") as HTMLInputElement
const sslider = document.getElementById("radius_sphere") as HTMLInputElement

let sphereRenderer = NaN

function renderBorder(r: number) {
    bctx.clearRect(0, 0, width, width)
    bctx.fillStyle = "red"
    let init = center - r

    for (let y = init; y <= init + r * 2; y++)
        for (let x = init; x <= init + r * 2; x++)
            if (Math.round(Math.sqrt((center-x) ** 2 + (center-y) ** 2)) == r)
                bctx.fillRect(x, y, 1, 1)
}

function renderFill(r: number) {
    fctx.clearRect(0, 0, width, width)
    fctx.fillStyle = "red"
    let init = center - r

    for (let y = init; y <= init + r * 2; y++)
        for (let x = init; x <= init + r * 2; x++)
            if ((center-x) ** 2 + (center-y) ** 2 <= r**2)
                fctx.fillRect(x, y, 1, 1)
}

function prepareFastBorder(r: number): Array<Array<number>> {
    let res: Array<Array<number>> = []
    for (let x = 0; x <= r; x++)
        res.push([x, Math.sqrt(r**2 - x**2)])
    return res
}

function renderFBorder(r: number) {
    fbctx.clearRect(0, 0, width, width)
    fbctx.fillStyle = "red"

    let coords = prepareFastBorder(r)
    for (let c = 0; c < coords.length; c++) {
        fbctx.fillRect(center+coords[c][0], center+coords[c][1], 1, 1)
        fbctx.fillRect(center-coords[c][0], center-coords[c][1], 1, 1)
        fbctx.fillRect(center-coords[c][0], center+coords[c][1], 1, 1)
        fbctx.fillRect(center+coords[c][0], center-coords[c][1], 1, 1)
        fbctx.fillRect(center+coords[c][1], center+coords[c][0], 1, 1)
        fbctx.fillRect(center-coords[c][1], center-coords[c][0], 1, 1)
        fbctx.fillRect(center-coords[c][1], center+coords[c][0], 1, 1)
        fbctx.fillRect(center+coords[c][1], center-coords[c][0], 1, 1)
    }
}

function getSphereDots(r: number): Array<Array<number>> {
    let res: Array<Array<number>> = []
    for (let x = 0; x < r;x++)
        for (let y = 0; y < r;y++) {
            let z = Math.sqrt(r**2 - x**2 - y**2)
            res.push([x, y, z], [x, y, -z])
        }
    return res
}

function draw3DPoints(dots: Array<Array<number>>) {
    for (let d = 0; d < dots.length; d++) {
        if (isNaN(dots[d][2])) {console.log(dots[d]); continue}
        sctx.fillRect(center+(dots[d][0])*10-1, center+(dots[d][1])*10-1, 3, 3)
        sctx.fillRect(center-(dots[d][0])*10-1, center-(dots[d][1])*10-1, 3, 3)
        sctx.fillRect(center-(dots[d][0])*10-1, center+(dots[d][1])*10-1, 3, 3)
        sctx.fillRect(center+(dots[d][0])*10-1, center-(dots[d][1])*10-1, 3, 3)
    }
}

function rotateAndRenderSphere(dots: Array<Array<number>>) {
    for (let d = 0; d < dots.length; d++)
        dots[d] = [
            dots[d][0] * Math.cos(ROTATION_SPEED) - dots[d][2] * Math.sin(ROTATION_SPEED),
            dots[d][1], 
            dots[d][0] * Math.sin(ROTATION_SPEED) + dots[d][2] * Math.cos(ROTATION_SPEED)
        ]

    sctx.clearRect(0, 0, width, width)
    draw3DPoints(dots)
}

function renderSphere(r: number) {
    sctx.clearRect(0, 0, width, width)
    sctx.fillStyle = "red"

    let dots = getSphereDots(r)
    draw3DPoints(dots)

    if (sphereRenderer != NaN) clearInterval(sphereRenderer)
    sphereRenderer = setInterval(rotateAndRenderSphere, 1000/60, dots)
}


bslider.addEventListener("change", (e) => renderBorder(Number(bslider.value)))
fslider.addEventListener("change", (e) => renderFill(Number(fslider.value)))
fbslider.addEventListener("change", (e) => renderFBorder(Number(fbslider.value)))
sslider.addEventListener("change", (e) => renderSphere(Number(sslider.value)))

renderBorder(50)
renderFill(50)
renderFBorder(50)
renderSphere(9)