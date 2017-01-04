$(document).ready(function() {
    $('.viewAll').click(function() {
        $('.foodContainer').css("display", "none");
        $('.viewAll').css("display", "none");
        $('.scheduler').css("display", "block");
    });

    $.get("https://api.uwaterloo.ca/v2/resources/infosessions.json?key=8ba5813a8da454869db638eec2845e0e", function(data) {

        var infosessions = [];
        var today = [];
        var tomorrow = [];
        $(data.data).each(function(index, element) {
            if (element.date == moment().add(0, 'days').format("YYYY-MM-DD")){
            	infosessions.push(element);
            	today.push(element.employer);
            } 
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
        console.log("today:" + today);
        console.log("tomorrow:" + tomorrow);
        if (infosessions.length > 0) {
            $(infosessions).each(function(index, element) {
                if (element.employer.indexOf("CANCELLED") == -1 && element.employer.indexOf("Closed") == -1) { //don't include cancelded info sessions\
               	  	daylightSavings(element); //adjust for daylight savings 
                    var programs = getProgramFromAudience(element.audience);
                    var website = fixUrl(element.employer, element.website);
                    insertCard(element.employer, "images/employers/" + element.employer.toLowerCase().trim().replace(/ /g, '').replace(".", "").replace(":","").replace("#","") + ".jpg", programs, element.start_time, element.end_time,
                        element.building.code, element.building.room, element.building.map_url, element.link, website, element.description, moment().format("HH:mm") > element.start_time);
                }
                else{
                  if (infosessions.length == 1) $('.mainContainer').append("<center><h3 class=\"noInfoSessions\">No infosessions today<h3><center>"); //quick fix restructure later
                }

            });
        } else {
            $('.mainContainer').append("<center><h3 class=\"noInfoSessions\">No infosessions today<h3><center>");
        }
        //TODO: calenderStuff();
    });
});

var daylightSavings = function(infosession){
	if (!moment(infosession.date).isDST()){
		infosession.start_time = moment(infosession.date + " " + infosession.start_time).add(1,'h').format("HH:mm");
		infosession.end_time = moment(infosession.date + " " + infosession.end_time).add(1,'h').format("HH:mm");
	}
}

var insertCard = function(employerName, imageSrc, programList, start, end, buildingCode, buildingRoom, mapUrl, registerUrl, companyUrl, description, pastEvent) {
var cardTemplate;
if (pastEvent) {
    cardTemplate = "<div class=\"infosessionCard greyOut\">";
} else {
    cardTemplate = "<div class=\"infosessionCard\">";
}
cardTemplate +=       "<div class=\"card\">"
+                          "<div class=\"card-image\">"
+                           "<a href=\"" + companyUrl + "\">"
+                              "<img class=\"logo\" src=\"" + imageSrc + "\">"
+                           "</a>"
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
        if ((returnList).indexOf(element.split("-")[0].trim()) == -1) returnList.push(element.split("-")[0].trim());
    });
    return returnList;
}

var fixUrl= function(name,websiteUrl) {
    if(websiteUrl && websiteUrl.length){
      if (websiteUrl.indexOf("http://") == -1 && websiteUrl.indexOf("https://") == -1) return "http://".concat(websiteUrl);
      return websiteUrl;
    }
    return "http://".concat(name.toLowerCase()).concat(".com");
}
