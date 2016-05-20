$(document).ready(function() {
    $('.viewAll').click(function() {
        $('.foodContainer').css("display", "none");
        $('.viewAll').css("display", "none");
        $('.scheduler').css("display", "block");
    });

    $.get("https://api.uwaterloo.ca/v2/resources/infosessions.json?key=8ba5813a8da454869db638eec2845e0e", function(data) {

        var infosessions = [];
        var tomorrow = [];
        $(data.data).each(function(index, element) {
            if (element.date == moment().add(0, 'days').format("YYYY-MM-DD")) infosessions.push(element);
            if (element.date == moment().add(1, 'days').format("YYYY-MM-DD")) tomorrow.push(element.employer);
        });
        infosessions.sort(function(a, b) {
            if (a.start_time < b.start_time) {
                return -1;
            } else if (a.start_time > b.start_time) {
                return 1;
            } else {
                return 0;
            }
        })
        console.log(tomorrow);
        if (infosessions.length > 0) {
            $(infosessions).each(function(index, element) {
                if (element.employer.indexOf("* CANCELLED *") == -1) { //don't include cancelded info sessions
                    var programs = getProgramFromAudience(element.audience);
                    insertCard(element.employer, "images/employers/" + element.employer.toLowerCase().trim().replace(/ /g, '').replace(".", "") + ".jpg", programs, element.start_time, element.end_time,
                        element.building.code, element.building.room, element.building.map_url, element.link, element.description, moment().format("HH:mm") > element.start_time);
                }
            });
        } else {
            $('.mainContainer').append("<center><h3 class=\"noInfoSessions\">No infosessions today<h3><center>");
        }
        //TODO: calenderStuff();
    });
});

var insertCard = function(employerName, imageSrc, programList, start, end, buildingCode, buildingRoom, mapUrl, registerUrl, description, pastEvent) {
var cardTemplate;
if (pastEvent) {
    cardTemplate = "<div class=\"infosessionCard greyOut\">";
} else {
    cardTemplate = "<div class=\"infosessionCard\">";
}
cardTemplate +=       "<div class=\"card\">"
+                          "<div class=\"card-image\">"
+                              "<img class=\"logo\" src=\"" + imageSrc + "\">"
+                          "</div>"
+                          "<div class=\"card-content\">"
+                              "<p><strong>" + employerName + "</strong></p>"
+                              "<p class = \"time\">" + moment(start, ["H:mm"]).format("h:mm A") + " - " + moment(end, ["H:mm"]).format("h:mm A") + "<p>"
+                              "<p class = \"Location\"><a href=\""+ mapUrl + "\"><i class=\"fa fa-map-marker \" aria-hidden=\"true\"></i>  " + buildingCode + " " + buildingRoom + "</a></p>";
//add chips for each program (eg. Eng-Comp, Eng-Soft, Math-CS)
 $(programList).each( function(index, element){
   cardTemplate += "<div class=\"program chip\">" + element + "</div>";
 });
cardTemplate +=            "</div>"
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

var getProgramFromAudience = function(audience) {
    var returnList = [];
    $(audience).each(function(index, element) {
        if (!(returnList).includes(element.split("-")[0].trim())) returnList.push(element.split("-")[0].trim());
    });
    return returnList;
}
