<?php

	$inData = getRequestInfo();

	$searchResultsId = "";
	$searchResultsFirstName = "";
	$searchResultsLastName = "";
	$searchResultsMajor = "";
	$searchResultsPhone = "";
	$searchResultsEmail = "";
	$searchCount = 0;

	$conn = new mysqli("localhost", "Group25", "25!!Poos", "KnightBook");

	if ($conn->connect_error)
	{
		returnWithError($conn->connect_error);
	}
	else
	{
		$sql = "SELECT ID, FirstName, LastName, Email, Phone, Major from Contacts WHERE
				(FirstName like '%" . $inData["search"] . "%' or LastName like '%" . $inData["search"] . "%' 
				or Email like '%" . $inData["search"] . "%' or Phone like '%" . $inData["search"] . "%' 
				or Major like '%" . $inData["search"] . "%') and UserID=" . $inData["userId"];
		
		$result = $conn->query($sql);
		
		if ($result->num_rows > 0)
		{
			while ($row = $result->fetch_assoc())
			{
				if ($searchCount > 0)
				{
					$searchResultsId .= ",";
					$searchResultsFirstName .= ",";
					$searchResultsLastName .= ",";
					$searchResultsEmail .= ",";
					$searchResultsPhone .= ",";
					$searchResultsMajor .= ",";
				}
				$searchCount += 1;
				$searchResultsId .= '"' . $row["ID"] . '"';
				$searchResultsFirstName .= '"' . $row["FirstName"] . '"';
				$searchResultsLastName .= '"' . $row["LastName"] . '"';
				$searchResultsPhone .= '"' . $row["Phone"] . '"';
				$searchResultsEmail .= '"' . $row["Email"] . '"';
				$searchResultsMajor .= '"' . $row["Major"] . '"';
			}

			returnWithInfo($searchResultsId, $searchResultsFirstName, $searchResultsLastName, $searchResultsPhone, $searchResultsEmail, $searchResultsMajor);
		}
		else
		{
			returnWithError("No Contacts Found.");
		}

		$conn->close();
	}

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function returnWithError( $err )
	{
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}

	function returnWithInfo( $id, $fname, $lname, $phone, $email, $major )
	{
		$retValue = '{"id" : [' . $id . '], "fname" : [' . $fname . '], "lname" : [' . $lname . '], "phone" : [' . $phone . '], "email" : [' . $email . '], "major" : [' . $major . '], "error":""}';
		sendResultInfoAsJson( $retValue );
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}

?>
