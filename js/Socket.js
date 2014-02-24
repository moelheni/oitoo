var addToDo = function (name, date, disc) {
    var newToDo = "<div class='todo'>" +
                  "<span class='titleToDo'>" +
                  name +
                  "</span>" +
                  "<br />" +
                  "<span class='dateToDo'>" +
                  date +
                  "</span>" +
                  "<br />" +
                  "<p class='discToDo'>" +
                  disc +
                  "</div>";
    document.getElementById("timeLine").innerHTML += newToDo;
}

var closeS = null;
DorT = 0;
var canvas = document.getElementById("canvas"),
ctx = canvas.getContext("2d");
ctx.fillStyle = "#000000";



document.onkeyup = function (e) {
    if (e.keyCode == 13) {
        document.getElementById("Messages").style.display = "none";
    }
}

document.getElementById("CodeGroupe").onkeypress = function (e) {
    if (e.keyCode == 13) {
        document.getElementById("submit0").click();
    }
}


document.getElementById("TextToSend").onkeypress = function (e) {
    if (e.keyCode == 13) {
        document.getElementById("button").click();
    }
}

Socket = new WebSocket("ws://localhost:8080");
Socket.onerror = function () {
    console.log("erreur");
}
Socket.onopen = function () {
    console.log("hh");
}

groupe = null;
var c = [];
var messages = [];
var rank = -1;
var m = null;
var ti;
var connected = false;

document.getElementById("submit0").addEventListener("click", function () {
    console.log("hhhsss");
    groupe = document.getElementById("CodeGroupe").value;
    var grpD = {};
    grpD.type = -1;
    grpD.value = groupe;
    Socket.send(JSON.stringify(grpD));
});



document.getElementById("userchBtn").onclick = function () {
    if (document.getElementById("userch").selectedIndex > -1) {
    sid = document.getElementById("userch").selectedIndex;
    rank = document.getElementById("userch").options[sid].value;
    connected = true;
    var m = {};
    m.type = 22;
    m.groupe = document.getElementById("CodeGroupe").value;
    Socket.send(JSON.stringify(m));
    document.getElementById("first").style.display = "none";
}
}


