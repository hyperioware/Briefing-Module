<?php require_once("server/dbfunctions.php"); ?>
<!DOCTYPE html>
<html>
<head>
<title>Battlefield Weather Briefing Module</title>
<link rel="stylesheet" href="styles/metcon.css"/>
<link rel="stylesheet" href="ui/css/ui-lightness/jquery-ui-1.10.3.custom.min.css"/>
<script src="js/jquery-1.8.2.min.js"></script>
<script src="ui/jquery-ui-1.10.3.custom/js/jquery-ui-1.10.3.custom.min.js"></script>
<script src="js/jquery.slimscroll.min.js"></script>
<script src="js/metcon.js"></script>
<script>
	$(document).ready(function(){
		
		$("#slide-list").click(function(e){
			var x = e.pageX - this.offsetLeft;
			var w = $("#slide-list").css("width");
			var sub = parseInt(w.substr(0,w.indexOf("p")),10);
			if(x < sub * .50){
				slideRight();
			}else if(x > sub*.50){
				slideLeft();
			}
		});
		$menuVisible = false;
		$currentMenu = "";
		$("#briefings").click(function(){

			if($currentMenu != "briefings"){
				if(!$menuVisible){
					$("#briefings ul").show();
					$("#briefings a.menuitem").css("background","#CCC");
					$("#briefings a.menuitem").css("color","black");
					$menuVisible = true;
					$currentMenu  = "briefings";
				}else{
					$(".submenu").hide();
					$("a.menuitem").css("background","#101010");
					$("a.menuitem").css("color","white");
					$("#briefings ul").show();
					$("#briefings a.menuitem").css("background","#CCC");
					$("#briefings a.menuitem").css("color","black");
					$currentMenu = "briefings";
				}
			}else{
				$("#briefings ul").hide();
				$("#briefings a.menuitem").css("background","#101010");
				$("#briefings a.menuitem").css("color","white");
				$currentMenu = "";
				$menuVisible = false;
			}
		});

		$("#favorites").click(function(){
			if($currentMenu != "favorites"){
				if(!$menuVisible){
					$("#favorites dl").show();
					$("#favorites a.menuitem").css("background","#CCC");
					$("#favorites a.menuitem").css("color","black");
					$menuVisible = true;
					$currentMenu  = "favorites";
				}else{
					$(".submenu").hide();
					$("a.menuitem").css("background","#101010");
					$("a.menuitem").css("color","white");
					$("#favorites a.menuitem").css("background","#CCC");
					$("#favorites a.menuitem").css("color","black");
					$("#favorites dl").show();
					$currentMenu = "favorites";
				}
			}else{
				$("#favorites dl").hide();
				$("#favorites a.menuitem").css("background","#101010");
				$("#favorites a.menuitem").css("color","white");
				$currentMenu = "";
				$menuVisible = false;
			}
		});
		
		detectResolution();
		showFirstSlide();
	});
</script>
</head>
<body>
	<div id="header">
		<div id="main-menu">
		<ul>
			<li id="home"><a href="index.php" class='menuitem'>Home</a></li>
			<li id="briefings"><a href="#" class='menuitem'>Briefings</a>
				<ul class="submenu">
			<?php 
			$query = "SELECT id,title FROM briefings";
			$result = queryMysql($query);
			if(mysql_num_rows($result)){
				$rows = mysql_num_rows($result);
				for($i = 0; $i < $rows; $i++){
					$row = mysql_fetch_row($result);
					echo "<li><a href='index.php?briefing=$row[0]'>$row[1]</a></li>";
				}
			}
			?>
			</ul>
			</li>
			<li id="favorites"><a href="#" class='menuitem'>Favs</a>
				<dl class="submenu">
				<?php 
				$query = "SELECT * FROM favgroup";
				$result = queryMysql($query);
				if(mysql_num_rows($result)){
					$rows = mysql_num_rows($result);
					for($i = 0; $i < $rows; $i++){
						$data = mysql_fetch_row($result);
						echo "<dt><strong>$data[1]</strong></dt>";
						$query1 = "SELECT title,url FROM favorites WHERE favgroup_id='$data[0]'";
						$result1 = queryMysql($query1);
						$rows1 = mysql_num_rows($result1);
						if($rows1){
							for($a = 0; $a < $rows1; $a++){
								$data1 = mysql_fetch_row($result1);
								echo "<dd><a href='$data1[1]' target='_blank'>$data1[0]</a></dd><br>";
							}
						}else{
							echo "<dd><i>None found</i></dd>";
						}
					}
				}
				?>
				</dl>
			</li>
			<li id="edit"><a href="briefings.php" class='menuitem'>Edit</a></li>
		</ul>
		</div>
	</div>
   <div id="wrapper">
   <div id="content-pane" >
   <?php 
   $filmstrip = "<ul>";
   if(isset($_GET['briefing'])){
		$briefing_id = sanitizeString($_GET['briefing']);
		$query = "SELECT * FROM slides WHERE briefings_id='$briefing_id'";
		$result = queryMysql($query);
		if(mysql_num_rows($result)){
			$rows = mysql_num_rows($result);
			$content = "";
			
			for($i = 0; $i < $rows; $i++){
				$row = mysql_fetch_row($result);
				$fav_id = $row[1];
				$query = "SELECT * FROM favorites WHERE id='$fav_id'";
				$result1 = queryMysql($query);
				$fav = mysql_fetch_row($result1);
				$slide_id = $i + 1;
				$content .= "<iframe src='".$fav[2]."' id='".$slide_id."' class='slide-iframe' height='95%' width='95%'></iframe>";
				$filmstrip .= "<li><div class='frame' id='frame".$slide_id."' onclick='selectSlide(".$slide_id.")'>".$fav[3]."</div></li>";
			}
			echo $content;
		}else{
			echo "<br><hr><br>The briefing you requested is invalid.";
		}
   }else{
   		echo "
   		<h1>Welcome!</h1>
   		<dl style='text-align:left;'>
   			<dt><b>Quick Tip</b></dt>
   			<dd>If you are experiencing problems with the layout and you are using Internet Explorer (particularly IE 9 and earlier), check the compatibility button next to your address bar at the top! Make sure it's not selected, as using it may cause display problems!</dd>
   		</dl>
   		";
   }
   $filmstrip .= "</ul>";
   ?>
   </div><!--end of content-pane-->
   </div><!-- end wrapper -->
     <div id="thumbnail-pane">
  		<div id="slide-list"><?php echo $filmstrip; ?></div>
   </div><!--end of thumbnail-pane-->
   <div id="main-menu"></div>
   
</body>
</html>