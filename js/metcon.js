function getFavInfo(id){
	$.ajax({
		type: "POST",
		url: "server/post.php",
		data: {request: "favinfo",id: id, disableButton: $briefShown},
		success: function(data){
			$("#slide-prev").html(data);
			$("#favsave").button().click(function(){
				var title = $("input[name=edit-title]").val();
				var description = $("textarea[name=edit-description]").val();
				var url = $("input[name=edit-url]").val();
				var favgroup = $("select[name=favgroup]").val();
				var favid = $("input[name=favid]").val();
				var request = {request: "setfav",title:title, description: description, url:url, favgroup:favgroup,favid:favid};
				setFavInfo(request);
				
			});
			$("#favdelete").button().click(function(){
				var favid = $("input[name=favid]").val();
				request = {request: "deletefav", favid:favid};
				deleteFav(request);
			});
			$("#addtobrief").button().click(function(){
				var favid = $("input[name=favid]").val();
				request = {request: "addtobrief", favid:favid, briefid:$currentBrief};
				addToBrief(request);
			});
		}
	});
}

function addNewFav(id){
	$.ajax({
		type: "POST",
		url: "server/post.php",
		data: {request: "newfav",groupid:id},
		success: function(data){
			$("#slide-prev").html(data);
			$("#favadd").button().click(function(){
				var title = $("input[name=edit-title]").val();
				var description = $("textarea[name=edit-description]").val();
				var url = $("input[name=edit-url]").val();
				var favgroup = $("select[name=favgroup]").val();
				var favid = $("input[name=favid]").val();
				var request = {request: "setfav",title:title, description: description, url:url, favgroup:favgroup,favid:favid};
				setFavInfo(request);
				
			});
		}
	});
}

function loadBriefInfo(id){
	$.ajax({
		type: "POST",
		url: "server/post.php",  
		data: {request:"loadbriefinfo",briefid:id},
		success: function(data){
			$("#slide-prev").html(data);
			$("#save-brief-info").button().click(function(){
				var title = $("input[name=brief-title]").val();
				var description = $("textarea[name=brief-description]").val();
				var request = {request:"savebrief",briefid:$currentBrief,title:title,description:description};
				saveBriefing(request);
				loadBriefList();
			});
			$("#delete-briefing").button().click(function(){
				var a = confirm("Are you sure you wish to delete this briefing? This action cannot be undone!");
				if(a == true){
					var request = {request:"deletebrief",briefid:$currentBrief};
					deleteBriefing(request);
				}
			});
			
		}
	});	
}

function addBriefing(request){
	$.ajax({
		type: "POST",
		url: "server/post.php",  
		data: request,
		success: function(data){
			$("#slide-prev").html(data);
			$("#create-brief-info").button().click(function(){
				var title = $("input[name=brief-title]").val();
				var description = $("textarea[name=brief-description]").val();
				$currentBrief = -1;
				var unitid = $("input[name=current-unit]").val();
				var request = {request:"savebrief",briefid:$currentBrief,unitid:unitid,title:title,description:description};
				if($.trim(title) == ""){
					alert("You must provide a title for the briefing!");
				}else{
					saveBriefing(request);
				}		
			});
		}
	});	
}

function saveBriefing(request){
	$.ajax({
		type: "POST",
		url: "server/post.php",  
		data: request,
		success: function(data){
			loadBriefList();
		}
	});	
}

function deleteBriefing(request){
	$.ajax({
		type: "POST",
		url: "server/post.php",  
		data: request,
		success: function(data){
			$("#slide-prev").html("");
			$("#slide-window").html("");
			loadBriefList();
		}
	});	
}

function loadBriefList(){
	$.ajax({
		type: "POST",
		url: "server/post.php",  
		data: {request:"loadbrieflist",unit: $("input[name=current-unit]").val()},
		success: function(data){
			$("#brief-thumbs").html(data);
			$(".brief-thumb").click(function(){
				if($(this).attr("id") == "add-brief"){
					var id = $("input[name=current-unit]").val();
					var request = {request:"newbrief",unitid:id};
					addBriefing(request);
				}else{
					var id = $(this).attr("id").substr(5);
					$briefShown = "true";
					$currentBrief = id;
					getBriefingSlides(id);
					loadBriefInfo(id);
				}
			});
		}
	});	
}

