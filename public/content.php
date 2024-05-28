<?php
  $url = $_POST['url'];
  $page = file_get_contents($url);
  echo ($page);
?>
