<?php

$inData = getRequestInfo();

// Opens a new connection with the MySQL server
$conn = new mysqli("localhost", "Group25", "25!!Poos", "KnightBook");

// Check the connection, return an error if connection fails. 
if ($conn->connect_error) 
{
	returnJSON( $conn->connect_error );
} 
else
{
	$sql = "UPDATE Contacts SET FirstName='" . $inData["firstName"] . "', LastName='" . $inData["lastName"] . "', Email='" . $inData["email"] . "', Phone='" . $inData["phone"] . "', Major='" . $inData["major"] . "' WHERE UserID=" . $inData["userId"] . " and ID=" . $inData["id"];

	if ($conn->query($sql) === FALSE)
	{
		returnJSON("Could not update contact.");
	}
	else
	{
		returnJSON("");
	}

	$conn->close();
}

function getRequestInfo()
{
    return json_decode(file_get_contents('php://input'), true);
}

function returnJSON( $error )
{
	$retValue = '{"error" : "' . $error . '"}';
	sendResultInfoAsJson( $retValue );
}

function sendResultInfoAsJson( $obj )
{
    header('Content-type: application/json');
    echo $obj;
}

?>