function addToBrief(request){
	$.ajax({
		type: "POST",
		url: "server/post.php",
		data: request,
		success: function(data){
			$("#slide-window").html(data);
			$("#slide-window ul").sortable({
				update: function(){
					$("#slide-save").button("option","disabled",false);
					$("#slide-undo").button("option","disabled",false);
				}
			});
			$("#slide-window ul").disableSelection();
			
			$("#slide-save").button({disabled:true}).click(function(){
				var slidelength = $(".slide-list-item").length;
				var slides = $(".slide-list-item");
				var favs = new Array();
				for(var i = 0; i < slidelength; i++){
					favs[i] = $(slides[i]).children(".item-title").attr("id").substr(11);
				}
				var favstring = favs.toString();
				var request = {request: "slideorder",briefid:$currentBrief,favs: favstring};
				updateSlideOrder(request);
			});
			$("#slide-undo").button({disabled:true}).click(function(){
				getBriefingSlides($currentBrief);
			});
			
			$("#slide-remove").button().click(function(){
				var request = {request: "removeslide", slideid:$selectedSlide,briefid:$currentBrief};
				removeSlide(request);
			});
			$(".slide-list-item").click(function(){
				if($selectedSlide < 0){
					$("#slide-remove").button("option", "disabled", false);
					$(this).children(".item-title").css("background", "#303030");
					$selectedSlide = $(this).attr("id").substr(16);
				}else{
					var id = $(this).attr("id").substr(16);
					if($selectedSlide == id){
						$selectedSlide = -1;
						$("#slide-remove").button("option", "disabled", true);
						$(this).children(".item-title").css("background", "#101010");
					}else{
						$selectedSlide = id;
						$(".item-title").css("background","#101010");
						$(this).children(".item-title").css("background", "#303030");
					}
				}
				
			});
		}
	});
}

function deleteFav(request){
	$.ajax({
		type: "POST",
		url: "server/post.php",
		data: request,
		success: function(data){
			$("#slide-thumbs").html(data);
			$(".slide-thumb").click(function(){
				if($(this).hasClass("add-fav")){
					var id = $(this).attr("id").substr(8);
					//addNewFav(id);
				}else{
					var id = $(this).attr("id").substr(3);
					getFavInfo(id);
				}
			});
			if($briefShown){
				getBriefingSlides($currentBrief);
			}
		}
	});
}

function setFavInfo(request){
	$.ajax({
		type: "POST",
		url: "server/post.php",
		data: request,
		success: function(data){
			$("#slide-thumbs").html(data);
			$("#favadd").button("option","disabled",true);
			$(".slide-thumb").click(function(){
				if($(this).hasClass("add-fav")){
					var id = $(this).attr("id").substr(8);
					addNewFav(id);
				}else{
					var id = $(this).attr("id").substr(3);
					getFavInfo(id);
				}
			});
		}
	});
}

function removeSlide(request){
	$.ajax({
		type: "POST",
		url: "server/post.php",
		data: request,
		success: function(data){
			if(data == "success"){
				getBriefingSlides($currentBrief);
			}
		}
	});
}

function getBriefingSlides(id){
	$.ajax({
		type: "POST",
		url: "server/post.php",
		data: {request: "slides", id:id},
		success: function(data){
			$("#slide-window").html(data);
			$("#slide-window ul").sortable({
				update: function(){
					$("#slide-save").button("option","disabled",false);
					$("#slide-undo").button("option","disabled",false);
				}
			});
			$("#slide-window ul").disableSelection();
			
			$("#slide-save").button({disabled:true}).click(function(){
				var slidelength = $(".slide-list-item").length;
				var slides = $(".slide-list-item");
				var favs = new Array();
				for(var i = 0; i < slidelength; i++){
					favs[i] = $(slides[i]).children(".item-title").attr("id").substr(11);
				}
				var favstring = favs.toString();
				var request = {request: "slideorder",briefid:$currentBrief,favs: favstring};
				updateSlideOrder(request);
			});
			$("#slide-undo").button({disabled:true}).click(function(){
				getBriefingSlides($currentBrief);
			});
			
			$("#slide-remove").button().click(function(){
				var request = {request: "removeslide", slideid:$selectedSlide,briefid:$currentBrief};
				removeSlide(request);
			});
			$(".slide-list-item").click(function(){
				if($selectedSlide < 0){
					$("#slide-remove").button("option", "disabled", false);
					$(this).children(".item-title").css("background", "#303030");
					$selectedSlide = $(this).attr("id").substr(16);
				}else{
					var id = $(this).attr("id").substr(16);
					if($selectedSlide == id){
						$selectedSlide = -1;
						$("#slide-remove").button("option", "disabled", true);
						$(this).children(".item-title").css("background", "#101010");
					}else{
						$selectedSlide = id;
						$(".item-title").css("background","#101010");
						$(this).children(".item-title").css("background", "#303030");
					}
				}
				
			});
		}
	});
}

