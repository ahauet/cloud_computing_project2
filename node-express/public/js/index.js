//This file contains the javascript needed from the first page of the app.
$(document).ready( function() {
  $("#createEvent").click(function () {
    var eventName = $("#inputName").val();
    if(eventName==""){
      alert("The name fo your event must be fill.")
    }else{
      $.ajax({
        url: '/createEvent',
        type: 'GET',
        dataType : 'json',
        data: {"name": eventName},
        success:function(data){
          $("#eventId").text("Your new event was created");
          $("#yourEvent").attr("href", data.url).text("Your url !")
        }
      });
    }
  });
});
