# Growtopia.js
The first ever Growtopia Private server coded with NodeJS and a little mix of C++ for sending packets/enet server.

## Installation
There are programs that you would need to install in order to run this. Most of those can be avoided (building the C++ addon) by downloading a pre-built binary [here](https://lukewarmcat.codes/gjs/). If your nodejs version and OS is not there, you're out of luck since you would need to build the C++ addon. For instructions on how to build, read below. Otherwise, you can skip and go to `Installing Packages`  

### Building C++ Addon
Requirements:
- node-gyp  
- windows-build-tools (build-essential for linux)  
- nodejs v12+  
- enet

**What to do?**  
- If you don't have node-gyp and any build tools installed, open powershell as adminsistrator (terminal on linux) and run `npm install -g node-gyp windows-build-tools`. For linux, do `npm install -g node-gyp` then, install `build-essential`. `sudo apt get install build-essential` for distros that use `apt` or `sudo yum install build-essential` for distros that use `yum`.  

- Install enet at http://enet.bespin.org/Installation.html . For windows, you can just download the `.tar.gz` file and get the `enet64.lib` there and put it inside the `lib` folder. If that doesn't work, try at the `lib/build` folder. You could also place it at the location where your static lib files are located. And you also need the `enet` folder inside the `include` directory. Place it inside the `lib` folder of the project. If that doesn't work, place it on the dir where the headers are located, specifically just `enet/enet.h`. Make sure to put `enet.h` inside a folder named `enet`. For linux, you can follow their site as you just compile it and it would install.  

- After all that, install `node-addon-api` by doing `npm install node-addon-api`. Now go inside the `/lib` folder and type `node-gyp rebuild -j 8` (8) is the number of threads to use for parallel compilling.

### Installing Packages
- A simple `npm install` will install everything needed. But you can do it one by one if you'd like. These are the needed packages:
  - enmap
  - better-sqlite-pool
  - restana

## Sending to all peers
If you would like to send or do something will all the peers connected, you can use the `Packet#broadcast` function. Here is an example.  
```js
main.Packet.broadcast((peer) => {
  p.create()
    .string('OnConsoleMessage')
    .string('Hello')
    .end();

  main.Packet.sendPacket(peerid, p.return().data, p.return().len);
  p.reconstruct();
});
```  
That would send "Hello" to all peers connected. You can add options for sending as well, it would be the 2nd argument and would be an object. Here are available options:  
- `options.sameWorldCheck: (bool)` This would check if `options.peer` is in the same world with the other peers. Default: **false**  
- `options.peer: (string)` The id of the peer to be used for comparisons.  
- `options.runIfSame: (bool)` This is to indicate if it would run the callback if the peer and `options.peer` matches. Default: **false**  
- `options.runIfNotSame: (bool)` This is the opposite of `options.runIfSame`. Default: **false**

## TODO
- [x] Update Docs  
- [x] Inventory  
- [x] Disconnection Issues Fixed  
- [ ] Plant Trees  
- [ ] Respawn  
- [ ] Signs/Doors  
- [ ] ???  

This will be changed if we found more stuff to do.
