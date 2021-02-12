/*
  I took some data from 'Good Mythical Morning' on youtube
  to use as sample data 
*/
var employees = {
    "Alex Punch": "Production Coordinator",
    "Becca Canote": "Content & Studio Manager",
    "Ben Eck": "Director of Photography",
    "Brian Johanson": "Producer",
    "Candace Carrizales": "Host/Co-Creator, The Hey Hey Show",
    "Chase Hilt": "Production Assistant",
    "Edward Coleman": "Writer/Producer, Good Mythical Morning",
    "Jen Matichuk": "Social Media Manager",
    "Kevin Kostelnik": "Producer/Editor, Ear Biscuits & Song Biscuits",
    "Leann Bowen": "Editor, The Hey Hey Show",
    "Leo Kei Angelos": "Assistant Editor",
    "Lizzie Redner": "Writer / Producer, The Hey Hey Show",
    "Morgan Locke": "Editor, Good Mythical Morning",
    "Shannon Coffey": "Host/Co-Creator, The Hey Hey Show",
    "Stevie Wynne Levine": "Head of Production & Development"
};

//Can't be set until table is filled
// for obvious reasons
var rows = 0;

//Set variables to decide things like button disable time
//And also eases the changing of animation
var fadeTime = 700;
var delayTime = 50;

//This also won't be correct until table is set
//since it depends on rows
//Used to decide how long button needs to be disabled after clicked
var animTime = 0;

$(window).load(function () {
    //Create the actual table from the dict
    //$("#m").append("<tr class='hide'><th> # </th><th> Name </th><th> Position </th></tr>");
    //var i = 1;
    //for (var key in employees) {
    //    $(".tr-fade").append("<tr class='hide'><td>" + i + "</td><td>" + key + "</td><td> " + (employees[key]) + "</td></tr>");
    //    i++;
    //}

    //Now we can properly set the rows and animTime variable
    rows = $(".tr-fade tr").length;
    animTime = (rows * delayTime) + fadeTime + 100;
    //+100 for margin

    //make button unclickable for x sec so animation can finish
    //$("#rerun").attr("disabled", true);
    //setTimeout(function () { enableClick($("#rerun")) }, animTime);

    animateTable();
});

//Loop through all table rows and fade them in
var animateTable = function (i, rows) {
    (function next(i) {
        if (i++ >= rows) return;
        setTimeout(function () {
            $(".tr-fade tr:nth-child(" + i + ")").fadeTo(fadeTime, 0.7);
            next(i);
        }, delayTime);
    })(0, rows);
}

////The button to rerun animation
//$("#rerun").click(function () {
//    //Disable button until animation complete to avoid bug
//    $(this).attr("disabled", true);
//    setTimeout(function () { enableClick($("#rerun")) }, animTime);

//    //Set opacity to 0 and run it again
//    $("#m tr:nth-child(1n)").css("opacity", 0);
//    animateTable();
//});

////Make button clickable again
//var enableClick = function (ele) {
//    $(ele).removeAttr("disabled");
//}