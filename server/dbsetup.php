<?php

	include_once 'dbfunctions.php';
	echo "<h3>Setting Up...</h3>";
	
	//CREATE THE UNITS TABLE
	createTable("units","id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, unit_name VARCHAR(255), INDEX(unit_name)");
	
	//CREATE THE BRIEFINGS TABLE
	createTable("briefings","id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, date_added TIMESTAMP DEFAULT CURRENT_TIMESTAMP, unit_id INT, description VARCHAR(255), title VARCHAR(255), INDEX(date_added),INDEX(unit_id)");
	
	//CREATE THE FAVGROUP TABLE
	createTable("favgroup","id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255),INDEX(name)");
	
	//CREATE THE FAVORITES TABLE
	createTable("favorites","id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, date_added TIMESTAMP DEFAULT CURRENT_TIMESTAMP, url VARCHAR(255), title VARCHAR(255), description VARCHAR(255), favgroup_id INT UNSIGNED, CONSTRAINT FOREIGN KEY(favgroup_id) REFERENCES favgroup(id) ON DELETE CASCADE ON UPDATE CASCADE,INDEX(date_added),INDEX(favgroup_id)");
	
	//CREATE THE SLIDES TABLE
	createTable("slides","id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, favorites_id INT UNSIGNED, CONSTRAINT FOREIGN KEY(favorites_id) REFERENCES favorites(id) ON DELETE CASCADE ON UPDATE CASCADE, briefings_id INT UNSIGNED, CONSTRAINT FOREIGN KEY(briefings_id) REFERENCES briefings(id) ON DELETE CASCADE ON UPDATE CASCADE");
	
?>