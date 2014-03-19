<?php
	session_start(); 
	if(isset($_SESSION['pseudo'])){
		$bdd = new PDO('mysql:host=localhost;dbname=projet', 'root', '');
		
		$pseudo = $_SESSION['pseudo'];
		$projet = $_POST['nomProjet'];
		$data = $_POST['data'];

		$reponse = $bdd->query("SELECT * FROM `projet`.`enregistrements` WHERE nom = '".$projet."' ");
		$exist = 0;
		while ($donnee = $reponse->fetch()){
			$exist = $donnee['id'];
		}

		if($exist == 0){
			$enrObj = $bdd->query("INSERT INTO `projet`.`enregistrements` (`id`, `nom`, `data`) VALUES (NULL, '".$projet."', '".$data."');");
			$reponse = $bdd->query("SELECT id FROM `projet`.`enregistrements` WHERE nom = '".$projet."' ");	
			while ($donnee = $reponse->fetch()){
				$id = $donnee['id'];
			}
			$bdd->query("INSERT INTO `projet`.`projets` (`num`, `id`, `pseudo`) VALUES (NULL, '".$id."', '".$pseudo."');");
		}else{
			$reponse = $bdd->query("SELECT id FROM `projet`.`projets` WHERE pseudo = '".$pseudo."' AND id = '".$exist."' ");
			$test=0;
			while ($donnee = $reponse->fetch()){
				$test = $donnee['id'];
			}
			if($test!=0){
				$bdd->query("UPDATE `projet`.`enregistrements` SET data = '".$data."' WHERE nom = '".$projet."'");
			}
		}
	}	
?>