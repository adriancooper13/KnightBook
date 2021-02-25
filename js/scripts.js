var urlBase = 'http://knightbook.rocks/LAMPAPI';
var extension = 'php';

var userId;
var firstName;
var lastName;
var lastElement = "contactHeader";

function doLogin(username, pass, id)
{
	userId = 0;
	firstName = "";
	lastName = "";
	
	htmlID = id || "loginResult";
	var login = username || document.getElementById("loginName").value;
	var password = pass || document.getElementById("loginPassword").value;

	if (login === "" && password === "") {
		document.getElementById(htmlID).innerHTML = "Please Enter Valid Username/Password combination";
		return;
	}
	if (login === "") {
		document.getElementById(htmlID).innerHTML = "Please enter a username";
		return;
	}
	if (password === "") {
		document.getElementById(htmlID).innerHTML = "Please enter a password";
		return;
	}

	var hash = md5( password );
	
	// used to display to user return result of login attempt
	document.getElementById(htmlID).innerHTML = "";

	// create json object for backend
	// var jsonPayload = `{"login" : "${login}", "password" : "${hash}"}`;
	var jsonPayload = '{"login" : "' + login + '", "password" : "' + hash + '"}';
	var url = urlBase + '/login.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, false);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.send(jsonPayload);
		
		var jsonObject = JSON.parse( xhr.responseText );
		
		userId = jsonObject.id;
		
		if( userId < 1 )
		{
			document.getElementById(htmlID).innerHTML = "Username/Password combination incorrect";
			return;
		}
		
		firstName = jsonObject.firstName;
		lastName = jsonObject.lastName;

		saveCookie();
	
		window.location.href = "contacts.html";
	}
	catch(err)
	{
		document.getElementById(htmlID).innerHTML = err.message;
	}
}

function doRegister()
{
	// fields that user will enter into register page
	var firstName = document.getElementById("registerFirstName").value;
	var lastName = document.getElementById("registerLastName").value;
	var login = document.getElementById("registerName").value;
	var password = document.getElementById("registerPassword").value;
	var hash = md5( password );

	if (firstName === "" || login === "" || password === "") {
		document.getElementById("registerResult").innerHTML = "One or more fields missing";
		return;
	}
	
	// used to display to user return result of login attempt
	document.getElementById("registerResult").innerHTML = "";

	// create json object for backend
	var jsonPayload = '{"firstName" : "' + firstName + '","lastName" : "' + lastName + '","login" : "' + login + '", "password" : "' + hash + '"}';
	var url = urlBase + '/register.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, false);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		// send payload to register api
		xhr.send(jsonPayload);
		// xhr.onreadystatechange = function() 
		// {
		// 	if (this.readyState == 4 && this.status == 200) 
		// 	{
				// get response from api
				var jsonObject = JSON.parse( xhr.responseText );
				
				// save values from api response
				userId = jsonObject.id;
				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				if (userId == 0) 
				{
					document.getElementById("registerResult").innerHTML = jsonObject.error;
					return;
				}

				doLogin(login, password, "registerResult");
			}
	// 	}
	// }
	catch(err)
	{
		document.getElementById("registerResult").innerHTML = err.message;
		return;
	}
}

function saveCookie()
{
	var minutes = 20;
	var date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}


function readCookie()
{
	userId = -1;
	var data = document.cookie;
	var splits = data.split(",");
	for(var i = 0; i < splits.length; i++) 
	{
		var thisOne = splits[i].trim();
		var tokens = thisOne.split("=");
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
	}
	
	if( userId < 0 )
	{
		window.location.href = "index.html";
	}
	else
	{
		var welcome = `Welcome<br>${firstName}`;
		welcome += (lastName == "" ? "!" : (" " + lastName + "!"));
		document.getElementById("user").innerHTML = welcome;
	}
} 

function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}

function searchContacts()
{
	var header = `<tr class="bg-warning" id="contactHeader"><th>First Name</th><th>Last Name</th><th>Phone</th><th>Email</th><th>Major</th><th></tr>`;
	var srch = document.getElementById("searchText").value;

	document.getElementById("contacts").innerHTML = header;

	// result for later
	var nameList = "";
	// var emailList = "";
	// var phoneList = "";
	// var majorList = "";
	// var lastOnlineList = "";
	
	// make json payload and send to api
	var jsonPayload = `{ "search" : "${srch}", "userId" : ${userId} }`;
	var url = urlBase + '/searchContact.' + extension;
	
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				var jsonObject = JSON.parse( xhr.responseText );

				jsonObject["id"].forEach((id, i) => {
					nameList += `<tr id="${id}">`
					nameList += `<td> ${jsonObject.fname[i]} </td>`;
					nameList += `<td> ${jsonObject.lname[i]} </td>`;
					nameList += `<td> ${jsonObject.phone[i]} </td>`;
					nameList += `<td> ${jsonObject.email[i]} </td>`;
					nameList += `<td> ${jsonObject.major[i]} </td>`;

					nameList += `<td class='buttons'><i class='far fa-edit modify-btn btn btn-default' onclick='editRow(this);'></i><i class='fas fa-trash-alt modify-btn btn btn-default' onclick='deleteContact(this);'></i></td></tr>`;

					lastElement = id;
				});

				let table = document.getElementById("contactHeader");
				table.insertAdjacentHTML("afterend", nameList);
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("searchResult").innerHTML = err.message;
	}
}


