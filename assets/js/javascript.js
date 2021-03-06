
// Initialize Firebase
// This is the code we copied and pasted from our app page
const firebaseConfig = {
    apiKey: "AIzaSyDA3DiD13jYlNyZst0mElhwSEq3ztQwxlo",
    authDomain: "myfirstproject-ea039.firebaseapp.com",
    databaseURL: "https://myfirstproject-ea039.firebaseio.com",
    projectId: "myfirstproject-ea039",
    messagingSenderId: "882600578466",
    appId: "1:882600578466:web:dcd4016b5dfb70a9"
};

firebase.initializeApp(firebaseConfig);

// Create a variable to reference the database.
var database = firebase.database();

// Initial Values
var trainName = "";
var destination = "";
var frequency = 0;
var firstArrival = "";

$("#add-train-btn").on("click", function (event) {
    
    event.preventDefault();

    trainName = $("#train-name-input").val().trim();
    destination = $("#destination-input").val().trim();
    frequency = $("#frequency-input").val().trim();
    firstArrival = $("#firstArrival-input").val().trim();

    database.ref().push({
        trainName: trainName,
        destination: destination,
        frequency: frequency,
        firstArrival: firstArrival
    })
    $("#train-name-input").val('');
    $("#destination-input").val('');
    $("#frequency-input").val('');
    $("#firstArrival-input").val('');

});

// Firebase watcher + initial loader HINT: .on("value")
database.ref().on("child_added", function (snapshot) {
    
    // storing the snapshot.val() in a variable for convenience
    var sv = snapshot.val();

    var tr = $('<tr>');
    var td = $('<td>');

    var tFrequency = sv.frequency;

    var firstTime = sv.firstArrival;

  

    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");

    // Current Time
    var currentTime = moment();

    // Difference between the times
    var diffTime = currentTime.diff(moment(firstTimeConverted), "minutes");

    // Time apart (remainder)
    var tRemainder = diffTime % tFrequency; 

    // Minute Until Train
    var tMinutesTillTrain = tFrequency - tRemainder;

    // Next Train
    var nextTrain = currentTime.add(tMinutesTillTrain, "minutes");
    var nextTrainFormatted = moment(nextTrain).format("hh:mm");

    if (moment(firstTime, "hh:mm").diff(currentTime) > 0) {
        nextTrainFormatted=moment(firstTime, "hh:mm").format("hh:mm");
        tMinutesTillTrain = moment(firstTime, "hh:mm").diff(currentTime, "minutes");
    } 
    
    tr.append(td.clone().text(sv.trainName));
    tr.append(td.clone().text(sv.destination));
    tr.append(td.clone().text(sv.frequency));
    tr.append(td.clone().text(nextTrainFormatted));
    tr.append(td.clone().text(tMinutesTillTrain));
    $("tbody").append(tr);

    // Handle the errors
}, function (errorObject) {
    console.log("Errors handled: " + errorObject.code);
});



