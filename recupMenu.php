<?php

	$bdd = new PDO('mysql:host=localhost;dbname=projet', 'root', '');
	$reponse = $bdd->query('SELECT * FROM objets');	

	while ($donnee = $reponse->fetch()){
	
		if ($donnee['categorie']==""){
			$test = "Divers";
			echo $test.":";
			echo $donnee['nom'].":";
			/*echo $donnee['description'].":";
			echo $donnee['image'].":";*/
		}else{
			echo $donnee['categorie'].":";
			echo $donnee['nom'].":";
			echo $donnee['description'].":";
			echo $donnee['image'].":";
		
	}
}

	
?>

