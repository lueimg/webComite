<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require '../models.php';

if ( !empty( $_FILES ) ) {
    $tempPath = $_FILES[ 'file' ][ 'tmp_name' ];
    $fileName = time(). '.'. $_FILES[ 'file' ][ 'name' ];
    $uploadPath = dirname( __FILE__ ) . '/' . $fileName;
    $answer = array( 'answer' => 'File transfer completed', "file"=>  $uploadPath);
    $json = json_encode( $answer );
    echo $json;
} else {
    echo 'No files';
}