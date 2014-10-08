<?php require_once("server/dbfunctions.php"); ?>
<!DOCTYPE html>
<html>
<head>
<title>Battlefield Weather Briefing Module - Edit Briefings</title>
<link rel="stylesheet" href="styles/metcon.css"/>
<link rel="stylesheet" href="ui/jquery-ui-1.10.3.custom/css/ui-lightness/jquery-ui-1.10.3.custom.min.css"/>
<!--[if IE]>
<style>
.prev-frame {
    zoom: 1.0;
    height: 200px;
    width: 240px;
}

#slide-window ul li:hover{
	background: #909090;
}
</style>
<![endif]-->
<script src="js/jquery-1.8.2.min.js"></script>
<script src="ui/jquery-ui-1.10.3.custom/js/jquery-ui-1.10.3.custom.min.js"></script>
<script src="js/metcon.js"></script>
<script>
	$(document).ready(function(){
		$briefShown = "false";
		$currentBrief = 0;
		$selectedSlide = -1;
		$slideOrderChanged = false;
		$("#unit-list").change(function(){
			var id = $("#unit-list").val();
			window.location.replace("briefings.php?unit=" + id);
		});

		$(".slide-thumb").click(function(){
			if($(this).hasClass("add-fav")){
				var id = $(this).attr("id").substr(8);
				addNewFav(id);
			}else{
				var id = $(this).attr("id").substr(3);
				getFavInfo(id);
			}
		});

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

		
	});
</script>
</head>
<body>
	<div id="header">
		<div id="main-menu">
		<ul>
			<li id="home"><a href="index.php" class='menuitem'>Home</a></li>
			<li id="edit"><a href="briefings.php" class='menuitem'>Edit</a></li>
			<?php 
			$query = "SELECT id,unit_name FROM units";
			$result = queryMysql($query);
			if(mysql_num_rows($result)){
				echo "<li><select id='unit-list'>
						<option value='' selected disabled>Select Unit</option>";
				$rows = mysql_num_rows($result);
				for($i = 0; $i < $rows; $i++){
					$data = mysql_fetch_row($result);
					echo "<option value='$data[0]'>$data[1]</option>";
				}
				echo "</select></li>";
			}
			?>
		</ul>
		</div>
	</div>
   <div id="wrapper">
   <div id="content-pane" >
   <?php
   $unit = 0;
   if(isset($_GET['unit'])){
   		$unit = sanitizeString($_GET['unit']);
   }
   $briefthumbs = "";
   $favthumbs = "";
   $slidethumbs = "";  
   if(isset($_GET['unit'])){
   		$unit_id = sanitizeString($_GET['unit']);
   		$query = "SELECT id,title FROM briefings WHERE unit_id='$unit_id'";
   		$result = queryMysql($query);
   		$briefthumbs .= "<ul>";
   		if(mysql_num_rows($result)){
   			$num = mysql_num_rows($result);
   			for($i = 0; $i < $num; $i++){
   				$row = mysql_fetch_row($result);
   				$title = $row[1];
   				$id = $row[0];
   				$briefthumbs .= "<li><div class='brief-thumb' id='brief$id'>$title</div></li>";
   			}
   		}
   		$briefthumbs .= "<li><div id='add-brief' class='brief-thumb'><img src='img/file_add_ghost.png' draggable='false' alt='Add' height='50'/></div></li>";
   		$briefthumbs .= "</ul>";
   		
   		$query = "SELECT id,name FROM favgroup";
   		$result = queryMysql($query);
   		if(mysql_num_rows($result)){
   			$groups = mysql_num_rows($result);
   			for($i = 0; $i < $groups; $i++){
   				$row = mysql_fetch_row($result);
   				$slidethumbs .= "<span class='group-header'>$row[1]</span><br>";
   				$slidethumbs .= "<ul>";
   				$query1 = "SELECT id,title FROM favorites WHERE favgroup_id='$row[0]'";
   				$result1 = queryMysql($query1);
   				if(mysql_num_rows($result1)){
   					$num = mysql_num_rows($result1);
   					for($a = 0; $a < $num; $a++){
   						$row1 = mysql_fetch_row($result1);
   						$slidethumbs .= "<li><div id='fav$row1[0]' class='slide-thumb'>$row1[1]</div></li>";
   					}
   				}
   				$slidethumbs .= "<li><div id='add-fav-$row[0]' class='slide-thumb add-fav'><img src='img/file_add_ghost.png' draggable='false' alt='Add' height='35'/></div></li>";
   				$slidethumbs .= "</ul>";
   			}
   		}
   		echo "
   		<div id='brief-thumbs'>$briefthumbs</div>
   		<div id='slide-thumbs'>$slidethumbs</div>
   		<input type='hidden' name='current-unit' value='$unit' />
   		<div id='slide-window'></div>
   		<div id='slide-prev'></div>
   		";
   }
   ?>
   </div><!--end of content-pane-->
   </div><!-- end wrapper -->
   <div id="main-menu"></div>
   
</body>
</html>