GoogleHangoutWatchVideos
=================

This provides an app for watching video files in a Google Hangout. The
URL to the video itself must be provided
(e.g. https://.../foo.mp4). When one user changes the URL or video
player size, or clicks the video to play/pause, the same operations
occur for all other app users in the hangout.

The url to the js file is currently hardcoded in app.xml; you'll have
to change this to where you host it (or make it relative, I haven't
had the chance to try that out).

Known issues
-----------

* The timing in the video can get off from person to person due to
  their individual lag. There is not yet support for pausing videos
  that are ahead to allow ones behind to catch up.

* Currently flash videos (flv) are not supported.

* There are also many browser limitations. Results of testing:
  * Chrome- can play mp4 and avi
  * Firefox- can't play anything
  * Safari- can play mp4 but not avi
