var canvas = document.getElementById("canvas"),
    ctx = canvas.getContext("2d");

ctx.fillRect(0, 0, 10, 10);
var clicked = false;
canvas.addEventListener("mousedown", function () { clicked = true });
document.addEventListener("mouseup", function () { clicked = false });
canvas.addEventListener("mousemove", function (e) {
    if (clicked) {
        ctx.fillRect(e.clientX - 565, 400 - (document.body.clientHeight - 80 - e.clientY), 10, 10)
    }
});
