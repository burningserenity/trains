// Firebase App
var config = {
  apiKey: "AIzaSyBQ9gRe0oBxvIRYx8XOGiSrRBzKtmrWJcM",
  authDomain: "trains-8664a.firebaseapp.com",
  databaseURL: "https://trains-8664a.firebaseio.com",
  projectId: "trains-8664a",
  storageBucket: "trains-8664a.appspot.com",
  messagingSenderId: "660173913571"
};
firebase.initializeApp(config);

var database = firebase.database();
var minTillArrival;
var timeNow;

// Make hours and minutes for dropdown menus
for (i = 0; i < 24; i++)
  $("<option>").attr('value', i).text(i).appendTo("#initial-hour-input");

for (i = 0; i < 60; i++) {
  if (i < 10)
    i = '0' + i;
  $("<option>").attr('value', i).text(i).appendTo("#initial-minute-input");
}
// Get input for a new train
$("#submit-train-btn").on('click', function(event) {
  event.preventDefault();
  // Get user input
  var trainName = $("#train-name-input").val().trim();
  var destination = $("#destination-input").val().trim();
  var initTrainTime = $("#initial-hour-input").val() + ':' + $("#initial-minute-input").val();
  var trainFreq = parseInt($("#frequency-input").val().trim());

  if (Number.isInteger(trainFreq) == false)
  {
    alert('Train frequency must be an integer');
    $("#freqDiv").css('color', 'red');
    $("#frequency-input").val("");
  }

  // Check that user input includes all fields
  else if (trainName != "" && destination != "" && trainFreq != "") {
    var unixInitTrainTime = moment(initTrainTime, "HH:mm").format("X");
    var trainFreqSecs = trainFreq * 60;
    var divArray = [
      $("#train-name-input"),
      $("#destination-input"),
      $("#initial-hour-input"),
      $("#initial-minute-input"),
      $("#frequency-input")
    ];

    // Get time until the next train arrives
    minTillArrival = calculate(unixInitTrainTime, trainFreqSecs);
    console.log(minTillArrival);
    var secsTillArrival = minTillArrival * 60;
    console.log(secsTillArrival);
    var nextTrainComes = parseInt(timeNow) + secsTillArrival;
    var easternNextTrain = moment(nextTrainComes).utcOffset("+1005").format("HH:mm");
    console.log(easternNextTrain);
    // Update Firebase
    database.ref().push({
      trainName: trainName,
      destination: destination,
      unixInitTrainTime: unixInitTrainTime,
      trainFreq: trainFreq,
      minTillArrival: minTillArrival,
      easternNextTrain: easternNextTrain
    });
    // Set input color to black
    for (i = 0; i < divArray.length; i++)
      divArray[i].parent().css("color", "black");
    // Empty input fields
    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#initial-hour-input").val("0");
    $("#initial-minute-input").val("00");
    $("#frequency-input").val("");
  } else
  // If user input is missing any fields, alert the user
  {
    alert("You are missing data!");
    // Make the font color for the item missing red
    for (i = 0; i < divArray.length; i++) {
      if (divArray[i].val() == "")
        divArray[i].parent().css("color", "red");
      else
        divArray[i].parent().css("color", "black");
    }
  }
});

// Show added train on the page
database.ref().on('child_added', function(childSnapshot) {
  $("tbody").append("<tr><td class='addlTrain'> " + childSnapshot.val().trainName +
    " </td><td class='addlDestination'> " + childSnapshot.val().destination +
    " </td><td class='addlFreqRate'> " + childSnapshot.val().trainFreq +
    " </td><td class='timeTillTrain'> " + childSnapshot.val().minTillArrival +
    " </td><td class='nextArrivalTime'>" + childSnapshot.val().easternNextTrain + "</td></tr>")
});

function calculate(unixInitTrainTime, trainFreqSecs) {
  timeNow = moment().format("X");
  var diffInitNow = timeNow - unixInitTrainTime;
  var mod = diffInitNow % trainFreqSecs;
  var timeLeft = trainFreqSecs - mod;
  var timeMin = timeLeft / 60;
  var adjTime = Math.round(timeMin);
  return adjTime;
}
