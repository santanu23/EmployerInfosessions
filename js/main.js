$(document).ready(function() {
    $('.viewAll').click(function() {
      $('.foodContainer').css("display", "none");
      $('.viewAll').css("display", "none");
      $('.scheduler').css("display", "block");
    })

    $.get("https://api.uwaterloo.ca/v2/resources/infosessions.json?key=8ba5813a8da454869db638eec2845e0e", function(data) {

      var infosessions = [];

      $(data.data).each(function(index, element) {
        if (element.date == moment().format("YYYY-MM-DD")) infosessions.push(element);
      })
      if (infosessions.length > 0){
        $(infosessions).each(function(index, element){
          if(element.employer.indexOf("* CANCELLED *") == -1 ){
            var programs = getProgramFromAudience(element.audience);
            insertCard(element.employer, "images/employers/"+ element.employer.trim().replace(/ /g, '').replace(".","") +".jpg", programs, element.start_time, element.end_time,
                      element.building.code, element.building.room, element.building.map_url, element.link, element.description);

          }
        });
      }
      else{
        $('.mainContainer').append("<center><h3 class=\"noInfoSessions\">No infosessions today<h3><center>");
      }
      //calenderStuff();
    });
  });

var insertCard = function(employerName, imageSrc, programList, start, end, buildingCode, buildingRoom, mapUrl, registerUrl, description) {
var cardTemplate = "<div class=\"infosessionCard\">"
+                      "<div class=\"card\">"
+                          "<div class=\"card-image\">"
                               //add first image from google images by searching for emplyoer name
+                              "<img src=\"" + imageSrc.toLowerCase().replace(" ","").replace("inc.","").trim() + "\">"
+                              "<span class=\"card-title\">" + employerName + "</span>"
+                          "</div>"
+                          "<div class=\"card-content\">";

                              //add chips for each program (eg. Eng-Comp, Eng-Soft, Math-CS)
                               $(programList).each( function(index, element){
                                 //if (index % 3 == 0) cardTemplate += "<br>";
                                 cardTemplate += "<div class=\"program chip\">" + element + "</div>";
                               });

cardTemplate +=                "<p class = \"time\">" + moment(start, ["H:mm"]).format("h:mm A") + " - " + moment(end, ["H:mm"]).format("h:mm A") + "<p>"
+                              "<p class = \"Location\"><a href=\""+ mapUrl + "\"><i class=\"fa fa-map-marker \" aria-hidden=\"true\"></i>  " + buildingCode + " " + buildingRoom + "</a></p>"
+                          "</div>"
+                          "<div class=\"card-action\">"
+                              "<a class=\"register\" href=\"" + registerUrl + "\">Register</a>"
+                          "</div>"
+                    "<div class=\"card-reveal\">"
+                    "<span class=\"card-title grey-text text-darken-4\">"+ employerName +"<i class=\"material-icons right\">close</i></span>"
+                    "<p>Here is some more information about this product that is only revealed once clicked on.</p>"
+                    "</div>"
+                      "</div>"
+                  "</div>"
+                  "</div>";
$('.mainContainer>.infosessionList').append(cardTemplate);
//;
}

var getProgramFromAudience = function(audience){
  var returnList = [];
  $(audience).each(function(index, element){
    if(!(returnList).includes(element.split("-")[0].trim())) returnList.push(element.split("-")[0].trim());
  });
  return returnList;
}
