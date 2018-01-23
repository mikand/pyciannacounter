$(document).ready(function() {

    var currentEvent = null;

    $("#modalConfirm").click(function() {
        var data = $("#modalActivity").val().split("|");
        currentEvent.title = data[0];
        currentEvent.backgroundColor = data[1];
        $.get("/newperiod/"+currentEvent.start.unix()+"/"+currentEvent.end.unix()+"/"+data[0],
              function(data) {
                  currentEvent.id = data;
                  $('#calendar').fullCalendar('renderEvent', currentEvent, true);
                  currentEvent = null;
                  $('#myModal').modal('hide');
              });
    });

    $('#calendar').fullCalendar({
        locale: 'it',
        allDaySlot: false,
        weekends: false,
        minTime: "15:00:00",
        maxTime: "23:00:00",
        selectable: true,
        slotDuration: "00:15:00",
        timezone: 'local',
        select: function(start, end, jsEvent, view) {
            var eventId = start;
            currentEvent = {
                title : null,
                start : start,
                end : end,
                allDay: false,
                id: eventId,
                backgroundColor: null
            };
            $('#myModal').modal();
        },
        header: {
	    left: 'prev,next today',
	    center: 'title',
	    right: ''
	},
	defaultView: 'agendaWeek',
	editable: true,
        themeSystem: 'bootstrap3',
        bootstrapGlyphicons: {
            close: 'glyphicon-remove',
            prev: 'glyphicon-chevron-left',
            next: 'glyphicon-chevron-right',
            prevYear: 'glyphicon-backward',
            nextYear: 'glyphicon-forward'
        },
        // eventRender: function(event, element) {
        //     element.append(s);
        // },
        //        height: 650,
        eventClick: function(event) {
            alert(event.title);
        },
        // height: 650,
	events: allEvents
    });
});
