$(document).ready(function() {
    $('.viewAll').click(function() {
      $('.foodContainer').css("display", "none");
      $('.viewAll').css("display", "none");
      $('.scheduler').css("display", "block");
    })

    $.get("https://api.uwaterloo.ca/v2/resources/infosessions.json?key=8ba5813a8da454869db638eec2845e0e", function(data) {

      var infosessions = [];
      console.log(data);
      $(data.data).each(function(index, event) {
        if (event.date == moment().format("YYYY-MM-DD")) infosessions.push(event); //prod
        // if(event.date == "2016-05-09") infosessions.push(event); //test
      })
      console.log(infosessions);

      $(infosessions).each(function(index, element){
        insertCard(element.employer, "images/breakfast.jpg", element.audience, element.start_time, element.end_time,
                  element.building.code, element.building.room, element.building.map_url, element.link);

      });

      calenderStuff();
//       for (var i = 0; i < 10; i++) {
//         insertCard("Google", "images/breakfast.jpg", ["ENG - Computer", "ENG - Electrical"], "19:30" , "21:30",
// "TC", "2218" , "https://uwaterloo.ca/map/TC?basemap=D#map=17/43.4690/-80.5412", "http://www.ceca.uwaterloo.ca/students/hiresessions_details.php?id=4033");
//       }


    });
  });

var insertCard = function(employerName, imageSrc, programList, start, end, buildingCode, buildingRoom, mapUrl, registerUrl) {
var cardTemplate = "<div class=\"infosessionCard\">"
+                      "<div class=\"card\">"
+                          "<div class=\"card-image\">"
                               //add first image from google images by searching for emplyoer name
+                              "<img src=\"" + imageSrc + "\">"
+                              "<span class=\"card-title\">" + employerName + "</span>"
+                          "</div>"
+                          "<div class=\"card-content\">";

//add chips for each program (eg. Eng-Comp, Eng-Soft, Math-CS)
 $(programList).each( function(index, element){
   //if (index % 3 == 0) cardTemplate += "<br>";
   cardTemplate += "<div class=\"program chip\">" + element + "</div><br>";
 });

cardTemplate +=                "<p class = \"time\">" + moment(start, ["H:mm"]).format("h:mm A") + " - " + moment(end, ["H:mm"]).format("h:mm A") + "<p>"
+                              "<p class = \"Location\"><a href=\""+ mapUrl + "\"><i class=\"fa fa-map-marker \" aria-hidden=\"true\"></i>  " + buildingCode + " " + buildingRoom + "</a></p>"
+                          "</div>"
+                          "<div class=\"card-action\">"
+                              "<a class=\"register\" href=\"" + registerUrl + "\">Register</a>"
+                          "</div>"
+                      "</div>"
+                  "</div>";
$('.mainContainer>.infosessionList').append(cardTemplate);
}

var normailizeWidthHeight = function(){
  var maxWidth = 0;
  var maxHeight = 0;
    $(".card").each(function(index,element){
      if($(element).width() > maxWidth) maxWidth = $(element).width();
      if($(element).height() > maxHeight) maxHeight = $(element).height();
    })
    $(".card").each(function(index,element){
      $(element).width(maxWidth);
      $(element).height(maxHeight);
    })
}
