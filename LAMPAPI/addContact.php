<?php

	$inData = getRequestInfo();

	// connect to db
	$conn = new mysqli("localhost", "Group25", "25!!Poos", "KnightBook");

	if ($conn->connect_error)
	{
		returnWithError($conn->connect_error);
	}
	else
	{
		$sql = "INSERT INTO Contacts (UserID, FirstName, LastName, Email, Phone, Major) VALUES (" . $inData["userId"] . ",'" . $inData["firstName"] . "','" . $inData["lastName"] . "','" . $inData["email"] . "','" . $inData["phone"] . "','" . $inData["major"] . "')";

		if ($conn->query($sql) === FALSE)
		{
			returnWithError("Could not add contact.");
		}
		else
		{
			$getid = 'SELECT ID FROM Contacts WHERE FirstName="' . $inData["firstName"] . '" AND LastName="' . $inData["lastName"] . '" AND Email="' . $inData["email"] . '" AND Phone="' . $inData["phone"] . '" AND Major="' . $inData["major"] . '" AND UserID="' . $inData["userId"] . '"';

			$result = $conn->query($getid);

			if ($result->num_rows > 0)
			{
				$row = $result->fetch_assoc();
				returnWithInfo($row["ID"], "Successfully created the contact.");
			}
			else 
			{
				returnWithError("Could not add contact.");
			}
		}

		$conn->close();
	}

	function returnWithError($err)
	{
		$retValue = '{"id" : 0, "message" : "", "error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson($obj)
	{
		header('Content-type: application/json');
		echo $obj;
	}

	function returnWithInfo($id, $message)
	{
		$retValue = '{"id" : ' . $id . ', "message" : "' . $message . '", "error": ""}';
		sendResultInfoAsJson( $retValue );
	}

?>