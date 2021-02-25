<?php

// Unpack JSON object
$inData = getRequestInfo();
$firstName = "";
$lastName = "";
$id = 0;

// Make connection with database
$conn = new mysqli("localhost", "Group25", "25!!Poos", "KnightBook");
if ($conn->connect_error)
{
    returnWithError($conn->connect_error);
}
else
{
    // Check if username already exists, if it does tell user to try again
    $sql = "SELECT ID FROM Users where Login='" . $inData["login"] . "'";
    $result = $conn->query($sql);
    if ($result->num_rows > 0) 
    {
        returnWithError("Username Has Been Taken");
    }
    // If username does not exist, create account and log them in
    else 
    {
        $sql = "INSERT INTO Users (Login, Password, FirstName, LastName) VALUES ('" . $inData["login"] . "','" . $inData["password"] . "','" . $inData["firstName"] . "','" . $inData["lastName"] . "')";
        if ($conn->query($sql) === FALSE)
        {
            returnWithError("Could Not Create Account");
        }
        
        // Process user input and query the database to see if the user's information is present.
		$sql = "SELECT ID, FirstName, LastName FROM Users where Login='" . $inData["login"] . "' and Password='" . $inData["password"] . "'";
		$result = $conn->query($sql);

		if ($result->num_rows > 0)
		{
			// If the login info is present, put the results in an associative array and return JSON. 
			$row = $result->fetch_assoc();
			$firstName = $row["FirstName"];
			$lastName = $row["LastName"];
			$id = $row["ID"];
            returnWithInfo($firstName, $lastName, $id);
		}
        else
        {
            returnWithError("Could Not Create Account");
        }
    }
    $conn->close();
}

function getRequestInfo()
{
    return json_decode(file_get_contents('php://input'), true);
}

function sendResultInfoAsJson( $obj )
{
    header('Content-type: application/json');
    echo $obj;
}

function returnWithError( $err )
{
    $retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
    sendResultInfoAsJson( $retValue );
}

function returnWithInfo( $firstName, $lastName, $id )
{
    $retValue = '{"id":' . $id . ',"firstName":"' . $firstName . '","lastName":"' . $lastName . '","error":""}';
    sendResultInfoAsJson( $retValue );
}

?>
