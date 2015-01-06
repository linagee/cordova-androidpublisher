NOT YET WORKING

cordova-androidpublisher
========================

This Cordova plugin adds a hook to your build command that allows easy upload of your signed Cordova APK to Google Play Developer Console. Because of a restriction of the Google API, you can only update the APK of an app that is already on the Google Play Developer Console. (You have to manually do the process the first time.)

It is fully compatible under Ionic.

You will need a Google Developer account to upload your apps to the Play Store. https://support.google.com/googleplay/android-developer/answer/113468?hl=en

It works like this:

**cordova plugin add https://github.com/linagee/cordova-androidpublisher.git**

**cordova build android --release --publish**

Cordova will be forced to build a release build. Apps in Google Play Store are required to be signed. This plugin will complain if it can't generate a signed APK.

Cordova Setup
=============

You did remember to give your project a unique namespace when you created it, right?

Edit **myProject/config.xml**, change _com.exampleprojecthere-12345_ into a suitable package name. (_com.mydomain.myproject_ is a good start.)

Google Setup
============

Go to Google API Console: https://code.google.com/apis/console

Click 'Create Project' and use a name like 'Cordova push APK' (accept the default Project ID and click Create)

Under 'Boost your app with a Google API', click 'Enable an API'

In the 'Filter by API' on the lower right, type in 'google play android' and you should see 'Google Play Android Developer API'. Click Status on the right to turn it On.

On the left of the screen, click 'Credentials'

On the right side, under OAuth, click 'Create new Client ID'

Select 'Service Account' and click 'Create Client ID' (this means our script will have a stored authentication credential, not use the tranditional callback/OAuth pages)

A .p12 file will be downloaded. Discard/ignore it. Lets use JSON. Remember what Certificate Fingerprints are there for later.

Click 'Generate new JSON key'

Save the .json file and download/move it to ~/.androidKeys

Delete the old .p12 Certificate Fingerprint (not the JSON one!) Its probably the first one that you'll want to delete.

Go to the Google Play Developer Console: https://play.google.com/apps/publish/

At the left, click 'Settings'

Click 'API access'

Under 'Service Accounts', configure the API key you created previously to be able to upload new APKs.


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


How does this work?
===================

This uses the after_build hook and the Google Play Developer API. (https://developers.google.com/android-publisher/)

