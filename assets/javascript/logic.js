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

for (i = 0; i < 24; i++)
  $("<option>").attr('value', i).text(i).appendTo("#initial-hour-input");

for (i = 0; i < 60; i++)
{
  if (i < 10)
    i = '0' + i;
  $("<option>").attr('value', i).text(i).appendTo("#initial-minute-input");
}
// Get input for a new train
$("#submit-train-btn").on('click', function(event)
{
  event.preventDefault();
  // Get user input
  var trainName = $("#train-name-input").val().trim();
  var destination = $("#destination-input").val().trim();
  var initTrainTime = $("#initial-hour-input").val() + ':' + $("#initial-minute-input").val();
  var trainFreq = $("#frequency-input").val().trim();
  var divArray =
  [
    $("#train-name-input"),
    $("#destination-input"),
    $("#initial-hour-input"),
    $("#initial-minute-input"),
    $("#frequency-input")
  ];
  // Get current time, formatted as UNIX timestamp
  var timeNow = moment().format("X");
  console.log(timeNow);
  // Check that user input includes all fields
  if (trainName != "" && destination != "" && trainFreq != "")
  {
    // Update Firebase
    database.ref().push(
    {
      trainName: trainName,
      destination: destination,
      initTrainTime: initTrainTime,
      trainFreq: trainFreq
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
  }

  else
  // If user input is missing any fields, alert the user
  {
    alert("You are missing data!");
    // Make the font color for the item missing red
    for (i = 0; i < divArray.length; i++)
    {
      if (divArray[i].val() == "")
        divArray[i].parent().css("color", "red");
      else
        divArray[i].parent().css("color", "black");
    }
  }
});

// Show added train on the page
database.ref().on('child_added', function(childSnapshot)
{
  $("tbody").append("<tr><td class='addlTrain'> " + childSnapshot.val().trainName +
    " </td><td class='addlDestination'> " + childSnapshot.val().destination +
    " </td><td class='addlFreqRate'> " + childSnapshot.val().trainFreq + "</td></tr>")
});
