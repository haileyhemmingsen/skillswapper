# Auth Server

## About
This is all of the code for the backend server. This server is built to run on port 3080. It communicates directly with the backend FireStore database. 

## `npm run dev`
Runs the server in development mode. 

## Functionality

### Account Service
This service provides all of the account management features. 

#### Endpoints
**signup** <br>
This creates an account, sending all of the user input information to the backend database. To sign up, a valid email is required as well as a password with 8 or more characters. Providing your first and last name and your zip code, are not required, but will lead to limited functionality within the site. The database stores a hash of your password, rather than the plaintext password. 

**login** <br>
This logs into the account. The login information is verified against the database, and upon success returns to the browser a cookie containing the authentication token. This token will last for 24 hours, at which point it needs to be refreshed. 

**logout** <br>
This removes the cookie from the client browser to prevent authentication using the token within the cookie. 

### Auth Service 
This service is a purely internal service used to validate the access token of any cookie using its access token to call a protected endpoint. 

### Chat Service
This service holds all of the endpoints to facilitate live chatting between users. All of these endpoints are protected. 

#### Endpoints
**sendMessage** <br>
This will receive a json object containing a message, a sender ID, a receiver ID, a chat ID, and the time at which the message was sent. This data is then stored on the database. 

**retrieveChatHistory** <br>
This retrieves the message history of all chats. It will return to the client a list of all the messages, who sent them, at what time they were sent, and an ID associated with each message. 

**retrieveChats** <br>
This retrieves a list of all of the different chats that a user is a part of. It will contain the ID of the chat, the name of the other user who is a part of the chat, the most recent message sent in the chat, when the most recent message was sent, and whether the chat has been read. A chat is marked as read when the user has seen the most recent message from the other user. 

### Posts Service
This service handles all functionality related to posts for services on the site. All of these functions are protected endpoints unless otherwise noted. 

#### Endpoints
**createPost** <br>
This endpoint calls to a backend function `newPost()`. This will receive any requests to create a new post on the homepage. It will receive and store an archive status, the skills being asked for, the skills offered in return, a description of the desired work to be done, any categories the post might be related to. It will also create a timestamp, and an ID, and store these as well. 

**createComment** <br>
This endpoint calls to a backend function `newComment()`. This will receive any requests to comment on a particular post. It will record the ID of the person who posted it and the comment made. The function will also generate an ID for the comment and a timestamp and store those as well. 

**getLocalPosts** <br>
This will retrieve all posts from the database. It returns a list of posts containing the ID of the post, the ID of the user who posted it, the username of the user to posted it, the date it was posted, the zipcode that it was posted in (if possible), the skills requested, the skills offered, the description of the job, and any categories associated with the post. This function will not include any posts marked as "archived". This endpoint is not protected. 

**getUserPosts** <br>
This will retrieve all posts made by the currently logged in user. This will contain the ID of the post, the ID of the user who posted it, the username of the user to posted it, the date it was posted, the zipcode that it was posted in (if possible), the skills requested, the skills offered, the description of the job, any categories associated with the post, and it will contain a boolean indicating whether or not the post has been archived. 

**getAllComments** <br>
This retrieves all comments associated with a particular post. If a post ID is not specified, this function will return an empty list. It will return to the user a list of the comments containing an ID for the comment, the ID of the user who posted it, the username of the user who posted it, a timestamp, and the comment itself. This endpoint is not protected. 

**ArchiveUpdate** <br>
This endpoint calls to a backend function `archiveStatusUpdate`. This will send an update to the database that changes the status of whether a post is archived. The status is updated to whatever is specified in the object received by the endpoint. 

**EditPost** <br>
This endpoint will receive an object containing the ID of the post, the desired skills, offered skills, description of the post, and the categories the post is associated with. It will then take these and update the appropriate post in the database. It does not update the timestamp for when the post was created, and does not store information regarding whether the post was edited. 