function addContact()
{
	var firstName = document.getElementById("contactFirstName").value;
	var lastName = document.getElementById("contactLastName").value;
	var email = document.getElementById("contactEmail").value;
	var phone = document.getElementById("contactPhone").value;
	var major = document.getElementById("contactMajor").value;
	// var lastOnline = document.getElementById("lastOnline").value;

	document.getElementById("contactAddResult").innerHTML = "";

	var jsonPayload = `{"firstName" : "${firstName}", "lastName" : "${lastName}", "email" : "${email}" , "phone" : "${phone}", "major" : "${major}", "userId" : ${userId}}`;
	var url = urlBase + '/addContact.' + extension;
	
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.send(jsonPayload);
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				var jsonObject = JSON.parse(xhr.responseText);
		
				if (jsonObject.error != "") {
					document.getElementById("contactAddResult").innerHTML = jsonObject.error;
					return;
				}

				var person = `<tr id="${jsonObject.id}">`;
				person += `<td>${firstName}</td><td>${lastName}</td>`;
				person += `<td>${phone}</td><td>${email}</td>`;
				person += `<td>${major}</td>`;
				person += `<td class='buttons'><i class='far fa-edit modify-btn btn btn-default' onclick='editRow(this);'></i><i class='fas fa-trash-alt modify-btn btn btn-default' onclick='deleteContact(this);'></i></td></tr>`;


				let table = document.getElementById(lastElement);
				table.insertAdjacentHTML("afterend", person);

				lastElement = jsonObject.id;
			}
		};

	}
	catch(err)
	{
		document.getElementById("contactAddResult").innerHTML = err.message;
		return;
	}

	$('#addEditModal').modal('hide');
	document.getElementById("contactFirstName").value = "";
	document.getElementById("contactLastName").value = "";
	document.getElementById("contactEmail").value= "";
	document.getElementById("contactPhone").value = "";
	document.getElementById("contactMajor").value = "";
}

function editRow(id) 
{
	var parentId = id.parentElement.parentElement.id;
	var tdList = document.getElementById(parentId).childNodes;
	id.addEventListener("click", () => updateContact(tdList), true);

	for (var i = 0; i < 5; i++)
	{
		tdList[i].innerHTML = `<input type="text" value="${tdList[i].innerHTML}"/>`
	}

	id.className = "far fa-save modify-btn btn btn-default";
	id.onclick = "";
}

function updateContact(tdList)
{
	contactId = tdList[1].parentElement.id;

	var firstName = tdList[0].firstElementChild.value;
	var lastName = tdList[1].firstElementChild.value;
	var phone = tdList[2].firstElementChild.value;
	var email = tdList[3].firstElementChild.value;
	var major = tdList[4].firstElementChild.value;
	var editButton = tdList[5].firstElementChild;

	editButton.className = "far fa-edit modify-btn btn btn-default";
	editButton.onclick = "editRow(this);";
	editButtonNew = editButton.cloneNode();
	editButton.parentNode.replaceChild(editButtonNew, editButton);

	for (var i = 0; i < 5; i ++)
	{
		tdList[i].innerHTML = `${tdList[i].firstElementChild.value}`;
	}

	var jsonPayload = `{ "id" : ${contactId}, "firstName" : "${firstName}", "lastName" : "${lastName}", "email" : "${email}", "phone" : "${phone}", "major" : "${major}", "userId" : ${userId} }`;
	document.getElementById("searchResults").innerHTML = "";
	
	var url = urlBase + "/updateContact." + extension;
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.send(jsonPayload);
		if (this.readyState == 4 && this.status == 200) 
		{
			var jsonObject = JSON.parse(xhr.responseText);

			if (jsonObject.error != "")
				throw jsonObject.error;
		}
	}
	catch (err)
	{
		document.getElementById("searchResults").innerHTML = err.message;
		return;
	}
}

function deleteContact(id)
{
	id = id.parentElement.parentElement.id;
	var jsonPayload = `{ "id" : ${id} }`;
	var url = urlBase + "/deleteContact." + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try 
	{
		xhr.send(jsonPayload);
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				var jsonObject = JSON.parse(xhr.responseText);
				
				if (jsonObject.error != "")
					throw jsonObject.error;
			}
		}
	} 
	catch(err)
	{
		// alert(err.message);
		return;
	}

	document.getElementById(id).style.display = "none";
	if (lastElement == id) {
		let table = document.getElementById("contacts");
		for (var i = 0, row; row = table.rows[i]; i++)
			lastElement = row.id;
	}
}