# Simple webchat

This is a simple webchat application created to demonstrate use of websockets. It supports multiple channels, but no simple interface for joining/leaving channels or viewing a channel index.
Join a channel simply by browsing to a URL with the channel name set as a query string parameter called `channel`, e.g.

http://localhost:3003/?channel=testchannel

# Requirements
`npm` and `redis`.

# Installation
* Clone this repo
*  `cd` into the directory and then run `npm install`
# Running
`npm start`

## Configuration
Configuration is done via environment variables. Two are supported:
### PORT
By default the application will run on TCP port 3000. Set the environment variable `PORT` to run on a different port number.
### DEBUG
As with node applications, you can have a particular node package output its debug information by naming it in the `DEBUG` variable as part of a comma-separated list. The name used by this app is `sccat`

E.g. `DEBUG=scchat,redis:* PORT=3003 npm start`

# Limitations
* The app will use database `0` on `localhost:6379`. Altering this will require an application change.

