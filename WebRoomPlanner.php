<?php
$bdd = new PDO('mysql:host=localhost;dbname=projet', 'root', '');
$reponse = $bdd->query('SELECT * FROM objets');
?>

<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
        <title>Web Room Planner</title>
        <link rel="stylesheet" type="text/css" href="style.css" />
    </head>


    <body>
    	<h1> Web Room Planner !</h1>
    	       
    	<div id="container"></div>

        <!--LIB-->
        <script type="text/javascript" src="three.min.js"></script>
        <script type="text/javascript" src="jquery-1.9.1.js"></script>
        <script type="text/javascript" src="jquery-ui.js"></script>
        <!--LIB-->

        <!--SCRIPTS-->
       	<script src="oXHR.js"></script>
        <script type="text/javascript" src="ui.js"></script>
        <script type="text/javascript" src="view.js"></script>
        <!--SCRIPTS-->

          <script>
  </script>
    
     </body>
    <footer>
    	<p> <a href="CGU.html">Conditions générales d'utilisation</a></p>
	</footer>
	
</html>