function updateSlideOrder(request){
	$.ajax({
		type: "POST",
		url: "server/post.php",  
		data: request,
		success: function(data){
			getBriefingSlides($currentBrief);
		}
	});
}
function detectResolution(){
	$screenHeight = window.screen.availHeight * 0.90;
	$screenWidth = window.screen.availWidth;
	$("#slide-list").css("width", $screenWidth + "px");
}

function showFirstSlide(){
	//$("iframe:first-of-type").show();
	$("iframe:first-child").show();
	$visible = 1;
	var numSlides = $("iframe").length;
	setEnd(numSlides);
}

function loadMenu(){
	
	detectResolution();
	$menu = new Array();
	$open = false;
	
	
	
	$menu[0] = "CONUS";
	$menu[1] = "CENTAF";
	
	
	$txt = "<ul>";
	
	$txt += "<li class='menu-item' id='" + $menu[0].toLowerCase() + "' onclick='loadconus()'>" + $menu[0] + "</li>";
	$txt += "<li class='menu-item' id='" + $menu[1].toLowerCase() + "' onclick='loadcentaf()'>" + $menu[1] + "</li>";
	
		
		$txt += "</ul></div>";
		
	$("#main-menu").html($txt);
}
/*
function loadconus(){
	hideMenu();
	$slides = new Array();
	$label = new Array();
	
	
	/*THE FOLLOWING LINES ARE VARIABLES THAT HOLD THE LINKS FOR THE CONUS SLIDES.
	TO ADD TO, DELETE FROM, OR CHANGE THE ORDER, SIMPLY UPDATE THE LIST. FOR MORE DETAILED INFORMATION, SEE THE BOTTOM OF THIS FILE.
	*/
	
	
	//COVER SLIDE
