<?php

	session_start();
	
	$bdd = new PDO('mysql:host=localhost;dbname=projet', 'root', '');
	$objets = $bdd->query('SELECT * FROM objets');
	$utilisateurs = $bdd->query('SELECT * FROM utilisateurs');
	
	$erreur="";
	
	if (isset($_POST['pseudo']) && isset($_POST['MotPasse'])){
		while ($donnee = $utilisateurs->fetch()){	
			if ($_POST['pseudo'] == $donnee['pseudo']){
				if (sha1($_POST['MotPasse']) == $donnee['motDePasse']){
					$_SESSION['connect']=1;
					$erreur = "";
					
					$_SESSION['pseudo']=$donnee['pseudo'];
					$_SESSION['nom']=$donnee['nom'];
					$_SESSION['prenom']=$donnee['prenom'];
					$_SESSION['fonction']=$donnee['fonction'];
				} else {
					$erreur = "Mot de passe incorrect";
				}
			} else {
				$_SESSION['connect']=0;
				$erreur = "Login ou Mot de passe incorrect";
			}
		}
	}

	
	
?>

<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
        <title>Web Room Planner</title>
        <link rel="stylesheet" type="text/css" href="style.css" />
        <link rel="stylesheet" type="text/css" href="styleaD.php" media="all" />
    </head>


    <body>
        <?php  
			
			if (!isset($_SESSION['connect'])){
				     
				echo ("
					<div class=\"espaceMembre\">
					
						 <form  method=\"post\" action=\"WebRoomPlanner.php\">
							<p>
								".$erreur."
								<input type=\"text\" name=\"pseudo\" id=\"pseudo\" placeHolder=\"Nom d'utilisateur\" width=\"40px\" required/>
								<input type=\"password\" name=\"MotPasse\" id=\"MotPasse\" placeHolder=\"Mot de passe\" />
								<input type=\"submit\" value=\"Connexion\" />
								<a href=\"inscription.php\">Inscription</a>
							</p>
						</form>	
					</div>
					"); 
			
			}else{
				
				echo ("<p class=\"espaceMembre\">".$_SESSION['prenom']." ".$_SESSION['nom'].", vous &ecirc;tes connect&eacute; <a href=\"deconnexion.php\">D&eacute;connexion</a></p>");
				
			}
        ?> 
        
        <!--<a class="logo" title="Web Room Planner" alt="Accueil"> 
        <img src="logo/titrea<?php// 
			//if(date("s")%2==0){ 
			//	echo 1;
			//}else{
			//	echo 2;
			//};?>.png"> </a>  -->   
        
    	<div id="container"></div>

        <!--LIB-->
        <script type="text/javascript" src="three.min.js"></script>
        <script type="text/javascript" src="jquery-1.9.1.js"></script>
        <script type="text/javascript" src="jquery-ui.js"></script>
        <script src="OrbitControls.js"></script>
        <!--LIB-->

        <!--SCRIPTS-->
        <script src="objectsHandler.js"></script>
       	<script src="oXHR.js"></script>
        <script src="ui.js"></script>
        <script src="view.js"></script>
        <!--SCRIPTS-->


    
     </body>
    <footer>
    	<p> <a href="CGU.html">Conditions générales d'utilisation</a></p>
	</footer>
	
</html>
