<?php 
require "dbfunctions.php";
if(isset($_POST['request'])){
	$type = sanitizeString($_POST['request']);
	if($type == "favinfo"){
		$id = sanitizeString($_POST['id']);
		$briefShown = sanitizeString($_POST['disableButton']);
		$disabled = "";
		if($briefShown == "true"){
		}else{
			$disabled = "disabled";	
		}		
		$query = "SELECT * FROM favorites WHERE id='$id'";
		$result = queryMysql($query);
		if(mysql_num_rows($result)){
			$row = mysql_fetch_row($result);
			$query1 = "SELECT id,name FROM favgroup";
			$result1 = queryMysql($query1);
			$options = "";
			for($i = 0; $i < mysql_num_rows($result1); $i++){
				$selected = "";
				$row1 = mysql_fetch_row($result1);
				if($row[5] == $row1[0]){
					$selected = "selected";
				}
				$options .= "<option value='$row1[0]' $selected>$row1[1]</option>";
			}
			echo "
			<iframe src='$row[2]' class='prev-frame'></iframe>
			<div id='fav-edit'>
				<div id='fav-edit-top'>
				<h3>$row[3] <a href='$row[2]' target='_blank'><img src='img/new_window.png' height='15'/></a></h3>
				<p style='border-bottom:1px black solid;font-size:12px;'>$row[4]</p>
				<label for='edit-title'>Title: </label><input type='text' name='edit-title' value='$row[3]'/><br><br>
				<label for='edit-description'>Description</label><br>
				<textarea name='edit-description' cols='40' rows='5'>$row[4]</textarea><br><br>
				<label for='edit-url'>URL: </label><input type='url' name='edit-url' value='$row[2]' size='40'/><br><br>
				<label for='favgroup'>Group: </label><select name='favgroup'>$options
				</select><br><br>
				<input type='hidden' value='$row[0]' name='favid' />
				</div><!--end fav-edit-top -->
				<div id='fav-edit-bottom'>
				<button id='favsave'>Save</button><button id='favdelete'>Delete</button><button id='addtobrief' $disabled>Add To Brief</button>
				</div><!--end fav-edit-bottom -->
			</div>
			";
		}
		
	}else if($type == "slides"){
		$id = sanitizeString($_POST['id']);
		$query = "SELECT id,favorites_id FROM slides WHERE briefings_id='$id'";
		$result = queryMysql($query);
		if(mysql_num_rows($result)){
			$html = "
			<p style='font-size:12px;text-align:left;'>To re-order the slides, simply drag and drop the slides into a new order and click \"Save\". To revert to the original order (before saving), click, \"Undo\". To remove a slide, click the slide and click \"Remove\".</p>
			<button id='slide-save'>Save<span class='ui-icon ui-icon-disk' style='float:right;'></span></button><button id='slide-undo'>Undo<span class='ui-icon ui-icon-arrowreturnthick-1-w' style='float:right;'></span></button><button id='slide-remove' disabled>Remove<span class='ui-icon ui-icon-trash' style='float:right;'></span></button> 
			<ul>
			";
			$num = mysql_num_rows($result);
			for($i = 0; $i < $num; $i++){
				$row = mysql_fetch_row($result);
				$query1 = "SELECT id,title FROM favorites WHERE id='$row[1]'";
				$result1 = queryMysql($query1);
				$row1 = mysql_fetch_row($result1);
				$title = $row1[1];
				$order = $i + 1;
				$html .= "
				<li><div id='slide-list-item-$row[0]' class='slide-list-item'><div id='slide-icon-$order' class='slide-icon'>$order</div><span id='item-title-$row1[0]' class='item-title'>$title</span></div></li>
				";
			}
			$html .= "</ul>";
			echo $html;
		}else{
			echo "No slides have been added to this briefing";
		}
	}else if($type == "setfav"){
		$title = sanitizeString($_POST['title']);
		$description = sanitizeString($_POST['description']);
		$url = sanitizeString($_POST['url']);
		$favgroup = sanitizeString($_POST['favgroup']);
		$favid = sanitizeString($_POST['favid']);
		$query = "";
		if($favid > -1){
			$query = "UPDATE favorites SET title='$title',description='$description',url='$url',favgroup_id='$favgroup' WHERE id='$favid'";
		}else{
			$query = "INSERT INTO favorites (url,title,description,favgroup_id) VALUES ('$url','$title','$description','$favgroup')";
		}
		$result = queryMysql($query);
		if($result){
			$slidethumbs = "";
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
	   			echo $slidethumbs;
	   		}
		
		}else{
			echo "Error";
		}
		
	}else if($type == "deletefav"){
		$favid = sanitizeString($_POST['favid']);
		$query = "DELETE FROM favorites WHERE id='$favid'";
		$result = queryMysql($query);
		if($result){
			$slidethumbs = "";
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
				echo $slidethumbs;
			}
		}
	}else if($type == "addtobrief"){
		$favid = sanitizeString($_POST['favid']);
		$briefid = sanitizeString($_POST['briefid']);
		$query = "INSERT INTO slides (favorites_id,briefings_id) VALUES ('$favid','$briefid')";
		$result = queryMysql($query);
		if($result){
			$query = "SELECT id,favorites_id FROM slides WHERE briefings_id='$briefid'";
			$result = queryMysql($query);
			if(mysql_num_rows($result)){
				$html = "
				<p style='font-size:12px;text-align:left;'>To re-order the slides, simply drag and drop the slides into a new order and click \"Save\". To revert to the original order (before saving), click, \"Undo\". To remove a slide, click the slide and click \"Remove\".</p>
				<button id='slide-save'>Save<span class='ui-icon ui-icon-disk' style='float:right;'></span></button><button id='slide-undo'>Undo<span class='ui-icon ui-icon-arrowreturnthick-1-w' style='float:right;'></span></button><button id='slide-remove' disabled>Remove<span class='ui-icon ui-icon-trash' style='float:right;'></span></button>
				<ul>
				";
				$num = mysql_num_rows($result);
				for($i = 0; $i < $num; $i++){
					$row = mysql_fetch_row($result);
					$query1 = "SELECT id,title FROM favorites WHERE id='$row[1]'";
					$result1 = queryMysql($query1);
					$row1 = mysql_fetch_row($result1);
					$title = $row1[1];
					$order = $i + 1;
					$html .= "
					<li><div id='slide-list-item-$row[0]' class='slide-list-item'><div id='slide-icon-$order' class='slide-icon'>$order</div><span id='item-title-$row1[0]' class='item-title'>$title</span></div></li>
					";
				}
				$html .= "</ul>";
				echo $html;
			}else{
				echo "No slides have been added to this briefing";
			}
		}
	}else if($type == "removeslide"){
		$slideid = sanitizeString($_POST['slideid']);
		$query = "DELETE FROM slides WHERE id='$slideid'";
		$result = queryMysql($query);
		if($result){ echo "success";
		}else{
			echo "fail";
		}
	}else if($type == "slideorder"){
		$favs = explode(",",$_POST['favs']);
		$briefid = sanitizeString($_POST['briefid']);
		$query = "SELECT id FROM slides WHERE briefings_id='$briefid'";
		$result = queryMysql($query);
		if(mysql_num_rows($result)){
			for($i = 0; $i < mysql_num_rows($result); $i++){
				$row = mysql_fetch_row($result);
				$id = $row[0];
				$query1 = "UPDATE slides SET favorites_id='$favs[$i]' WHERE id='$id'";
				$result1 = queryMysql($query1);
			}
			echo "success";
		}else{
			echo $favs;
		}
		
	}else if($type == "loadbriefinfo"){
		$id = sanitizeString($_POST['briefid']);
		$query = "SELECT description,title FROM briefings WHERE id='$id'";
		$result = queryMysql($query);
		if(mysql_num_rows($result)){
			$row = mysql_fetch_row($result);
			echo "
			Briefing Title: <input type='text' name='brief-title' value='$row[1]'/><hr>
			Description<br><textarea cols='40' rows='5' name='brief-description'>$row[0]</textarea><br>
			<button id='save-brief-info'>Save<span class='ui-icon ui-icon-disk' style='float:right;'></span></button><button id='delete-briefing'>Delete<span class='ui-icon ui-icon-trash' style='float:right;'></span></button>
			";
		}
	}else if($type == "deletebrief"){
		$id = sanitizeString($_POST['briefid']);
		$query = "DELETE FROM briefings WHERE id='$id'";
		$result = queryMysql($query);
		if($result){
			echo "success";
		}
	}else if($type == "loadbrieflist"){
		$briefthumbs = "";
		$unit_id = sanitizeString($_POST['unit']);
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
   		echo $briefthumbs;
	}else if($type == "savebrief"){
		$id = sanitizeString($_POST['briefid']);
		$title = sanitizeString($_POST['title']);
		$desc = sanitizeString($_POST['description']);
		$briefid = sanitizeString($_POST['briefid']);
		$unitid = -1;
		if($briefid == -1){
			$unitid = sanitizeString($_POST['unitid']);
			$query = "INSERT INTO briefings (unit_id,description,title) VALUES ('$unitid','$desc','$title')";
			$result = queryMysql($query);
		}else{
			$query = "UPDATE briefings SET title='$title',description='$desc' WHERE id='$id'";
			$result = queryMysql($query);
		}
		echo "success";
	}else if($type == "newbrief"){
		$id = sanitizeString($_POST['unitid']);
		echo "
		Briefing Title: <input type='text' name='brief-title' value=''/><hr>
		Description<br><textarea cols='40' rows='5' name='brief-description'></textarea><br>
		<button id='create-brief-info'>Create<span class='ui-icon ui-icon-disk' style='float:right;'></span></button>
		";
	}else if($type == "newfav"){
		$groupid = sanitizeString($_POST['groupid']);
		$query1 = "SELECT id,name FROM favgroup";
		$result1 = queryMysql($query1);
		$options = "";
		for($i = 0; $i < mysql_num_rows($result1); $i++){
			$selected = "";
			$row1 = mysql_fetch_row($result1);
			if($groupid == $row1[0]){
				$selected = "selected";
			}
			$options .= "<option value='$row1[0]' $selected>$row1[1]</option>";
		}
		echo "
		<iframe src='' class='prev-frame'></iframe>
		<div id='fav-edit'>
		<div id='fav-edit-top'>
		<label for='edit-title'>Title: </label><input type='text' name='edit-title'/><br><br>
		<label for='edit-description'>Description</label><br>
		<textarea name='edit-description' cols='40' rows='5'></textarea><br><br>
		<label for='edit-url'>URL: </label><input type='url' name='edit-url' size='40'/><br><br>
		<label for='favgroup'>Group: </label><select name='favgroup'>$options
		</select><br><br>
		<input type='hidden' value='-1' name='favid' />
		</div><!--end fav-edit-top -->
		<div id='fav-edit-bottom'>
		<button id='favadd'>Add</button>
		</div><!--end fav-edit-bottom -->
		</div>
		";
	}
}
?>