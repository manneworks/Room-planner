<?php

	session_start();

	$bdd = new PDO('mysql:host=localhost;dbname=projet', 'root', '');
	
	$erreur = "";
	$donneeInscription = 0;
	$estDeja=0;
	

	if (isset($_POST['pseudo']) && isset($_POST['passwd']) && isset($_POST['passwd2']) && isset($_POST['nom']) && isset($_POST['prenom']) && isset($_POST['fonction'])){
			$pseudo = htmlentities(mysql_real_escape_string($_POST['pseudo']));
			$passwd = htmlentities(mysql_real_escape_string($_POST['passwd']));
			$passwd2 = htmlentities(mysql_real_escape_string($_POST['passwd2']));
			$nom = htmlentities(mysql_real_escape_string($_POST['nom']));
			$prenom = htmlentities(mysql_real_escape_string($_POST['prenom']));




			$exist = $bdd->query("SELECT * FROM utilisateurs WHERE pseudo = '".$pseudo."';");
			while ($ex = $exist->fetch()){
				if (mysql_real_escape_string($ex['pseudo'])==$pseudo){
					$estDeja=1;
				}
			}
			
			if ($estDeja > 0){
				$erreur="Ce login existe deja";
			}else if ($passwd != $passwd2){
				$erreur="Le mot de passe de confirmation ne correspond pas au mot de passe";
			} else if (($estDeja == 0) && ($passwd == $passwd2)){

				$bdd->query("INSERT INTO `projet`.`utilisateurs` (`id`, `pseudo`, `motDePasse`, `nom`, `prenom`, `fonction`) VALUES (NULL, '".$pseudo."', '".sha1($passwd)."', '".$nom."', '".$prenom."', '".$_POST['fonction']."');");

				$verif = $bdd->query("SELECT * FROM utilisateurs WHERE pseudo = '".$pseudo."';");

				while ($ver = $verif->fetch()){
					if (mysql_real_escape_string($ver['pseudo'])==$pseudo){
						$donneeInscription = 1;
						$_SESSION['connect'] = 1;
						$_SESSION['pseudo'] = $pseudo;
						$_SESSION['nom'] = $nom;
						$_SESSION['prenom'] = $prenom;
						$_SESSION['fonction'] = $_POST['fonction'];
					}
				}	

				if (mysql_real_escape_string($ver['pseudo'])!=$pseudo){
					$erreur="Il y a eu un probl&egrave;me lors de l'inscription, veuillez r&eacute;essayer";
				}				
				
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
       		<?php
        		if ($donneeInscription == 1 && $_SESSION['fonction'] == 'arc'){
					echo "<img src=\"logo/titre1.png\">";
				} else if ($donneeInscription == 1 && $_SESSION['fonction'] == 'deco') {
					echo "<img src=\"logo/titre2.png\">";
				} else  {
					echo "<img src=\"logo/titre3.png\">";
				}
        	?></a>
            
        </article> 
        
        <?php
			if ($donneeInscription == 1){
				echo ("Merci, vous &ecirc;tes bien enregistr&eacute; </br>");
				echo ("<meta http-equiv=\"refresh\" content=\"1 ; URL=WebRoomPlanner.php\">");
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
										<option value=\"arc\">Architecte</option>
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
