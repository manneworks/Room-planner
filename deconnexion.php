<?php

	session_start();
	
	$_SESSION['connect']=0;
	$_SESSION['pseudo'] ="";
	$_SESSION['nom'] = "";
	$_SESSION['prenom'] = "";
	$_SESSION['fonction'] = "";

	session_destroy();

?>

<!DOCTYPE html >

<html>
    <head>
        <meta charset="utf-8" />
        <title>D&eacute;connexion</title>
        <link rel="stylesheet" type="text/css" href="style.css" />
        <link rel="stylesheet" type="text/css" href="styleD.php" media="all" />
    </head>

	 <body>
	 

    	<article>
        	<a class="logo" title="Web Room Planner" alt="Accueil"> 
        	<img src="logo/titre3.png"> </a>
            
        </article> 
        
		<p>Vous &ecirc;tes d&eacute;connect&eacute;, merci et &agrave; bient&ocirc;t</br>
			<meta http-equiv="refresh" content="1 ; URL=WebRoomPlanner.php">
			<a href="WebRoomPlanner.php">Retourner &agrave; la page principale</a>
		</p>


		
	</body>

</html>