document.getElementById("submit").addEventListener("click", function () {
    if (document.getElementById("username").value != "") {
            var m = {};
            m.type = 1;
            m.groupe = document.getElementById("CodeGroupe").value;
            m.nom = document.getElementById("username").value;
            Socket.send(JSON.stringify(m));
        
    } else {
        var bb = document.getElementById("username").style.border;
        document.getElementById("username").style.border = "solid 3px rgb(200,0,0)";
        document.getElementById("username").addEventListener("keyup", function () { document.getElementById("username").style.border = bb });
        document.getElementById("username").placeholder = "Write a username !!!";
    }
});

        Socket.onmessage = function (e) {
            console.log(e.data);
            m = JSON.parse(e.data);

            if (m.type == -1) {
                document.getElementById("submit").style.display = "block";
                document.getElementById("username").style.display = "block";
                document.getElementById("CodeGroupe").style.display = "none";
                document.getElementById("submit0").style.display = "none";
                document.getElementById("userch").style.display = "block";
                document.getElementById("userchBtn").style.display = "block";
                for(i=0;i<m.tab.length;i++){    
                    document.getElementById("userch").innerHTML += "<option value='" + m.tab[i].rank + "'>" + m.tab[i].nom + "</option>";
                }
            }

            if (m.type == 400 && m.value == 0) {
                document.getElementById("first").style.display = "none";
                connected = true;

            } else if (m.type == 400 && m.value == 1) {
                document.getElementById("cont").innerHTML = "<h2> Sorry, room is full </h2>";
            }


            if (m.groupe == groupe) {
                if (m.type == 100 && connected) {
                    for (i = 0; i < m.tab.length; i++) {
                        if(m.tab[i].groupe == groupe){
                            document.getElementById("List" + m.tab[i].sender).innerHTML = "<li>" + m.tab[i].valeu + "</li>" + document.getElementById("List" + m.tab[i].sender).innerHTML;
                        }
                    }
                } else if (m.type == 101 && connected) {
                    for (i = 0; i < m.tab.length; i++) {
                        if (m.tab[i].groupe == groupe) {
                            ctx.beginPath();
                            ctx.arc(m.tab[i].x, m.tab[i].y, m.tab[i].radius, 0, 2 * Math.PI, false);
                            ctx.fillStyle = m.tab[i].color;
                            ctx.fill();
                        }
                    }
                } else if (m.type == 102 && connected) {
                    for (i = 0; i < m.tab.length; i++) {
                        if (m.tab[i].groupe == groupe) {
                            document.getElementById("name" + m.tab[i].rank).innerText = m.tab[i].nom;
                        }
                    }
                } else if (m.type == 103 && connected) {
                    document.getElementById("textarea").innerHTML = m.text;
                    document.getElementById("load").style.opacity = 0;
                    setTimeout(function () { document.getElementById("load").style.display = "none" }, 2000);
                } else if (m.type == 301 && connected) {
                    for (i = 0; i < m.tab.length; i++) {
                        if (m.tab[i].groupe == groupe) {
                            addToDo(m.tab[i].title, m.tab[i].date, m.tab[i].disc);
                        }
                    }
                }
                else if ((m.type == 0) && connected) {
                    rank = m.rank;
                }
                else if ((m.type == 2) && connected) {
                    console.log("hhh");
                    c[m.rank] = m.nom;
                    document.getElementById("name" + m.rank).innerText = m.nom;
                }
                else if (m.type == 3 && connected) {
                    console.log(e.data);
                    document.getElementById("List" + m.sender).innerHTML = "<li>" + m.valeu + "</li>" + document.getElementById("List" + m.sender).innerHTML;
                    var newMessage = {};
                    newMessage.msg = m.valeu;
                    newMessage.sender = document.getElementById("name" + m.sender).innerText;
                    document.getElementById("Messages").innerHTML = "<b>" + newMessage.sender + "</b> : <i>" + newMessage.msg + "</i><br>" + document.getElementById("Messages").innerHTML;
                    messages.push = newMessage;
                }
                else if (m.type == 8 && connected) {
                    ctx.beginPath();
                    ctx.arc(m.x, m.y, m.radius, 0, 2 * Math.PI, false);
                    var savedcolor = ctx.fillStyle;
                    ctx.fillStyle = m.color;
                    ctx.fill();
                    ctx.fillStyle = savedcolor;
                }
                else if (m.type == 144 & connected) {
                    if (Date.now() - ti > 5000) {
                        document.getElementById("textarea").innerHTML = m.valeur;
                    }
                }
                else if (m.type == 300 && connected) {
                    addToDo(m.title, m.date, m.disc);
                }
                else if (m.type == 111 && connected) {
                    var newImage = new Image();
                    newImage.src = m.img;
                    newImage.onload = function () {
                        var w = newImage.width;
                        var h = newImage.height;
                        if (h > canvas.height) {
                            h = canvas.height;
                            w = newImage.width * (canvas.height / newImage.height);
                        }

                        else if (w > canvas.width) {
                            w = canvas.width;
                            h = h * (canvas.width / newImage.width);
                        }


                        ctx.drawImage(newImage, 0, 0, w, h);
                    }
                }
            }
         

        document.getElementById("button").onclick = function () {
            var newmsg = {};
            newmsg.type = 3;
            newmsg.groupe = groupe;
            newmsg.valeu = document.getElementById("TextToSend").value;
            newmsg.sender = rank;
            Socket.send(JSON.stringify(newmsg));
            document.getElementById("TextToSend").value = "";
        }

        var radius = 10;

        var clicked = false;
        canvas.addEventListener("mousedown", function () { clicked = true });
        document.addEventListener("mouseup", function () { clicked = false });

        canvas.addEventListener("mousemove", function (e) {            
            if (clicked) {
                var x = new Number();
                var y = new Number();
                x = e.clientX - canvas.offsetLeft;
                y = e.clientY - canvas.offsetTop;
                ctx.beginPath();
                ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
                ctx.fill();
                var imageCanvas = {};
                imageCanvas.type = 8;
                imageCanvas.x = x;
                imageCanvas.y = y;
                imageCanvas.radius = radius;
                imageCanvas.color = ctx.fillStyle;
                imageCanvas.groupe = groupe;
                Socket.send(JSON.stringify(imageCanvas));
            }
        });

        document.getElementById("clearCanvas").onclick = function () {
            if (DorT == 0) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                var imageCanvas = {};
                imageCanvas.type = 8;
                imageCanvas.x = 0;
                imageCanvas.y = 0;
                imageCanvas.radius = canvas.width * Math.PI;
                imageCanvas.color = "#ffffff";
                imageCanvas.groupe = groupe;
                Socket.send(JSON.stringify(imageCanvas));
            } else {
                document.getElementById("textarea").innerHTML = "";
                var newM = {};
                newM.type = 144;
                newM.groupe = groupe;
                newM.valeur = document.getElementById("textarea").innerHTML;
                Socket.send(JSON.stringify(newM));
            }
        }

        document.getElementById("r2").addEventListener("click", function () {
            radius = 5;
        });
        document.getElementById("r6").addEventListener("click", function () {
            radius = 10;
        });
        document.getElementById("r10").addEventListener("click", function () {
            radius = 15;
        });
        document.getElementById("r20").addEventListener("click", function () {
            radius = 20;
        });
        document.getElementById("clr1").addEventListener("click", function () {
            ctx.fillStyle = "#ff0000";
        });
        document.getElementById("clr2").addEventListener("click", function () {
            ctx.fillStyle = "#00ff00";
        });
        document.getElementById("clr3").addEventListener("click", function () {
            ctx.fillStyle = "#0000ff";
        });
        document.getElementById("clr4").addEventListener("click", function () {
            ctx.fillStyle = "#000000";
        });
        document.getElementById("clr5").addEventListener("click", function () {
            ctx.fillStyle = "#ffffff";
        });
        var test = true;
        document.getElementById("ShowHistory").addEventListener("click", function () {
            if (test) {
                test = false;
                document.getElementById("Messages").style.display = "block";
            } else {
                test = true;
                document.getElementById("Messages").style.display = "none";
            }
        });

        var oldBgBtn = document.getElementById("chDraw").style.background;
        var oldPosBtn = document.getElementById("save").style.display;
        document.getElementById("chDraw").style.background = "#fff";

        document.getElementById("chDraw").addEventListener("click", function () {
            DorT = 0;
            document.getElementById("addToDo").style.display = "none";
            document.getElementById("chDraw").style.background = "#fff";
            document.getElementById("chText").style.background = oldBgBtn;
            document.getElementById("chTimeLine").style.background = oldBgBtn;
            document.getElementById("canvas").style.display = "block";
            document.getElementById("textarea").style.display = "none";
            document.getElementById("timeLine").style.display = "none";
            document.getElementById("clearCanvas").style.display = oldPosBtn;
            document.getElementById("save").style.display = oldPosBtn;
            document.getElementById("sizes").style.visibility = "visible";
            document.getElementById("colors").style.visibility = "visible";
            document.getElementById("sandc").style.visibility = "visible";
        });
        
        document.getElementById("chText").addEventListener("click", function () {
            DorT = 1;
            document.getElementById("addToDo").style.display = "none";
            document.getElementById("chDraw").style.background = oldBgBtn;
            document.getElementById("chTimeLine").style.background = oldBgBtn;
            document.getElementById("chText").style.background = "#fff";
            document.getElementById("canvas").style.display = "none";
            document.getElementById("timeLine").style.display = "none";
            document.getElementById("textarea").style.display = "block";
            document.getElementById("clearCanvas").style.display = oldPosBtn;
            document.getElementById("save").style.display = oldPosBtn;
            document.getElementById("sizes").style.visibility = "hidden";
            document.getElementById("colors").style.visibility = "hidden";
            document.getElementById("sandc").style.visibility = "hidden";
        });


        document.getElementById("chTimeLine").addEventListener("click", function () {
            DorT = 1;
            document.getElementById("addToDo").style.display = "block";
            document.getElementById("clearCanvas").style.display = "none";
            document.getElementById("save").style.display = "none";
            document.getElementById("chText").style.background = oldBgBtn;
            document.getElementById("chDraw").style.background = oldBgBtn;
            document.getElementById("chTimeLine").style.background = "#fff";
            document.getElementById("canvas").style.display = "none";
            document.getElementById("textarea").style.display = "none";
            document.getElementById("timeLine").style.display = "block";
            document.getElementById("sizes").style.visibility = "hidden";
            document.getElementById("colors").style.visibility = "hidden";
            document.getElementById("sandc").style.visibility = "hidden";
        });

        document.getElementById("addToDoBtn").onclick = function () {
            var newToDo = {};
            newToDo.type = 300;
            newToDo.groupe = groupe;
            newToDo.title = document.getElementById("titleToDo").value;
            newToDo.date = document.getElementById("dateToDo").value;
            newToDo.disc = document.getElementById("discToDo").value;
            Socket.send(JSON.stringify(newToDo));
        }

        document.getElementById("textarea").onkeyup = function (e) {
            ti = Date.now();
            var newM = {};
            newM.type = 144;
            newM.groupe = groupe;
            newM.valeur = document.getElementById("textarea").innerHTML;
            Socket.send(JSON.stringify(newM));
        }

        document.getElementById("AddFile").onclick = function () {
            document.getElementById("chDraw").style.background = "#fff";
            document.getElementById("chText").style.background = oldBgBtn;
            document.getElementById("canvas").style.display = "block";
            document.getElementById("textarea").style.display = "none";

            filePicker = document.getElementById("filePicker");
            filePicker.click();
            file = filePicker.files[0];


            
                reader = new FileReader();
                reader.readAsDataURL(file);

           
            reader.onload = function (event) {
                console.log("hae");
                var newImage = new Image();
                newImage.src =  event.target.result;
                newImage.onload = function () { 
                        var w = newImage.width;
                        var h = newImage.height;
                        if (h > canvas.height) {
                            h = canvas.height;
                            w = newImage.width * (canvas.height / newImage.height);
                        }
                        else if (w > canvas.width) {
                            w = canvas.width;
                            h = h * (canvas.width / newImage.width);
                        }
                        ctx.drawImage(newImage, 0, 0, w, h);
                    }
                    var newI = {};
                    newI.type = 111;
                    newI.groupe = groupe;
                    newI.img = event.target.result;
                    Socket.send(JSON.stringify(newI));
            }      
        }


        document.getElementById("TextToSend").onchange = function () {
            if (document.getElementById("TextToSend").type == "file") {
                input = document.getElementById("TextToSend").files[0];
                var newImageToSend = {};
                newImageToSend.type = 111;
                newImageToSend.img = input;
                Socket.send(JSON.stringify(newImageToSend));
                var fReader = new FileReader();
                fReader.readAsDataURL(input);
                fReader.onloadend = function (event) {
                    var newImage = new Image();
                    newImage.src = event.target.result;
                    newImage.onload = function () {
                        var w = newImage.width;
                        var h = newImage.height;
                        if (h > canvas.height) {
                            h = canvas.height;
                            w = newImage.width * (canvas.height / newImage.height);
                        }
                        else if (w > canvas.width) {
                            w = canvas.width;
                            h = h * (canvas.width / newImage.width);
                        }
                        ctx.drawImage(newImage, 0, 0, w, h);
                    }
                    var newI = {};
                    newI.type = 111;
                    newI.groupe = groupe;
                    newI.img = event.target.result;
                    Socket.send(JSON.stringify(newI));

                }
                document.getElementById("button").style.display = "block";
                document.getElementById("AddFile").style.display = "block";
                document.getElementById("TextToSend").type = "text";
                document.getElementById("TextToSend").style.bottom = "10px";
                document.getElementById("TextToSend").style.background = "#fff";
            }
        }
        closeS = function () {
            var clm = {};
            clm.type = 404;
            clm.value = rank;
            Socket.send(JSON.stringify(clm));
        }
    } 





