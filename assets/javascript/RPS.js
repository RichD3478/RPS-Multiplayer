  let config = {
    apiKey: "AIzaSyDLpVSpQKWFmM1CdYwn4u0Qt6zmZlJVmOE",
    authDomain: "rps-multiplayer-ed25e.firebaseapp.com",
    databaseURL: "https://rps-multiplayer-ed25e.firebaseio.com",
    projectId: "rps-multiplayer-ed25e",
    storageBucket: "",
    messagingSenderId: "702546682361"
  };
  firebase.initializeApp(config);

let database = firebase.database();

let pOneW = 0;
let pOneL = 0;
let pOneName = "";
let pOneChoice = "";
let pTwoW = 0;
let pTwoL = 0;
let pTwoName = "";
let pTwoChoice = "";
let theWinnerIs = false;
let turn;
let rps = ['Rock', 'Paper', 'Scissors'];
let readyToPlay = false;
let pConnected = 0;

let connectionsRef = database.ref("/connections");
let connectedRef = database.ref(".info/connected");

connectedRef.on("value", function(snap) {
    if (snap.val()) {
        let here = connectionsRef.push(true);
        here.onDisconnect().remove();
    };
});

connectionsRef.on("value", function(snap) {
    pConnected = (snap.numChildren());
    console.log(pConnected);
});

database.ref().on("value", function(snapshot) {
        if ((snapshot.child("pOneName").exists) && (snapshot.child("pTwoName").exists)) {
            $(".pOneName").html((snapshot.val().player.one.pOneName));
            $(".pTwoName").html((snapshot.val().player.two.pTwoName));
        }

        $("#pOneStats").html("Wins: " + (snapshot.val().player.one.pOneW) + " Loss: " + (snapshot.val().player.one.pOneL));
        $("#pTwoStats").html("Wins: " + (snapshot.val().player.two.pTwoW) + " Loss: " + (snapshot.val().player.two.pTwoL));
    }, function(errorObject) {
        console.log("Error! " + errorObject.code);

});

$("#startGame").on("click", function() {
    let name = $("#userName").val().trim();

    if(pOneName == "") {
        pOneName = name;
    }
    else if(pTwoName == "") {
        pTwoName = name;
    }

    database.ref().push({
        player:{
            one:{
                pOneName: pOneName,
                pOneW: pOneW,
                pOneL: pOneL,
            },
            two:{
                pTwoName: pTwoName,
                pTwoW: pTwoW,
                pTwoL: pTwoL,
            }
        },
        turn: turn
    });

if ((pOneName != "") && (pTwoName != "")) {
    turn= 1;
    readyToPlay= true;
}
});

if (pConnected == 2) {

    database.ref().limitToFirst(1).on("child_added", function(snapshot) {
        if(turn === 1) {
            $("#pOneMsg").html(pOneName + ", it's your turn!");

            for (var i = 0; i < rps.length; i++) {
                let choices = $("<div>");
                choices.attr("data-choice", rps[1]);
                choices.addClass(rocPapSci);
                choices.text(rps[1]);
                $("#pOneOptions").append(choices);
            }
        } else if(turn === 2) {
            $("#pOneMsg").html("Waitig for " + pTwoName);
        }
    });

    database.ref().limitToFirst(1).on("child_added", function(snapshot) {
        if(turn === 2) {
            $("#pTwoMsg").html(pTwoName + ", it's your turn!");

            for (var i = 0; i < rps.length; i++) {
                let choices = $("<div>");
                choices.attr("data-choice", rps[1]);
                choices.addClass(rocPapSci);
                choices.text(rps[1]);
                $("#pOneOptions").append(choices);
            }
        } else if(turn === 1) {
            $("#pTwoMsg").html("Waitig for " + pOneName);
        }
    });
}

$(".rocPapSci").on("click", function() {
    pOneChoice = $(this).data("choice");
    $("#pOneOptions").empty();

    database.ref().limitToFirst(1).o("child_added", function(snapshot) {
        $("#pOneChoice").html(pOneChoice);
    });

    turn = 2;
});

$(".rocPapSci").on("click", function() {
    pTwoChoice = $(this).data("choice");
    $("#pTwoOptions").empty();

    database.ref().limitToFirst(1).o("child_added", function(snapshot) {
        $("#pTwoChoice").html(pTwoChoice);
    });

    turn = 1;
    theWinnerIs = true;
});

function whoWon() {
    $("#pOneChoice").html();
    $("#pTwoChoice").html();

    if (pOneChoice == pTwoChoice) {
        $("#winner").html("It's a tie!");
    }
    else if ((pOneChoice == "Rock") && (pTwoChoice == "Paper")) {
        $("#winner").html(pTwoName + " wins!");
        pOneL++;
        pTwoW++;
    }
    else if ((pOneChoice == "Paper") && (pTwoChoice == "Scissors")) {
        $("#winner").html(pTwoName + " wins!");
        pOneL++;
        pTwoW++;
    }
    else if ((pOneChoice == "Scissors") && (pTwoChoice == "Rock")) {
        $("#winner").html(pTwoName + " wins!");
        pOneL++;
        pTwoW++;
    }
    else if ((pOneChoice == "Rock") && (pTwoChoice == "Scissors")) {
        $("#winner").html(pOneName + " wins!");
        pOneW++;
        pTwoL++;
    }
    else if ((pOneChoice == "Paper") && (pTwoChoice == "Rock")) {
        $("#winner").html(pOneName + " wins!");
        pOneW++;
        pTwoL++;
    }
    else if ((pOneChoice == "Scissors") && (pTwoChoice == "Paper")) {
        $("#winner").html(pOneName + " wins!");
        pOneW++;
        pTwoL++;
    }
    
    database.ref().push({
        player:{
            one:{
                pOneW: pOneW,
                pOneL: pOneL, 
            },
            two:{
                pTwoW: pTwoW,
                pTwoL: pTwoL,
            }
        }
    });
}

$("#sendChat").on("Click", function() {
    let chatEntry = $("#userChat").val().trim();
    let chat = $("<div>");
});

if (theWinnerIs == true) {
    whoWon();
}