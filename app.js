/*global $*/

var SEARCH_URL = 'https://www.googleapis.com/civicinfo/v2/voterinfo';
var ELECTIONS_URL = "https://www.googleapis.com/civicinfo/v2/elections";

var RESULT_HTML_TEMPLATE = (
  '<div>' +
    '<p class="pollingLocation"></p>'+
     '<p class="addressLine1"></p>'+
     '<p class="addressLine2"></p>'+
     '<p class="hours"></p>'+
  '</div>'
);
var ELECTION_HTML_TEMPLATE = (
    "<div>"+
    '<p class="electionName"></p>'+
    '<p class="electionDay"></p>'+
    "</div"
    );

function getDataFromApi(searchTerm, callback) {
  var query = {
      key: "AIzaSyCzXl1JxA1MSDhfE4ibgdqpjalTI7GYb1A",
    address: searchTerm,
  };
  try {$.parseJSON($.getJSON(SEARCH_URL, query, callback));}
  catch(e){
      $(".js-search-results").html("<p>There is no data for this address. There may not be a supported election in your area. Please check the list of supported elections and try again.</p>");
  }
  $.getJSON(SEARCH_URL, query, callback);
}
function getElectionData(callback) {
  var query = {
      key: "AIzaSyCzXl1JxA1MSDhfE4ibgdqpjalTI7GYb1A",
  };
 // try {$.parseJSON($.getJSON(ELECTIONS_URL, query, callback));}
  //catch(e){
    //  $(".js-search-results").html("<p>There is no data for this address. There may not be a supported election in your area. Please check the list of supported elections and try again.</p>");
  //}
  $.getJSON(ELECTIONS_URL, query, callback);
}

function renderResult(result) {
  var template = $(RESULT_HTML_TEMPLATE);
  template.find(".pollingLocation").text(result.pollingLocations[0].address.locationName);
   template.find(".addressLine1").text(result.pollingLocations[0].address.line1);
template.find(".addressLine2").text(result.pollingLocations[0].address.city + ", "+result.pollingLocations[0].address.state + " "+result.pollingLocations[0].address.zip);
template.find(".hours").text("Polling hours: " +result.pollingLocations[0].pollingHours);
  return template;
}
function renderElections (result){
var template = $(ELECTION_HTML_TEMPLATE);
template.find(".electionName").text("Name: "+result.name);
template.find(".electionDay").text("Election Day: "+result.electionDay);
return template;
}
function displaySearchData(data) {
    var results;
  
  results = renderResult(data);
  
  $('.js-search-results').html(results);
}
function displayElections(data) {
  var results = data.elections.map(function(item, index) {
    return renderElections(item);
  });
  $('.elections').html(results);
}

function watchSubmit() {
    var electionsSearched = false;
    $(".js-elections").on("click", function(){
    if (electionsSearched){
        $(".elections").toggleClass("hidden");
    }
 else{
     electionsSearched=true;
     getElectionData(displayElections);
     $(".elections").toggleClass("hidden");
 }
    });
  $('.js-search-form').submit(function(event) {
    event.preventDefault();
    var queryTarget = $(event.currentTarget).find('.js-query');
    var query = queryTarget.val();
    // clear out the input
    queryTarget.val("");
    getDataFromApi(query, displaySearchData);
  });
}

$(watchSubmit);