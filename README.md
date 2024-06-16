# Connect Project
Welcome to our Discord clone project for App Academy! We recreated a web page where users can create their own private or public servers and channels where you can invite friends or strangers in order to trade messages with them in real time. This project was done by Sean Kwasnicki, Eli Suffridge, and WeiCheng Chen.

# Link to Live Site
https://connect-imdc.onrender.com/

# WikiLinks

# Technologies used to create this project. 
![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54)

![JavaScript]

![Flask]

![React]

![Postgres]

![CSS3]

![Redux]

![HTML5]

![Socket.io]

![Flask]

![Docker]











# Discord API Routes (In Review)
![db-schema]

[db-schema]: ./aa19-python-group-project/images/Discord%20Schema.png

## User Routes

### Get the Current User
- Method: GET
- URL: `/api/session`
- Authentication: Required
- Authorization: Not required

### Log In a User
- Method: POST
- URL: `/api/session`
- Authentication: Not required
- Authorization: Not required

### Sign Up a User
- Method: POST
- URL: `/api/users`
- Authentication: Not required
- Authorization: Not required

## Server Routes

### Get all Servers
- Method: GET
- URL: `/api/servers`
- Authentication: Required
- Authorization: Not required

### Create a Server
- Method: POST
- URL: `/api/servers`
- Authentication: Required
- Authorization: Not required

### Get a Server by ID
- Method: GET
- URL: `/api/servers/{id}`
- Authentication: Required
- Authorization: Not required

### Update a Server
- Method: PATCH
- URL: `/api/servers/{id}`
- Authentication: Required
- Authorization: Required (only the server owner)

### Delete a Server
- Method: DELETE
- URL: `/api/servers/{id}`
- Authentication: Required
- Authorization: Required (only the server owner)

## Server Member Routes

### Get All Members in a Server
- Method: GET
- URL: `/api/servers/{server_id}/members`
- Authentication: Required
- Authorization: Required (user must be a member of the server)

### Add a User to a Server
- Method: POST
- URL: `/api/servers/{server_id}/members`
- Authentication: Required
- Authorization: Required (only the server owner or admins)

### Remove a User from a Server
- Method: DELETE
- URL: `/api/servers/{server_id}/members`
- Authentication: Required
- Authorization: Required (only the server owner or admins)

## Channel Routes

### Get all Channels in a Server
- Method: GET
- URL: `/api/servers/{server_id}/channels`
- Authentication: Required
- Authorization: Required (user must be a member of the server)

### Create a Channel
- Method: POST
- URL: `/api/servers/{server_id}/channels`
- Authentication: Required
- Authorization: Required (only the server owner or admins)

### Get a Channel by ID
- Method: GET
- URL: `/api/channels/{id}`
- Authentication: Required
- Authorization: Required (user must be a member of the server)

### Update a Channel
- Method: PATCH
- URL: `/api/channels/{id}`
- Authentication: Required
- Authorization: Required (only the channel creator or server owner)

### Delete a Channel
- Method: DELETE
- URL: `/api/channels/{id}`
- Authentication: Required
- Authorization: Required (only the channel creator or server owner)

## Channel Member Routes

### Get All Members in a Channel
- Method: GET
- URL: `/api/channels/{channel_id}/members`
- Authentication: Required
- Authorization: Required (user must be a member of the server)

### Get A Member in a Channel
- Method: GET
- URL: `/api/channels/{channel_id}/members/{member_id}`
- Authentication: Required
- Authorization: Required (user must be a member of the server)

### Add a User to a Channel
- Method: POST
- URL: `/api/channels/{channel_id}/members`
- Authentication: Required
- Authorization: Required (only the server owner or admins)

### Remove a User from a Channel
- Method: DELETE
- URL: `/api/channels/{channel_id}/members/{member_id}`
- Authentication: Required
- Authorization: Required (only the server owner or admins)

## Message Routes

### Get all Messages in a Channel
- Method: GET
- URL: `/api/channels/{channel_id}/messages`
- Authentication: Required
- Authorization: Not required

### Create a Message
- Method: POST
- URL: `/api/channels/{channel_id}/messages`
- Authentication: Required
- Authorization: Not required

### Get a Message by ID
- Method: GET
- URL: `/api/messages/{id}`
- Authentication: Required
- Authorization: Not required

### Update a Message
- Method: PATCH
- URL: `/api/messages/{id}`
- Authentication: Required
- Authorization: Required (only the message sender)

### Delete a Message
- Method: DELETE
- URL: `/api/messages/{id}`
- Authentication: Required
- Authorization: Required (only the message sender)

## Reaction Routes

### Get All Reactions for a Message
- Method: GET
- URL: `/api/messages/{message_id}/reactions`
- Authentication: Required
- Authorization: Not required

### Add a Reaction to a Message
- Method: POST
- URL: `/api/messages/{message_id}/reactions`
- Authentication: Required
- Authorization: Not required

### Remove a Reaction from a Message
- Method: DELETE
- URL: `/api/messages/{message_id}/reactions`
- Authentication: Required
- Authorization: Required (only the user who added the reaction)

### Get All Reactions by a User
- Method: GET
- URL: `/api/users/{user_id}/reactions`
- Authentication: Required
- Authorization: Not required

## Thread Routes

### Create a Thread from a Message
- Method: POST
- URL: `/api/messages/{message_id}/threads`
- Authentication: Required
- Authorization: Not required

### Get a Thread by ID
- Method: GET
- URL: `/api/threads/{id}`
- Authentication: Required
- Authorization: Not required

## Direct Message Routes

### Get all Direct Messages for a User
- Method: GET
- URL: `/api/users/{user_id}/direct_messages`
- Authentication: Required
- Authorization: Not required

### Create a Direct Message
- Method: POST
- URL: `/api/users/{user_id}/direct_messages`
- Authentication: Required
- Authorization: Not required

### Get a Direct Message by ID
- Method: GET
- URL: `/api/direct_messages/{id}`
- Authentication: Required
- Authorization: Not required
