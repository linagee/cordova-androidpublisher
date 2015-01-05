NOT YET WORKING

cordova-androidpublisher
========================

This Cordova plugin adds a hook to your compile command that allows easy upload of your signed Cordova APK to Google Play Developer Console. This is achieved using the Google Play Developer API. (https://developers.google.com/android-publisher/)

It works like this:

**cordova compile android --release --publish**

Cordova will be forced to build a release build. Apps in Google Play Store are required to be signed. This plugin will complain if it can't generate a signed APK.

Step 0
======

You did remember to give your project a unique namespace when you created it, right?

Edit **myProject/config.xml**, change _com.exampleprojecthere-12345_ into a suitable package name. (_com.mydomain.myproject_ is a good start.)

Generating Keystore
===================

If you don't yet have a keystore file:

**mkdir -p ~/.androidKeys**
**keytool -genkey -v -keystore ~/.androidKeys/my-release-key.keystore -alias release_key -keyalg RSA -keysize 2048 -validity 10000**

Adding Keystore to your project
===============================

If you don't yet have a keystore defined for your project:

Edit **myProject/platforms/android/ant.properties** and add the following:

**key.store=~/.androidKeys/my-release-key.keystore**
**key.alias=release_key**

Test generating a release APK
=============================

Inside your project directory:

**cordova build android --release**

This should generate an APK file: **myProject/platforms/android/ant-build/MyProject-release.apk**
