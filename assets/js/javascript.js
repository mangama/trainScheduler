
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
var nextArrival = "";

$("#add-train-btn").on("click", function (event) {
    event.preventDefault();

    var trainName = $("#train-name-input").val().trim();
    var destination = $("#destination-input").val().trim();
    var frequency = $("#frequency-input").val().trim();
    var nextArrival = $("#nextArrival-input").val().trim();

    database.ref().push({
        trainName: trainName,
        destination: destination,
        frequency: frequency,
        nextArrival: nextArrival
    });

});

// Firebase watcher + initial loader HINT: .on("value")
database.ref().on("child_added", function (snapshot) {
    
    // storing the snapshot.val() in a variable for convenience
    var sv = snapshot.val();

    var tr = $('<tr>');
    var td = $('<td>');

    var tFrequency = sv.frequency;

    var firstTime = sv.nextArrival;

    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(firstTime, "hh:mm").subtract(1, "years");

    // Current Time
    var currentTime = moment();

    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");

    // Time apart (remainder)
    var tRemainder = diffTime % tFrequency;

    // Minute Until Train
    var tMinutesTillTrain = tFrequency - tRemainder;

    // Next Train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    
    tr.append(td.clone().text(sv.trainName));
    tr.append(td.clone().text(sv.destination));
    tr.append(td.clone().text(sv.frequency));
    tr.append(td.clone().text(moment(nextTrain).format("hh:mm A")));
    tr.append(td.clone().text(tMinutesTillTrain));
    $("tbody").append(tr);

    // Handle the errors
}, function (errorObject) {
    console.log("Errors handled: " + errorObject.code);
});
$("tbody").empty();


