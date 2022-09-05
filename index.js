var ROTATION_SPEED = 0.1 * Math.PI / 180;
var canvas = document.getElementById("circle_border");
var width = canvas.width;
var center = width / 2;
var bctx = document.getElementById("circle_border").getContext("2d");
var fctx = document.getElementById("circle_fill").getContext("2d");
var fbctx = document.getElementById("circle_fborder").getContext("2d");
var sctx = document.getElementById("circle_sphere").getContext("2d");
var bslider = document.getElementById("radius_border");
var fslider = document.getElementById("radius_fill");
var fbslider = document.getElementById("radius_fborder");
var sslider = document.getElementById("radius_sphere");
var sphereRenderer = NaN;
function renderBorder(r) {
    bctx.clearRect(0, 0, width, width);
    bctx.fillStyle = "red";
    var init = center - r;
    for (var y = init; y <= init + r * 2; y++)
        for (var x = init; x <= init + r * 2; x++)
            if (Math.round(Math.sqrt(Math.pow((center - x), 2) + Math.pow((center - y), 2))) == r)
                bctx.fillRect(x, y, 1, 1);
}
function renderFill(r) {
    fctx.clearRect(0, 0, width, width);
    fctx.fillStyle = "red";
    var init = center - r;
    for (var y = init; y <= init + r * 2; y++)
        for (var x = init; x <= init + r * 2; x++)
            if (Math.pow((center - x), 2) + Math.pow((center - y), 2) <= Math.pow(r, 2))
                fctx.fillRect(x, y, 1, 1);
}
function prepareFastBorder(r) {
    var res = [];
    for (var x = 0; x <= r; x++)
        res.push([x, Math.sqrt(Math.pow(r, 2) - Math.pow(x, 2))]);
    return res;
}
function renderFBorder(r) {
    fbctx.clearRect(0, 0, width, width);
    fbctx.fillStyle = "red";
    var coords = prepareFastBorder(r);
    for (var c = 0; c < coords.length; c++) {
        fbctx.fillRect(center + coords[c][0], center + coords[c][1], 1, 1);
        fbctx.fillRect(center - coords[c][0], center - coords[c][1], 1, 1);
        fbctx.fillRect(center - coords[c][0], center + coords[c][1], 1, 1);
        fbctx.fillRect(center + coords[c][0], center - coords[c][1], 1, 1);
        fbctx.fillRect(center + coords[c][1], center + coords[c][0], 1, 1);
        fbctx.fillRect(center - coords[c][1], center - coords[c][0], 1, 1);
        fbctx.fillRect(center - coords[c][1], center + coords[c][0], 1, 1);
        fbctx.fillRect(center + coords[c][1], center - coords[c][0], 1, 1);
    }
}
function getSphereDots(r) {
    var res = [];
    for (var x = 0; x < r; x++)
        for (var y = 0; y < r; y++) {
            var z = Math.sqrt(Math.pow(r, 2) - Math.pow(x, 2) - Math.pow(y, 2));
            res.push([x, y, z], [x, y, -z]);
        }
    return res;
}
function draw3DPoints(dots) {
    for (var d = 0; d < dots.length; d++) {
        if (isNaN(dots[d][2])) {
            console.log(dots[d]);
            continue;
        }
        sctx.fillRect(center + (dots[d][0]) * 10 - 1, center + (dots[d][1]) * 10 - 1, 3, 3);
        sctx.fillRect(center - (dots[d][0]) * 10 - 1, center - (dots[d][1]) * 10 - 1, 3, 3);
        sctx.fillRect(center - (dots[d][0]) * 10 - 1, center + (dots[d][1]) * 10 - 1, 3, 3);
        sctx.fillRect(center + (dots[d][0]) * 10 - 1, center - (dots[d][1]) * 10 - 1, 3, 3);
    }
}
function rotateAndRenderSphere(dots) {
    for (var d = 0; d < dots.length; d++)
        dots[d] = [
            dots[d][0] * Math.cos(ROTATION_SPEED) - dots[d][2] * Math.sin(ROTATION_SPEED),
            dots[d][1],
            dots[d][0] * Math.sin(ROTATION_SPEED) + dots[d][2] * Math.cos(ROTATION_SPEED)
        ];
    sctx.clearRect(0, 0, width, width);
    draw3DPoints(dots);
}
function renderSphere(r) {
    sctx.clearRect(0, 0, width, width);
    sctx.fillStyle = "red";
    var dots = getSphereDots(r);
    draw3DPoints(dots);
    if (sphereRenderer != NaN)
        clearInterval(sphereRenderer);
    sphereRenderer = setInterval(rotateAndRenderSphere, 1000 / 60, dots);
}
bslider.addEventListener("change", function (e) { return renderBorder(Number(bslider.value)); });
fslider.addEventListener("change", function (e) { return renderFill(Number(fslider.value)); });
fbslider.addEventListener("change", function (e) { return renderFBorder(Number(fbslider.value)); });
sslider.addEventListener("change", function (e) { return renderSphere(Number(sslider.value)); });
renderBorder(50);
renderFill(50);
renderFBorder(50);
renderSphere(9);