document.body.addEventListener("beforeunload", function () {
    
});


document.getElementById("save").addEventListener("click", function () {

    // Create the picker object and set options
    var savePicker = new Windows.Storage.Pickers.FileSavePicker();
    savePicker.suggestedStartLocation = Windows.Storage.Pickers.PickerLocationId.documentsLibrary;
    // Dropdown of file types the user can save the file as

    savePicker.fileTypeChoices.insert("HTML", [".html"]);
    if (DorT == 0) {
        savePicker.suggestedFileName = "New Image";
    } else {
        savePicker.suggestedFileName = "New Text";
    }

    

    savePicker.pickSaveFileAsync().then(function (file) {
        if (file) {
            // Prevent updates to the remote version of the file until we finish making changes and call CompleteUpdatesAsync.
            Windows.Storage.CachedFileManager.deferUpdates(file);
            if (DorT == 0) {
                ii = "<img src='" + canvas.toDataURL() + "'>";
            } else {
                ii = document.getElementById("textarea").innerHTML.replace("\n", "<br />");
            }

            // write to file
            Windows.Storage.FileIO.writeTextAsync(file, ii).done(function () {
                // Let Windows know that we're finished changing the file so the other app can update the remote version of the file.
                // Completing updates may require Windows to ask for user input.
                Windows.Storage.CachedFileManager.completeUpdatesAsync(file).done(function (updateStatus) {
                    if (updateStatus === Windows.Storage.Provider.FileUpdateStatus.complete) {
                        WinJS.log && WinJS.log("File " + file.name + " was saved.", "sample", "status");
                    } else {
                        WinJS.log && WinJS.log("File " + file.name + " couldn't be saved.", "sample", "status");
                    }
                });
            });
        } else {
            WinJS.log && WinJS.log("Operation cancelled.", "sample", "status");
        }
    });

    

});