/*	$label[0] = "CONUS Morning METCON";
	$slides[0] = "http://i51.tinypic.com/29pdzee.jpg";
	
	//SLIDE 1
	$label[1] = "Water Vapor";
	$slides[1] = "https://weather.af.mil/AFW_WEBS/LowBandwidth/looper.php?BBOX=-127,24,-64,52&HEIGHT=422&WIDTH=800&CRS=CRS:84&LAYERS=LAND,CDFSII_GLOBAL_DISK_WV,BOUNDARIES&STYLES=default,default,yellow_boundaries&FULL_LOOP=TRUE&method=ob_loop#speed=500;dir=1;start=0;stop=61;play=false;refresh=off";
	
	//SLIDE 2
	$label[2] = "IR Satellite";
	$slides[2] = "https://weather.af.mil/AFW_WEBS/LowBandwidth/looper.php?BBOX=-127,24,-64,52&HEIGHT=422&WIDTH=800&CRS=CRS:84&LAYERS=LAND,CDFSII_GLOBAL_DISK_IR,BOUNDARIES&STYLES=default,GLOBAL_IR_MB,yellow_boundaries&FULL_LOOP=TRUE&method=ob_loop#speed=500;dir=1;start=0;stop=61;play=false;refresh=off";
	
	//SLIDE 3
	$label[3] = "Radar";
	$slides[3] = "https://weather.af.mil/AFW_WEBS/LowBandwidth/looper.php?BBOX=-127,24,-64,52&HEIGHT=422&WIDTH=800&CRS=CRS:84&LAYERS=LAND,NEXRAD_Radar,BOUNDARIES&STYLES=default,default,default&FULL_LOOP=TRUE&method=ob_loop#speed=500;dir=1;start=0;stop=16;play=true;refresh=off";
	
	//SLIDE 4
	$label[4] = "300MB Analysis";
	$slides[4] = "https://weather.af.mil/AFW_WEBS/LowBandwidth/looper.php?BBOX=-127,24,-64,52&HEIGHT=422&WIDTH=800&CRS=CRS:84&LAYERS=LAND,SLC_Upperair_300MB,BOUNDARIES&STYLES=default,default,default&FULL_LOOP=TRUE&method=ob_loop#speed=500;dir=1;start=2;stop=9;play=false;refresh=off";
	
	//SLIDE 5
	$label[5] = "500MB Analysis";
	$slides[5] = "https://weather.af.mil/AFW_WEBS/LowBandwidth/looper.php?BBOX=-127,24,-64,52&HEIGHT=422&WIDTH=800&CRS=CRS:84&LAYERS=LAND,SLC_Upperair_500MB,BOUNDARIES&STYLES=default,default,default&FULL_LOOP=TRUE&method=ob_loop#speed=500;dir=1;start=2;stop=9;play=false;refresh=off";

	//SLIDE 6
	$label[6] = "700MB Analysis";
	$slides[6] = "https://weather.af.mil/AFW_WEBS/LowBandwidth/looper.php?BBOX=-127,24,-64,52&HEIGHT=422&WIDTH=800&CRS=CRS:84&LAYERS=LAND,SLC_Upperair_700MB,BOUNDARIES&STYLES=default,default,default&FULL_LOOP=TRUE&method=ob_loop#speed=500;dir=1;start=2;stop=9;play=false;refresh=off";
	
	//SLIDE 7
	$label[7] = "850MB Analysis";
	$slides[7] = "https://weather.af.mil/AFW_WEBS/LowBandwidth/looper.php?BBOX=-127,24,-64,52&HEIGHT=422&WIDTH=800&CRS=CRS:84&LAYERS=LAND,SLC_Upperair_850MB,BOUNDARIES&STYLES=default,default,default&FULL_LOOP=TRUE&method=ob_loop#speed=500;dir=1;start=2;stop=9;play=false;refresh=off";

	//SLIDE 8
	$label[8] = "925MB Analysis";
	$slides[8] = "https://ows.barksdale.af.mil/index.cfm?fuseaction=sfc_ua_overlays&region=CONUS&region_list=CONUS,SECONUS&initial_level=925MB&parameter=ANALYSIS&UID=&BW=H&UF=M&AOR=1&USEHF=0";

	//SLIDE 9
	$label[9] = "SFC Analysis";
	$slides[9] = "https://ows.barksdale.af.mil/index.cfm?fuseaction=sfc_ua_overlays&region=CONUS&region_list=CONUS,SECONUS&initial_level=SFC&parameter=ANALYSIS&UID=&BW=H&UF=M&AOR=1&USEHF=0";
	
	//SLIDE 10
	$label[10] = "VIV";
	$slides[10] = "https://ows.barksdale.af.mil/by_type/text/index.cfm?fuseaction=showhtml&text_type=VIV-discussion&region=CONUS&UID=&BW=L&UF=M&AOR=1&USEHF=0";
	
	//SLIDE 11
	$label[11] = "GFS 500mb Vorticity";
	$slides[11] = "https://weather.af.mil/AFW_WEBS/LowBandwidth/looper.php?BBOX=-127,24,-64,52&HEIGHT=422&WIDTH=800&CRS=CRS:84&LAYERS=LAND,GFS_500MB,BOUNDARIES&STYLES=default,Absolute_Vorticity_Colorfill,default&RUN=LATEST&FORECAST=PT0S&FULL_LOOP=TRUE&method=forecast_loop#speed=500;dir=1;start=0;stop=29;play=false;refresh=off";
	
	//SLIDE 12
	$label[12] = "GFS SFC-THKNS/PCPN";
	$slides[12] = "https://weather.af.mil/AFW_WEBS/LowBandwidth/looper.php?BBOX=-127,24,-64,52&HEIGHT=422&WIDTH=950&CRS=CRS:84&LAYERS=LAND,GFS_SFC,BOUNDARIES&STYLES=default,default,default&RUN=LATEST&FORECAST=PT0S&FULL_LOOP=TRUE&method=forecast_loop#speed=500;dir=1;start=0;stop=29;play=false;refresh=off";
	
	//SLIDE 13
	$label[13] = "Severe WX";
	$slides[13] = "http://www.spc.noaa.gov/exper/mesoanalysis/new/archiveviewer.php?sector=17&parm=scp#";
	
	//SLIDE 14
	$label[14] = "KFBG Meteogram (WRF 2-Day)";
	$slides[14] = "https://tile3.weather.af.mil/services/WMS?REQUEST=GetMap&Styles=&DIM_STATION=KFBG&Layers=WRF15_CONUS_Meteogram_2day&CRS=CRS%3A1&VERSION=1%2E3%2E0&BBOX=0%2C0%2C1%2C1&WIDTH=989&SERVICE=WMS&HEIGHT=1680&FORMAT=image%2Fjpeg";

	//SLIDE 15
	$label[15] = "KFBG Meteogram (GFS 7-Day)";
	$slides[15] = "https://tile4.weather.af.mil/services/WMS?REQUEST=GetMap&Styles=&DIM_STATION=KFBG&Layers=GFS_Meteogram_Standard&CRS=CRS%3A1&VERSION=1%2E3%2E0&BBOX=0%2C0%2C1%2C1&WIDTH=989&SERVICE=WMS&HEIGHT=1680&FORMAT=image%2Fjpeg";
	
	//SLIDE 16
	$label[16] = "KFBG Meteogram (GFS 7-Day UA)";
	$slides[16] = "https://tile1.weather.af.mil/services/WMS?REQUEST=GetMap&Styles=&DIM_STATION=KFBG&Layers=GFS_Meteogram_7_day_UA_Profile&CRS=CRS%3A1&VERSION=1%2E3%2E0&BBOX=0%2C0%2C1%2C1&WIDTH=800&SERVICE=WMS&HEIGHT=800&FORMAT=image%2Fjpeg";
	
	//SLIDE 17
	$label[17] = "KFBG Range Forecast";
	$slides[17] = "http://pao.bragg.army.mil/www-wx/fcstrfiles/LRF.pdf";
	
	//SLIDE 18
	$label[18] = "5-day PPT";
	$slides[18] = "http://pao.bragg.army.mil/www-wx/fcstrfiles/5DAY.pdf";
	
	//SLIDE 19
	$label[19] = "Detachment 5 Day Forecast";
	$slides[19] = "https://afkm.wpafb.af.mil/ASPs/docman/DOCMain.asp?Tab=0&FolderID=AC-OP-00-33-28-8&Filter=AC-OP-00-33";
	
	//SLIDE 20
	$label[20] = "Questions";
	$slides[20] = "file:///C:\Users\michael.e.rudd\workspace\METCON\WebContent\Questions.html";
	
	setEnd($slides);
	
/*****THIS PART SCANS THE VARIABLES AND CREATES THE SLIDES********/
/*	alert("Please select the e-mail certificate when asked to log in to the following sites!");
	$content = "<div id='cover'><img src='" + $slides[0] + "' width='800' alt='Battle Field Weather Briefings (If this text is displayed, double-check your internet connection)'/></div>";//Opening Slide
	var max = $slides.length;
	for (var i = 1; i < max - 1; i++){
		$content += "<iframe src='" + $slides[i] + "' id='" + i + "' height='" + $screenHeight + "' width='95%'></iframe>";
	}
   
   $("#content-pane").html($content);
   $("#menu-container").slideToggle();
   
   $filmstrip = "<ul>";
   
   if(max > 1){
	   for(var i = 0; i < max; i++){
		   $filmstrip += "<li><div class='frame' id='frame" + i + "' onclick='selectSlide(" + i + ")'>" + $label[i] + "</div></li>";
	   }
   }
   
   $filmstrip += "</ul>";
   $("#slide-list").html($filmstrip);
}*/
/*
function loadcentaf(){
	hideMenu();
	$slides = new Array();
	$label = new Array();
	$visible = 0;
	
	/*THE FOLLOWING LINES ARE VARIABLES THAT HOLD THE LINKS FOR THE CONUS SLIDES.
	TO ADD TO, DELETE FROM, OR CHANGE THE ORDER, SIMPLY UPDATE THE LIST. FOR MORE DETAILED INFORMATION, SEE THE BOTTOM OF THIS FILE.
	*/
	
	
	//COVER SLIDE
