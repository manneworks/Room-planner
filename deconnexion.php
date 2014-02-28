<?php

	session_start();
	
	$_SESSION['connect']=0;

?>

<!DOCTYPE html >

<html>
    <head>
        <meta charset="utf-8" />
        <title>D&eacute;connecion</title>
        <link rel="stylesheet" type="text/css" href="style.css" />
        <link rel="stylesheet" type="text/css" href="styleD.php" media="all" />
    </head>

	 <body>
    	<article>
        <a class="logo" title="Web Room Planner" alt="Accueil"> 
        <img src="logo/titre<?php 
			if(date("s")%2==0){ 
				echo 1;
			}else{
				echo 2;
			};?>.png"> </a>
            
        </article> 
        
		<p>Vous &ecirc;tes d&eacute;connect&eacute;, merci et &agrave; bient&ocirc;t</br>
			<a href="WebRoomPlanner.php">Retourner &agrave; la page principale</a></p>
		
	</body>

</html>
