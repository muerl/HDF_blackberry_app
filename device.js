


(function() {

	WebWorks = {
			/** 
			 * 
			 * @param eventName - <String> - Name of the Event - Title of the Appt
			 * @param eventText - <String> - Text for the Event - Text in appt
			 * @param eventLocation - <String> - Location of the Event
			 * @param eventStart - <Date> - Object Start Time
			 * @param eventEnd - <Date> - Object End Time
			 */
		addToCalender : function(eventName, eventText, eventLocation,eventStart, eventEnd) {
			var appt = new blackberry.pim.Appointment();
			appt.location = WebWorks.sanitizeHTML(eventLocation);
			appt.freeBusy = blackberry.pim.Appointment.BUSY;
			appt.summary = eventName;
			appt.note = eventText;
			appt.start = eventStart;
			appt.end = eventEnd;
			var args = new blackberry.invoke.CalendarArguments(appt);
			args.view = blackberry.invoke.CalendarArguments.VIEW_NEW;
			blackberry.invoke.invoke(blackberry.invoke.APP_CALENDAR, args); // Calendar
			return true;

		},
		email : function(emailAddress, emailSubject, emailText, emailTime) {
			setTimeout(function(){
			var args = new blackberry.invoke.MessageArguments(emailAddress, emailSubject, emailText);
			  args.view = blackberry.invoke.MessageArguments.VIEW_NEW; // New
			  blackberry.invoke.invoke(blackberry.invoke.APP_MESSAGES, args);  // New Message
			},250);
			return true;
		},
		openInBrowser : function(url) {
			var args = new blackberry.invoke.BrowserArguments(url);
			blackberry.invoke.invoke(blackberry.invoke.APP_BROWSER, args);
			return true;
		},
        sanitizeHTML : function (string){
          //all this does for now is pull out <br> and replace them with \n
          return string.replace('<br>','\n').replace('<BR>','\n');

        },
        setup : function() {



            try{

            	//$("#pagetitle").width($(window).width());
            	blackberry.system.event.onHardwareKey(blackberry.system.event.KEY_BACK, handleBack);
                $(document).ready(function(){
                    $(document).bind('keyup',function(e){
                      if (e &&(e.which === 84 || e.which === 116)) {
                  		  showtoday();
                  	   }
                    })
                });
                var v5 = (navigator.userAgent.indexOf("WebKit") < 0);
                var touch = blackberry.system.hasCapability('input.touch');
                iScrollWorks = true;
                if(!touch || v5 || $(window).width() > $(window).height()){
                    //for not touch devices we need to move the sponser to the top
                    $('#mbutton').css('display','none');
                    $('#dbutton').css('display','none');
                    $('#tbutton').css('left','6px');
                    var trickAbout = function(e){
                    	showabout();
                    	e.stopPropagation();
        				return false;
                    }
                    if(!touch || v5){
	                 /*   	var about = $('#sponsorname');
		                    var footer = $('#footer');
		                    if($(window).width() < 400){
		                        // we need even more special logic for curves.  320x240 is horrable
		                        var head = $('#header > .toolbar');
		                        head.height(86);
		                        head.append(about.clone().css({'position':'absolute',"top":"43px"}).unbind('click').click(trickAbout));
		                    } else{
		                       // about.detach();
		                        $('h1').after((about.clone().unbind('click').click(trickAbout)));
		                    }
		                    var oldSetHeight =setHeight;
		                    setHeight = function(){
		                    	oldSetHeight();
		                    	$('#wscroller').height($('#scroller').height())
		                    };
		                    showtoday =  function(){
		                    	$("body").scrollTop(0);
		                    };
		                    setHeight();

		                   iScroll.prototype.scrollTo = function(x,y,t){
		                    	if(typeof x === 'number')
		                    		$("body").scrollTop(x);	
		                    	else
		                    		console.log(x);
		                    };
		                    iScroll.prototype.scrollToElement = function(el,t){
		                    	$("body").scrollTop($(el).offset().top);	
		                    };
	               */  
	             		 var oldSetHeight =setHeight;
		                    setHeight = function(){
		                    	oldSetHeight();
		                    	
		                    	$('.myScrollbarV').height($('#wscroller').height());
		                    };
	             		var bindScrollBar = function(){$('.myScrollbarV').unbind().bind('click', function(e){
	             		
						  var fullHeight = $('#scroller').height();
					      var offsetY = e.offsetY;
						 
						  var scrollY = offsetY/$(this).height() * fullHeight;
						  
						  var chunk = myScroll.wrapperH;

						  if(scrollY> -1*myScroll.y)
						  	myScroll.scrollTo(0, myScroll.y - chunk, 0);
						  else
						  	myScroll.scrollTo(0, myScroll.y + chunk, 0);
						})};

	             		myScroll = new iScroll('wscroller', { scrollbarClass: 'myScrollbar'});
	             		oldRef = myScroll.refresh;
	             		myScroll.refresh = function(){
		                    	oldRef.bind(this)();
		                    	bindScrollBar();
		                };

	             		setHeight();  
	             		bindScrollBar();
 
	                } else {
	                	initialize_iScroll();
	                }
	            } else {
	            	initialize_iScroll();
	            }
            } catch (e)
            {   console.log(JSON.stringify(e))     }
        },
        call : function(number){
        	  var args = new blackberry.invoke.PhoneArguments(number);
			  args.view = blackberry.invoke.PhoneArguments.VIEW_CALL;     
			  blackberry.invoke.invoke(blackberry.invoke.APP_PHONE, args);  
        }


    };
	try{
		if(!blackberry)
			$.noop();
	} catch(e){
		
  	  blackberry = {}; blackberry.system = {}; blackberry.system.event = {}; blackberry.system.event.onHardwareKey = $.noop; blackberry.system.hasCapability = function(){return false;};
  	}
    function handleBack() {
    	if($("#backbutton").css("display") != "none")
    		$("#backbutton").click();
    	else
    		blackberry.app.exit();
    	
    }

})()

