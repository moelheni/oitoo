
loop = function () {
    if (document.body.clientWidth < 400) {
        document.getElementById("input").style.display = "none";
    } else {

        document.getElementById("input").style.display = "block";
    }
}
setInterval(loop, 10);