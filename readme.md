# mzzzk

**Disclaimer:** *Most of the text below is not actually true yet.* mzzzk *is still under heavy development.*

*mzzzk* is a multi-device music streaming platform.

You can install *mzzzk* on your laptop, tablet, phone, or server. It will play your music through a web browser, or through the app, and each instance can swap songs with other *mzzzk* instances.

You can play music from other instances without installing too, only you can't save those songs locally.

# installation

Take a look at [the main website](http://mzzzk.it) for packages for your platform.

# development

To run *mzzzk* as a developer you must have nodejs and couchdb installed. Please follow the instructions on those sites. Once you have them set up:

```
git clone git@github.com:joebain/mzzzk.git
cd mzzzk
npm install
gulp serve
```

Now you should be able to visit [`0:3000`](http://0:3000) and see the app running.

# technical

*mzzzk* uses a nodejs server and all UI and frontend is HTML and Javascript, structured with backbone.js. All data is stored in a couchdb database, or pouchdb for restricted environments. Native apps are packaged using node-webkit on the desktop and cordova on mobile platforms.

If you are interested in learning more about the code, portions of the frontend code were used as examples in the Packt Publishing video series [Mastering Backbone.JS](http://packtpublishing.com). The specific portions are duplicated in their own [repository](http://github.com/joebain/mastering-backbone-js).

# pronunciation

*mzzzk* is pronounced *moo* - *zack*.

# license

*mzzzk* is copyright Joe Bain and is offered under a GPLv3 license. This means users are free to use it and access the source code, but any extensions must be offered under the same license. I'm sorry if you think Richard Stallman is a nut, but there you go.
