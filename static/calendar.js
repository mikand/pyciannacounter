$(document).ready(function() {

    var currentEvent = null;

    $("#modalConfirm").click(function() {
        var data = $("#modalActivity").val().split("|");
        currentEvent.title = data[0];
        currentEvent.backgroundColor = data[1];
        if (currentEvent.id == "__NEW_EVENT") {
            $.get("/newperiod/"+currentEvent.start.unix()+"/"+currentEvent.end.unix()+"/"+data[0],
                  function(data) {
                      currentEvent.id = data;
                      $('#calendar').fullCalendar('renderEvent', currentEvent, true);
                      currentEvent = null;
                      $('#myModal').modal('hide');
                  });
        }
        else {
           $.get("/editperiod/"+currentEvent.id+"/"+currentEvent.start.unix()+"/"+currentEvent.end.unix()+"/"+data[0],
                  function(data) {
                      if (data != "OK") {
                          alert("Si e' verificato un errore, riprovare! L'errore riportato e': " + data);
                      }
                      else {
                          $('#calendar').fullCalendar('updateEvent', currentEvent);
                          currentEvent = null;
                          $('#myModal').modal('hide');
                      }
                  });
        }
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
            currentEvent = {
                title : null,
                start : start,
                end : end,
                allDay: false,
                id: "__NEW_EVENT",
                backgroundColor: null
            };
            $('#tp_start').val(start.format('HH:mm'));
            $('#tp_end').val(end.format('HH:mm'));
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
            currentEvent = event;
            $('#tp_start').val(event.start.format('HH:mm'));
            $('#tp_end').val(event.end.format('HH:mm'));
            $('#myModal').modal();
        },
        eventDrop: function(event, delta, revertFunc) {
            $.get("/chperiod/"+event.id+"/"+event.start.unix()+"/"+event.end.unix(),
                  function(data) {
                      if (data != "OK") {
                          alert("Si e' verificato un errore, riprovare! L'errore riportato e': " + data);
                          revertFunc();
                      }
              });
        },
        eventResize: function(event, delta, revertFunc) {
            $.get("/chperiod/"+event.id+"/"+event.start.unix()+"/"+event.end.unix(),
                  function(data) {
                      if (data != "OK") {
                          alert("Si e' verificato un errore, riprovare! L'errore riportato e': " + data);
                          revertFunc();
                      }
              });
        },
        // height: 650,
	events: allEvents
    });

    $('#tp_start').timepicker({
        minuteStep: 15,
        showInputs: true,
        showMeridian: false
    });

    $('#tp_end').timepicker({
        minuteStep: 15,
        showInputs: true,
        showMeridian: false
    });
});