/*	$label[0] = "CENTAF Morning METCON";
	$slides[0] = "http://heli.brixtonjunkies.com/wp-content/uploads/2009/09/kopp-etchells-4.jpg";
	
	//SLIDE 1
	$label[1] = "WATER VAPOR";
	$slides[1] = "https://ows.sc.afcent.af.mil/looper/index.cfm?fuseaction=auto_loop&look_id=80494&maximages=12";
	
	//SLIDE 2
	$label[2] = "IR SATELLITE";
	$slides[2] = "https://ows.sc.afcent.af.mil/looper/index.cfm?fuseaction=auto_loop&look_id=36245&maximages=12";
	
	//SLIDE 3
	$label[3] = "VIS SATELLITE";
	$slides[3] = "https://ows.sc.afcent.af.mil/looper/index.cfm?fuseaction=auto_loop&look_id=36243&maximages=12";
	
	//SLIDE 4
	$label[4] = "300MB Analysis";
	$slides[4] = "https://weather.af.mil/AFW_WEBS/LowBandwidth/looper.php?BBOX=20,2,85,58&HEIGHT=646&WIDTH=750&CRS=CRS:84&LAYERS=LAND,SLC_Upperair_300MB,BOUNDARIES&STYLES=default,default,default&FULL_LOOP=TRUE&method=ob_loop#speed=500;dir=1;start=2;stop=9;play=false;refresh=off";
	
	//SLIDE 5
	$label[5] = "500MB ANALYSIS";
	$slides[5] = "https://weather.af.mil/AFW_WEBS/LowBandwidth/looper.php?BBOX=20,2,85,58&HEIGHT=646&WIDTH=750&CRS=CRS:84&LAYERS=LAND,SLC_Upperair_500MB,BOUNDARIES&STYLES=default,default,default&FULL_LOOP=TRUE&method=ob_loop#speed=500;dir=1;start=2;stop=9;play=false;refresh=off";
	
	//SLIDE 6
	$label[6] = "700MB ANALYSIS";
	$slides[6] = "https://weather.af.mil/AFW_WEBS/LowBandwidth/looper.php?BBOX=20,2,85,58&HEIGHT=646&WIDTH=750&CRS=CRS:84&LAYERS=LAND,SLC_Upperair_700MB,BOUNDARIES&STYLES=default,default,default&FULL_LOOP=TRUE&method=ob_loop#speed=500;dir=1;start=2;stop=9;play=false;refresh=off";
	
	//SLIDE 7
	$label[7] = "850MB ANALYSIS";
	$slides[7] = "https://weather.af.mil/AFW_WEBS/LowBandwidth/looper.php?BBOX=20,2,85,58&HEIGHT=646&WIDTH=750&CRS=CRS:84&LAYERS=LAND,SLC_Upperair_850MB,BOUNDARIES&STYLES=default,default,default&FULL_LOOP=TRUE&method=ob_loop#speed=500;dir=1;start=2;stop=9;play=false;refresh=off";
	
	//SLIDE 8
	$label[8] = "FORECASTED 500MB VORTICITY";
	$slides[8] = "https://weather.af.mil/AFW_WEBS/LowBandwidth/looper.php?BBOX=20,2,85,58&HEIGHT=646&WIDTH=750&CRS=CRS:84&LAYERS=LAND,GFS_500MB,BOUNDARIES&STYLES=default,Absolute_Vorticity_Colorfill,default&RUN=LATEST&FORECAST=PT0S&FULL_LOOP=TRUE&method=forecast_loop#speed=500;dir=1;start=0;stop=29;play=false;refresh=off";
	
	//SLIDE 9
	$label[9] = "FORECASTED 700MB";
	$slides[9] = "https://weather.af.mil/AFW_WEBS/LowBandwidth/looper.php?BBOX=20,2,85,58&HEIGHT=646&WIDTH=750&CRS=CRS:84&LAYERS=LAND,GFS_700MB,BOUNDARIES&STYLES=default,default,default&RUN=LATEST&FORECAST=PT0S&FULL_LOOP=TRUE&method=forecast_loop#speed=500;dir=1;start=0;stop=29;play=false;refresh=off";
	
	//SLIDE 10
	$label[10] = "FORECASTED HWD OIF";
	$slides[10] = "https://ows.sc.afcent.af.mil/looper/index.cfm?fuseaction=auto_loop&look_id=108126,149715,124555,149719,31732,149725,124556,149726,31734,149729,149731,31736,68944,68947,68945,68946&model=y";
	
	//SLIDE 11
	$label[11] = "FORECASTED HWD OEF";
	$slides[11] = "https://ows.sc.afcent.af.mil/looper/index.cfm?fuseaction=auto_loop&look_id=87505,149538,115092,149539,36917,149540,115093,149541,36922,149542,149543,36924,57837,57840,57831,57834&model=y";
	
	//SLIDE 12
	$label[12] = "CURRENT CONDITIONS";
	$slides[12] = "https://ows.sc.afcent.af.mil/index.cfm?fuseaction=displaySiteWatch1&showclass=1&BW=H&UF=M&AOR=2&AOI=2&sc=150526&bases=KQSA%2CKQL5%2CKQD9%2COAKN%2CKQLT%2CKQAR%2CKQSN%2CKQA4&refreshtime=180&ob=1&taf=1&wwa=1&showmet=1&showcrit=1";
	
	//SLIDE 13
	$label[13] = "Questions";
	$slides[13] = "Questions?";
	
	setEnd($slides);

/*****THIS PART SCANS THE VARIABLES AND CREATES THE SLIDES********/
/*   $content = "<div id='cover'><img src='" + $slides[0] + "' width='800' alt='Battle Field Weather Briefings (If this text is displayed, double-check your internet connection)'/></div>";//Opening Slide
   var max = $slides.length;
   for (var i = 1; i < max - 1; i++){
   $content += "<iframe src='" + $slides[i] + "' id='" + i + "' height='" + $screenHeight + "' width='95%'></iframe>";
   }
   
   $("#content-pane").html($content);
   $("#menu-container").slideToggle();
   
   $filmstrip = "<ul>";
   
   if(max > 1){
	   for(var i = 0; i < max; i++){
		   $filmstrip += "<li><div class='frame' id='frame" + i + "' onclick='selectSlide(" + i + ")'>" + $label[i] + "</div></li>";
	   }
   }
   
   $filmstrip += "</ul>";
   $("#slide-list").html($filmstrip);
}*/

