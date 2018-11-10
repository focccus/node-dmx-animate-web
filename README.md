# dmx-animate-web
![enter image description here](https://i.imgur.com/o1gnQVH.png)
This module acts as a http API and Webinterface to control dmx devices via [node-dmx-animate](https://github.com/Stevertus/node-dmx-animate).
Please familiarize yourself with the concept of the library, because we'll rely on it here.
## Installation
After you've installed `dmx-animate` install `dmx-animate-web` with
```
npm i dmx-animate-web --save
```
## Configuration
Configure dmx-animate, sequences and devices as shown here: [node-dmx-animate](https://github.com/Stevertus/node-dmx-animate)
But add a `dmx-animate-web` import and create a instance:
```js
const dmxAnimate = require('dmx-animate')
const dmx = new dmxAnimate({
  universes: [
    {name: 'demo', driver: null, serialPath: 'COM7'}
  ]
})
// !important:
const dmxAnimateWeb = require('dmx-animate-web')
const dmxWeb = dmxAnimateWeb(dmx)

var rgbDevice = dmx.addDevice({
	name: 'basic-rgb',
	startChannel: 4,
	channels: ['r','g','b'],
	isRgb: true,
	reactSound: ['r','g','b']
})
dmx.addSequence('demo',function(){
	return rgbDevice.dim([255,255,255],undefined,2000).run()
})
```
**dmx-animate-web(dmx, [config])**
* `dmx`: The instance the webserver should use
* config: optional config containing:
	*  port: The webservers port
	* https: True or False
	* httpsPort: Seperate Port for https
	* credentials: Object for https credentials
		* key: file path to the key file
		* cert: file path to the certificate file

If you take a glance at the console there should be a similar message like this:
```
Web server started at localhost:8080
```
## Demo-Interface
I included a demo web interface for the barely usage and control.
If you open `localhost:8080` or `computersIP:8080`, a website should load.
![enter image description here](https://i.imgur.com/o1gnQVH.png)
You should see all your defined devices and their channels.

You can click the device names to get a wide view and execute programs from the web interface.
**isRgb** defined devices can be controlled using a color wheel.
**reactToSound** defined device channels can be controlled by the browsers microphone input (sensitivity and dim durations can be altered)

The **sequences tab** gives you an overview over all defined sequences and you can play them directly.

**define Rgb devices**

To enable the color wheel, pass `isRgb: true`in the device
**define reactSound**

Pass an array of channel names that should change on sound peaks:
`reactSound: ['r','g','b']`
**Important**: In many browsers the microphone is deactivated if the connection is not secure. So if you serve the site to other devices in your local network, consider a https connection.

## API
You can access the http api yourself. There are these endpoints:
**GET /api/devices **

Returns all devices and groups with this schema:
```json
[
	{
		"name": String,
		"channels": [String],
		"state": {
			"channel":Number
			...
		},
		"programs": [String]
		"reactSound":[String]
	}
]
```
**GET /api/sequences**

Returns all sequences with this schema:
```json
[
	{
		"name": String,
		"duration": Number
	}
]
```
**POST /api/runSequence/[name]**

Executes the sequence called `name`. Returns: `{"success":Boolean}`
(optional) Request Body: Array of Arguments

**POST /api/stopSequence/[name]**

Stops a running sequence called `name`. Returns: `{"success":Boolean}`

**POST /api/blackout**

Blackouts all devices. Returns: `{"success":Boolean}`

**POST /api/device/set**

Executes a method on a device, animates it or just sets it's channels to a value.

Request Body:
```json
{
	"name": String,
	"commands": [
		{
			"type": String,
			"args": Array
		}
	]
}
```
`type` - The name of a method on the device
`args` - (optional) An Array of Arguments you would pass into the function usually
Returns:
```json
{
	"success": Boolean,
	"results": [
		"value": For each command
	]
}
```
**Example:**
```json
{
	"name": "basic-rgb",
	"commands": [
		{
			"type": "set",
			"args": [{"r":150,"g": 50, "b": 255}]
		},
		{
			"type": "dim",
			"args": [{"r":255,"g": 150, "b": 0},null,10000]
		},
		{
			"type": "run"
		}
	]
}
```
