$(document).ready(function() {

    var weekClipBoard = null;
    var weekClipBoardOrigin = null;

    $("#btnCopyWeek").click(function() {
        $("#btnPasteWeek").prop('disabled', false);
        weekClipBoardOrigin = $('#calendar').fullCalendar('getDate');
        weekClipBoard = $('#calendar').fullCalendar('clientEvents', function(event) {
            return event.start.isoWeek() == weekClipBoardOrigin.isoWeek() &&
                event.start.year() == weekClipBoardOrigin.year();
        });
    });
    $("#btnPasteWeek").click(function() {
        var now = $('#calendar').fullCalendar('getDate');
        weekClipBoard.forEach(function(original) {
            var event = {
                title : original.title,
                start : moment(original.start),
                end : moment(original.end),
                allDay: false,
                id: "__NEW_EVENT",
                backgroundColor: original.backgroundColor
            };
            event.start.year(now.year());
            event.start.isoWeek(now.isoWeek());
            event.end.year(now.year());
            event.end.isoWeek(now.isoWeek());
            $.get("/newperiod/"+event.start.unix()+"/"+event.end.unix()+"/"+event.title,
                  function(data) {
                      event.id = data;
                      $('#calendar').fullCalendar('renderEvent', event, true);
                  });
        });
    });

    var currentEvent = null;

    $("#modalDelete").click(function() {
        alert("TODO!");
    });

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
                      $('#new_dialog').modal('hide');
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
                          $('#new_dialog').modal('hide');
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
            $('#new_dialog_title').html("Nuova Attivit&agrave;");
            $('#new_dialog').modal();
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
            $('#new_dialog_title').html("Modifica Attivit&agrave;");

            var value = event.title + "|" + event.backgroundColor;
            $("#modalActivity").val(value).change();;

            $('#new_dialog').modal();
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
        contentHeight: 'auto',
	events: allEvents
    });
});
