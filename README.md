POSSIBLY WORKING

1/7/2015 - Looking for a report of this successfully working. Wasn't able to test it myself because of a keystore issue. Please email linagee@gmail.com if you have it working.

cordova-androidpublisher
========================

This Cordova plugin adds a hook that runs after your build command that allows easy upload of your signed Cordova APK to Google Play Developer Console. Because of a restriction of the Google API, you can only update the APK of an app that is already on the Google Play Developer Console. (You have to manually do the process the first time.)

It is fully compatible under Ionic.

You will need a Google Developer account to upload your apps to the Play Store. https://support.google.com/googleplay/android-developer/answer/113468?hl=en

It works like this:

**cordova plugin add https://github.com/linagee/cordova-androidpublisher.git**

**cordova build android --publish**

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

In the 'Filter by API' on the lower right, type in 'google play android' and you should see 'Google Play Android Developer API'. Click on the right to turn it on.

On the left of the screen, click 'Credentials'

On the right side, under OAuth, click 'Create new Client ID'

Select 'Service Account' and click 'Create Client ID' (this means our script will have a stored authentication credential, not use the tranditional callback/OAuth pages)

A .p12 file will be downloaded. Discard/ignore it. Lets use JSON like a pro. Remember what Certificate Fingerprints are there for later.

Click 'Generate new JSON key'

Save the .json file and download/move it to ~/.androidKeys

Delete the old .p12 Certificate Fingerprint (not the JSON one!) Its probably the first one in the list.

Go to the Google Play Developer Console: https://play.google.com/apps/publish/

At the left, click 'Settings'

Click 'API access'

Under 'Getting Started', you should see your project name (possibly 'Cordova push APK' if you used that earlier), click 'Link'

Under 'Service Accounts', click 'Grant access', and make sure that 'Manage Alpha & Beta APKs' is checked. Click 'Add user'.

You'll see the User accounts screen come up where you can verify your service account has access.


Generating Keystore
===================

If you don't yet have a keystore file:

**mkdir -p ~/.androidKeys**

**keytool -genkey -v -keystore ~/.androidKeys/my-release-key.keystore -alias release_key -keyalg RSA -keysize 2048 -validity 10000**

Adding Keystore to your project
===============================

If you don't yet have a keystore defined for your project:

Create **myProject/platforms/android/ant.properties** and add the following:

**key.store=/home/linagee/.androidKeys/my-release-key.keystore**
**key.alias=release_key**

(Or use /Users/linagee/.androidKeys above if you're on a Mac. It does not support using ~ for the home directory.)

Test generating a signed release APK
====================================

Inside your project directory:

**cordova build android --release**

This should generate an APK file: **myProject/platforms/android/ant-build/MyProject-release.apk**

Test building and publishing APK
================================

Inside your project directory:

**cordova build android --publish**

(This will also build using --release but its not necessary as the option is forced.)

Common errors
=============

No access or refresh token is set. - API key is probably not authenticated on Google Play Developer Console.

No application was found for the given package name. - This tool is only able to upload APKs for existing projects. Please create a project under the Google Play Developer Console (https://play.google.com/apps/publish/) and create an app using the same package name as defined in your Cordova project. (You can use 'Prepare Store Listing'.)


How does this work?
===================

This uses the after_build hook and the Google Play Developer API. (https://developers.google.com/android-publisher/)