// Device-specific code for the Android and iPhone
function device_initialize( )
{
   WebWorks.setup();   // Allows vertical middle to scroll up & down
}

function device_get_json( url )
{    
    $.getScript( url )
	.done(function(data, textStatus, jqxhr) {
		insert_city_events( );
	    })
	.fail(function(jqxhr, settings, exception) {
		alert( jqxhr.status + ": " + exception );
	    });
}

function device_add_event_to_calendar( data )
{
	/*

var data = {
	title: crop_string(hdf_strings[event[0]]), 
	location: crop_string(hdf_strings[event[2]]) + "\n" + crop_string(hdf_strings[event[3]]), 
	start_date: start_date_str, 
	end_date: end_date_str,
	description:  crop_string(hdf_strings[event[4]])
    };


	*/
    $.ajax( {
	    url: "/app/Settings/add_event", 
		data: data, 
		async: false, 
		type: "POST",
		success: function(xdata) {
	    }
	});

	var start_date = get_date_from_text(data.start_date);
	var end_date = get_date_from_text(data.end_date);
	if(data.start_hours){
		start_date.setHours(data.start_hours);
		start_date.setMinutes(data.start_minutes);
		if(data.end_hour){
			end_date.setHours(data.end_hour);
			end_date.setMinutes(data.end_minutes);
		} else {
			end_date.setHours(1+data.start_hours);
			end_date.setMinutes(data.start_minutes);
		}
	}

	WebWorks.addToCalender(data.title,data.description,data.location,start_date,end_date);
}

function device_open_url(newUrl)
{
    WebWorks.openInBrowser(newUrl);
}

function device_call_phone_number( number )
{
 	WebWorks.call(number);   
}

function device_send_email(emailAddress, subject, body)
{
	subject = decodeURIComponent(subject);
	body = decodeURIComponent(body);
    WebWorks.email(emailAddress, subject, body);
}

if (!Function.prototype.bind) {
  Function.prototype.bind = function (oThis) {
    if (typeof this !== "function") {
      // closest thing possible to the ECMAScript 5 internal IsCallable function
      throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
    }
 
    var aArgs = Array.prototype.slice.call(arguments, 1), 
        fToBind = this, 
        fNOP = function () {},
        fBound = function () {
          return fToBind.apply(this instanceof fNOP && oThis
                                 ? this
                                 : oThis,
                               aArgs.concat(Array.prototype.slice.call(arguments)));
        };
 
    fNOP.prototype = this.prototype;
    fBound.prototype = new fNOP();
 
    return fBound;
  };
}