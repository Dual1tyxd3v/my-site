<?
//В переменную $token нужно вставить токен
$token = "5910914438:AAGnFKdoICio2rw007B1IItl7ovDFSpOpcs";

//Сюда вставляем chat_id
$chat_id = "-1001660934627";
$id = "968980307";

//Определяем переменные для передачи данных из нашей формы

$name = $_POST['name'];
$email = $_POST['email'];
$message = $_POST['message'];
//Собираем в массив то, что будет передаваться боту
$arr = array(
    'Имя:' => $name ? $name : '___',
    'E-mail:' => $email ? $email : '___',
    'Сообщение:' => $message
);

//Настраиваем внешний вид сообщения в телеграме
foreach($arr as $key => $value) {
    $txt .= "".$key." ".$value."%0A";
};
$sendToTelegram = fopen("https://api.telegram.org/bot{$token}/sendMessage?chat_id={$id}&parse_mode=html&text={$txt}","r");

//Выводим сообщение об успешной отправке
if ($sendToTelegram) {
    echo "1";
}

//А здесь сообщение об ошибке при отправке
else {
  echo "0";
}
?>
