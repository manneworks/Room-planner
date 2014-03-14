<?php

	session_start();

	$bdd = new PDO('mysql:host=localhost;dbname=projet', 'root', '');
	
	$pseudo = $_SESSION['pseudo'];
	$obj = $_POST['objets'];
	$mur = $_POST['murs'];
	$tmpO = "";	
	$tmp1 = "";

	foreach ($obj as $key1) {
		$tmpO =+ $key1."~";
	}

	foreach ($mur as $key2) {
		$tmp1 =+ $key2."~";
	}


	$enrObj = $bdd->query("INSERT INTO `projet`.`utilisateurs` (`id`, `pseudo`, `projet`, `type`, `data`) VALUES (NULL, '".$pseudo."', '".$projet."', 'obj', '".$tmpO."');");
	$enrMur = $bdd->query("INSERT INTO `projet`.`utilisateurs` (`id`, `pseudo`, `projet`, `type`, `data`) VALUES (NULL, '".$pseudo."', '".$projet."', 'mur', '".$tmp1."');");
	
		
	}
}

	
?>
