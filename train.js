

// Initialize Firebase
var config = {
  apiKey: "AIzaSyAJ99S9jMPDu5D69LCw76GzFgYlO24vgVY",
  authDomain: "ebay-8cc2a.firebaseapp.com",
  databaseURL: "https://ebay-8cc2a.firebaseio.com",
  projectId: "ebay-8cc2a",
  storageBucket: "ebay-8cc2a.appspot.com",
  messagingSenderId: "488552075567"
};
firebase.initializeApp(config);

// list of train from Db
var train = firebase.database();

  // Add new train by clicking Submit
  $("#add-train-btn").on("click", function() {

  // capture user info from form
  var Name = $("#train-name-input").val().trim();
  var destination = $("#destination-input").val().trim();
  var firstTrain = $("#first-train-input").val().trim();
  var frequency = $("#frequency-input").val().trim();


  // Hold train info
  var nextTrain = {

    name: Name,
    destination: destination,
    firstTrain: firstTrain,
    frequency: frequency
  };

  // push user train info to Db
  train.ref().push(nextTrain);


  // provide an Alert if train is added successfully
  alert("Next Train successfully added");

  // Clears the form text after next train is added.
  $("#train-name-input").val("");
  $("#destination-input").val("");
  $("#first-train-input").val("");
  $("#frequency-input").val("");

  // Determine Next Scheduled Arrival.
  return false;
});

// Add new train in the HTML and create Db entry for new train and added
train.ref().on("child_added", function(childSnapshot, prevChildKey) {

  console.log(childSnapshot.val());

  // Store entries into a variable.
  var sName = childSnapshot.val().name;
  var sDestination = childSnapshot.val().destination;
  var sFrequency = childSnapshot.val().frequency;
  var sFirstTrain = childSnapshot.val().firstTrain;

  var timeArr = sFirstTrain.split(":");
  var trainTime = moment().hours(timeArr[0]).minutes(timeArr[1]);
  var maxMoment = moment.max(moment(), trainTime);
  var sMinutes;
  var sArrival;

  // If the first train is later than the current time, sent arrival to the first train time
  if (maxMoment === trainTime) {
    sArrival = trainTime.format("hh:mm A");
    sMinutes = trainTime.diff(moment(), "minutes");
  } else {

    // calculate Time until next arrival in mininutes.
    // calculate current time (= moment) and subtract (.diff) from the trainTime entered for each train
    // calculate the the remainder of the quotient (% = modulus) between the difference and the frequency.
    var differenceTimes = moment().diff(trainTime, "minutes");
    var sRemainder = differenceTimes % sFrequency;
    sMinutes = sFrequency - sRemainder;
    // calculate Arrival time, add the sMinutes to the current time (moment)
    sArrival = moment().add(sMinutes, "m").format("hh:mm A");
  }
  console.log("sMinutes:", sMinutes);
  console.log("sArrival:", sArrival);

  // append each train to the schedule table
  $("#train-table > tbody").append("<tr><td>" + sName + "</td><td>" + sDestination + "</td><td>" +
          sFrequency + "</td><td>" + sArrival + "</td><td>" + sMinutes + "</td></tr>");
});


