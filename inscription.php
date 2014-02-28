<?php

	session_start();

	$bdd = new PDO('mysql:host=localhost;dbname=projet', 'root', '');
	$utilisateurs = $bdd->query('SELECT * FROM utilisateurs');
	
	$erreur = "";
	$donneeInscription = 0;
	$estDeja=0;
	
	
	if (isset($_POST['pseudo']) && isset($_POST['passwd']) && isset($_POST['passwd2']) && isset($_POST['nom']) && isset($_POST['prenom']) && isset($_POST['fonction'])){
			$exist = $bdd->query("SELECT * FROM utilisateurs WHERE pseudo = '".$_POST['pseudo']."';");
			while ($ex = $exist->fetch()){
				if ($ex['pseudo']==$_POST['pseudo']){
					$estDeja=1;
				}
			}
			
			if ($estDeja > 0){
				$erreur="Ce login existe deja";
			}else if ($_POST['passwd'] != $_POST['passwd2']){
				$erreur="Le mot de passe de confirmaton ne correspond pas au mot de passe";
			} else if (($estDeja == 0) && ($_POST['passwd'] == $_POST['passwd2'])){
				$donneeInscription = 1;
				$_SESSION['connect'] = 1;
				$_SESSION['pseudo'] = $_POST['pseudo'];
				$_SESSION['nom'] = $_POST['nom'];
				$_SESSION['prenom'] = $_POST['prenom'];
				
				$bdd->query("INSERT INTO `projet`.`utilisateurs` (`id`, `pseudo`, `motDePasse`, `nom`, `prenom`, `fonction`) VALUES (NULL, '".$_POST['pseudo']."', '".sha1($_POST['passwd'])."', '".$_POST['nom']."', '".$_POST['prenom']."', '".$_POST['fonction']."');");
			}	
	} else {
		$erreur = "Veuillez remplir tous les champs";
	}

		
?>

<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
        <title>Inscription</title>
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
        
        <?php
			if ($donneeInscription == 1){
				echo ("Merci, vous &ecirc;tes bien enregistr&eacute; </br>");
				echo ("<a href=\"WebRoomPlanner.php\">Retourner &agrave; la page principale</a>");
			}else{
				echo ("	   
				<article class=\"formInscription\">
					<p> ".$erreur."</p>
					<fieldset>
						<legend>Inscription</legend>
							<form  method=\"post\" action=\"inscription.php\">
								<p><label for=\"pseudo\">Nom d'utilisateur : </label><input type=\"text\" name=\"pseudo\" id=\"pseudo\" required /></p>
								<p><label for=\"passwd\">Mot de passe : </label><input type=\"password\" name=\"passwd\" id=\"passwd\" required /></p>
								<p><label for=\"passwd2\">Confirmation mot de passe : </label><input type=\"password\" name=\"passwd2\" id=\"passwd2\" required /></p>
								<p><label for=\"nom\">Nom :</label><input type=\"text\" name=\"nom\" id=\"nom\" required /></p>
								<p><label for=\"prenom\">Pr&eacute;nom :</label><input type=\"text\" name=\"prenom\" id=\"prenom\" required /></p>
								<p><label for=\"fonction\">Fonction : </label> 
								   <select name=\"fonction\" id=\"fonction\">
										<option value=\"\"></option>
										<option value=\"architecte\">Architecte</option>
										<option value=\"deco\">D&eacute;corateur d'int&eacute;rieur</option>
										<option value=\"autre\">Autre</option>
								   </select>
								</p>
								<p><label for=\"envoyer\"><input type=\"submit\" value=\"Envoyer\" /></label></p>
							</form>
					</fieldset>  
					
				</article> 
				
				");  
			}
    	?>
        
	</body>
</html>
