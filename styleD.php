<?php
   header('content-type: text/css');
   ob_start('ob_gzhandler');
   header('Cache-Control: max-age=31536000, must-revalidate');
?>


body
{
	<?php
		
		if (date("s")%2==0){
			echo "background-image: url(\"textures/squared_metal.png\");";
		} else {
			echo "background-image: url(\"textures/brickwall.png\");";
		}
			
	?>
}
