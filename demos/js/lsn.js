	$(document).ready(function() {
	
		/* initialize the external events
		-----------------------------------------------------------------*/
	
		$('#external-events div.external-event').each(function() {
		
			// create an Event Object (http://arshaw.com/fullcalendar/docs/event_data/Event_Object/)
			// it doesn't need to have a start or end
			var eventObject = {
				title: $.trim($(this).text()), // use the element's text as the event title
				className: $.trim($(this).attr("class").split(' ')[1]) // get the class name color[x]
			};
			
			// store the Event Object in the DOM element so we can get to it later
			$(this).data('eventObject', eventObject);
			
			// make the event draggable using jQuery UI
			$(this).draggable({
				zIndex: 999,
				revert: true,      // will cause the event to go back to its
				revertDuration: 0  //  original position after the drag
			});
			
		});
	
	
		/* initialize the calendar
		-----------------------------------------------------------------*/
		
		var calendar = $('#calendar').fullCalendar({
			header: {
				left: 'prev,next today',
				center: 'title',
				right: 'agendaWeek,agendaDay'
			},
			defaultView: 'agendaDay',
			timeFormat: 'H:mm{ - H:mm}',
			axisFormat: 'H:mm',
			minTime: '8:00',
			maxTime: '22:00',
			allDaySlot: false,
			monthNames: ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'],
			monthNamesShort: ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
			dayNames: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
			dayNamesShort: ['周日','周一','周二','周三','周四','周五','周六'],
			titleFormat: {
				month: 'yyyy MMMM',
				week: "yyyy'年' MMM d'日'{ '&#8212;'[ MMM] d'日' }",
				day: "dddd, yyyy'年' MMM d'日'"
			},
			/*defaultEventMinutes: 120, */
			selectable: true,
			selectHelper: true,
			select: function(start, end, allDay) {
				var type = false;
				var color = false;
				var execute = function(){

					$("input").each(function(){
						(this.checked == true) ? type = $(this).val() : null;
						(this.checked == true) ? color = $(this).attr('id') : null;
					});
				
					$("#dialog-form").dialog("close");

					calendar.fullCalendar('renderEvent',
						{
							title: type,
							start: start,
							end: end,
							allDay: allDay,
							className: color
						},
						true // make the event "stick"
					);
					calendar.fullCalendar('unselect');
				};
	
				var cancel = function() {
					$("#dialog-form").dialog("close");
				}
			
				var dialogOpts = {
					modal: true,
					position: "center",
					buttons: {
						"确定": execute,
						"取消": cancel
					}
				};
		
				$("#dialog-form").dialog(dialogOpts);
			},
			editable: true,
			eventMouseover: function(event, domEvent) {
/*
				for(var key in event){
					$("<p>").text(key + ':' + event[key]).appendTo($("body"));

				};
*/
				var layer =	'<div id="events-layer" class="fc-transparent" style="position:absolute; width:100%; height:100%; top:-1px; text-align:right; z-index:100"><a><img src="images/icon_edit.gif" title="edit" width="14" id="edbut'+event._id+'" border="0" style="padding-right:3px; padding-top:2px;" /></a><a><img src="images/icon_delete.png" title="delete" width="14" id="delbut'+event._id+'" border="0" style="padding-right:5px; padding-top:2px;" /></a></div>';
				$(this).append(layer);
				$("#delbut"+event._id).hide();
				$("#delbut"+event._id).fadeIn(300);
				$("#delbut"+event._id).click(function() {
					calendar.fullCalendar('removeEvents', event._id);
					//$.post("delete.php", {eventId: event._id});
					calendar.fullCalendar('refetchEvents');
				});

				$("#edbut"+event._id).hide();
				$("#edbut"+event._id).fadeIn(300);
				$("#edbut"+event._id).click(function() {
					//var title = prompt('Current Event Title: ' + event.title + '\n\nNew Event Title: ');
					/*
					if(title){
						$.post("update_title.php", {eventId: event.id, eventTitle: title});
						calendar.fullCalendar('refetchEvents');
					}
					*/
					var type = false;
					var color = false;
					var execute = function(){

						$("input").each(function(){
							(this.checked == true) ? type = $(this).val() : null;
							(this.checked == true) ? color = $(this).attr('id') : null;
						});
				
						$("#dialog-form").dialog("close");

						event.title = type;
						event.className = color;

						calendar.fullCalendar('updateEvent', event);
						calendar.fullCalendar('refetchEvents');
					};
		
					var cancel = function() {
						$("#dialog-form").dialog("close");
					}
				
					var dialogOpts = {
						modal: true,
						position: "center",
						buttons: {
							"确定": execute,
							"取消": cancel
						}
					};
			
					$("#dialog-form").dialog(dialogOpts);
					
				});
			},   
			
			eventMouseout: function(calEvent, domEvent) {
				$("#events-layer").remove();
			},

			droppable: true, // this allows things to be dropped onto the calendar !!!
			drop: function(date, allDay) { // this function is called when something is dropped
			
				// retrieve the dropped element's stored Event Object
				var originalEventObject = $(this).data('eventObject');
				
				// we need to copy it, so that multiple events don't have a reference to the same object
				var copiedEventObject = $.extend({}, originalEventObject);
				
				// assign it the date that was reported
				copiedEventObject.start = date;
				copiedEventObject.end    = (date.getTime() + 7200000)/1000;
				copiedEventObject.allDay = false;
				
				// render the event on the calendar
				// the last `true` argument determines if the event "sticks" (http://arshaw.com/fullcalendar/docs/event_rendering/renderEvent/)
				$('#calendar').fullCalendar('renderEvent', copiedEventObject, true);
				
			}
		});
	});