<?php
include_once("dbconnect.php");

function createTable($name, $query){
	if(tableExists($name)){
		echo "Table '$name' already exists<br/>";
	}else{
		queryMysql("CREATE TABLE $name($query)");
		echo "Table '$name' created<br/>";
	}
}

function tableExists($name){
	$result = queryMysql("SHOW TABLES LIKE '$name'");
	return mysql_num_rows($result);
}

function queryMysql($query){
	$result = mysql_query($query) or die(mysql_error());
	return $result;
}

function destroySession(){
	$_SESSION = array();
	
	if(session_id() != "" || isset($_COOKIE[session_name()]))
		setcookie(session_name(), '', time()-2592000, '/');
		session_destroy();
}

function sanitizeString($var){
	$var = strip_tags($var);
	$var = htmlentities($var);
	$var = stripslashes($var);
	return mysql_real_escape_string($var);
}
	
function addMember($password, $email){
	$password = sanitizeString($password);
	$email = sanitizeString($email);
	
	$query = "SELECT * FROM clients WHERE email='$email'";
	
	$result = queryMysql($query);
	
	if(mysql_num_rows($result) > 0){
		return "There is already an account for the email address provided.";
	}else{
		$pass = sanitizeString($pass);
		$query = "INSERT clients (email, password) VALUES('$email','$pass')";
		$result = queryMysql($query);
		return "Thank you for joining!";
		
	}
	

}

function login($email, $password){
	
	/*$query = "SELECT * FROM members WHERE email='$email' AND password='$password'";
	
	$results = queryMysql($query);
	if(mysql_num_rows($results) < 1 ){
		$txt = "The login information you have entered is incorrect. Please try again.";
	}else{
		*/$_SESSION['email'] = $email;
		$_SESSION['pass'] = $password;
		$txt = "Login successful! Please click <a href='./index.php'>here</a> to continue.";
	//}
	
	return $txt;

}
?>