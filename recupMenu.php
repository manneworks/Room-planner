<?php

	$bdd = new PDO('mysql:host=localhost;dbname=projet', 'root', '');
	$reponse = $bdd->query('SELECT * FROM objets');	

	while ($donnee = $reponse->fetch()){
	
	//gerer les vides
		
		echo $donnee['categorie'].":";
		echo $donnee['nom'].":";
	}
	
?>
