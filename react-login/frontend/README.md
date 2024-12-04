# Frontend 

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

## Pages
All pages listed are protected routes unless otherwise noted. 

### Login
This page is directed to both from the root route `/` and the login route `/login`. This page is where users will enter their email and password to login into the website. The website expects that upon login, the user will receive a cookie with an authentication token, and then will be routed to the Homepage. 

Both the `/` and `/login` routes are unprotected routes. 

### Homepage
This page is at the route `/homepage`. This page contains a scrollable list of all posts. The posts can be ordered by newest first, oldest first, or closest first. The proximity sorting feature is only available if the user provided their zip code upon signup. The posts listed will display a (possibly) truncated version of the Services seeked, offered and the description of the post. The post will display the time it was created, and the name of the person who created it. 

Upon clicking on a listed post, a user is routed to `/posting/ID`, where ID is the UUID of the post that was selected. 

There is an account image displayed in the top right of the homepage. Upon clicking it, the user will be presented with multiple links. 
1. The `View Profile` button will route the user to `/userpage`.
2. The `Inbox` button will route the user to the `/inbox` page.
3. The `Logout` button will send a call to backend to log the user out. 

This page accesses the zipcodeUtils utility.

### CreatePost
This page is where a user can create a listing on the homepage. The user is presented with input fields for Services Wanted (seeked), Services Offered, and Description (a description of why you want/need that particular service). It also contains a field to add predefined categories accessible via a hamburger menu. 

### Posting
This page has the route `/posting/ID` where ID is the uuid of a particular post. The page will display the post itself in full, not truncating any information originally displayed on the homepage. This means that the Services Offered, Seeked, and the description of the post are all displayed. Furthermore, a box is provided where users can comment on the post. The page will display all comments already made on the post, as well as the name of the user who wrote the comment. 

The Post includes an ellipses at the top right, and when clicked will display an option to `Message User`. This will route the user to the `/chat/NewChat` page. This page will create a direct private message in between the logged in user and the user who made the original post. 

### Signup
This page provides the user several fields to input information. They can input an email, password, their first and last name, and their zip code. 

The email and password are both required, and errors will be thrown if the email is not a valid email, or if the password is less than 8 characters. 

If provided, the zip code must be a valid US zip code. 

To designate that a name is the last name, it must be space-separated from the first name. 

The `/signup` route is an unprotected route. 

### UserPage
The userpage contains a list of all of the posts made by the logged in user. The posts are in their truncated form, displaying truncated forms of the Services Offered, Seeked, and the description of the job. The posts also display the date they were posted. 

Each post contains two buttons, one to edit and one to archive. 
The archive posts button will stop the post from being displayed to other users on the homepage. Furthermore, the post for the logged in user will become grey to indicate that it is archived. Upon clicking the button again, the post will no longer be archived. 
The edit button will route the user to `/editpost/ID` where ID is the id of the post being edited.

### EditPost
This page will display the Services Offered, Seeked, the categories associated with the post, and the description of the job. The information can then be updated to display new information. Upon clicking the `Edit` button at the bottom of the page, this new information will be sent to the backend. Upon clicking `Cancel`, the website will not send any updates to the backend, and will route you back to `/userpage`. 

### Chat
This page displays a UI for direct messaging between the logged in user and another user. This page is has a scrollable window to read through chat history, displaying the most recent messages at the bottom, and allowing the user to scroll up to see older messages. The chat also has a field to input a new message, which will be forwarded to backend. 

Messages sent by the logged in user will be displayed in an orange box, while messages sent by the other user will be displayed in a grey box. 

### Inbox
The inbox is a list of all of the chats that the logged in user is a part of. These chats could be created by the logged in user, or created by another user messaging the current logged in user. The chats will display the most recent message sent, the date and time that the most recently sent message was sent, and the name of the user that the chat is with. The inbox will also display an orange dot to the left of the chat tile. 

Upon clicking on a chat, the user will be routed to `/chat/ID` where ID is the id of the particular chat. 

## Utilities
This describes any utilities used by the main pages

### zipcodeUtils
The zipcodeUtils file provides functions that calculate distance between specific zip codes. 

## Contexts

### Login
The Login Context stores information about the currently logged in user. This information includes the first name, last name, zip code, id, and whether or not the current user is logged in. This information is not stored in one specific page, and thus is accessible from any page on the frontend, as long as the information exists. 