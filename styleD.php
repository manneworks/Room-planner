<?php

	session_start();
   header('content-type: text/css');
   ob_start('ob_gzhandler');
   header('Cache-Control: max-age=31536000, must-revalidate');
?>


body
{
	<?php
		
		if (isset($_SESSION['fonction']) && $_SESSION['fonction']=='arc'){
			echo "background-image: url(\"textures/brickwall.png\");";
		} else if (isset($_SESSION['fonction']) && $_SESSION['fonction']=='deco') {
			echo "background-image: url(\"textures/tileable_wood_texture.png\");";
		} else {
			echo "background-image: url(\"textures/shattered.png\");";
		}
			
	?>
		
		
		
}