/**************UPDATE INSTRUCTIONS********************


The lines that start with 'label' are the title/name of the slide.

The lines that start with 'conus' are the link to the page to be displayed.

The numbers in the brackets for each represent the slide number. For example: 'label[1]' is the title for the first slide, and 'conus[1]' is the link for the first slide.

Each line MUST follow the following format: variable = "link/title"; 
The title or link must be in quotation marks and the line must end in semi-colon.

Example: 

label[30] = "Sample Slide"; <---- Represents slide number 30 with the title of "Sample Slide"
slides[30] = "http://www.yahoo.com"; <------ Represents slide number 30 with the desired link of "http://www.yahoo.com"

******************************************************/
function setEnd(numSlides){
	$index = 1;
	var w = $("#slide-list").css("width");
	var sub = parseInt(w.substr(0,w.indexOf("p")),10);
	var maxSlides = Math.floor(sub/65);
	$end = 0;
	if(maxSlides >= numSlides){
		$end = 1;
	}else if(maxSlides < numSlides){
		if(numSlides%2 == 0)
			$end = (numSlides+2) - maxSlides;
		else
			$end = (numSlides+3) - maxSlides;
	}
}

function selectSlide($frame){
	if($visible != $frame && $visible != 0){
		$("#" + $visible).css("display", "none");
		$("#frame" + $visible).css("border", "5px black solid");
		$visible = $frame;
		if($frame == 0){
			$("#cover").css("display", "inline");
		}else
			$("#" + $visible).css("display", "inline");
		
		//$("#label").html($label[$visible]);
		$("#frame" + $visible).css("border-top", "5px red solid");
		$("#frame" + $visible).css("border-bottom", "5px red solid");
	}else if($visible != $frame && $visible == 0){
		$("#frame" + $visible).css("border", "5px black solid");
		$visible = $frame;
		$("#cover").css("display", "none");
		$("#" + $visible).css("display", "inline");
		//$("#label").html($label[$visible]);
		$("#frame" + $visible).css("border-top", "5px red solid");
		$("#frame" + $visible).css("border-bottom", "5px red solid");
	}
}

function slideLeft(){
	if($index > $end || $end == 1){
		
	}else{
		$("#slide-list ul").animate({left: "-=65px"});
		++$index;
	}
}

function slideRight(){
	if($index <= 1){
		
	}else{
		$("#slide-list ul").animate({left: "+=65px"});
		--$index;
	}
}

