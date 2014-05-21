function sendUpdatedVideoParams() {
  /* Function called to update state when someone enters a new URL/width/height */
  var state = gapi.hangout.data.getState();
  console.log("Attempt to use new video params. Current state:");
  console.log(state);
  // get out current playing/oldPlaying values to reuse if we aren't changing the url
  var playing = JSON.parse(state["playing"] || "false");
  var oldPlaying = JSON.parse(state["old_playing"] || "false");
  // get out current video url to determine whether we are changing the url
  var currentEmbedUrl = state["video_url"];
  // extract the new params we want from the fields
  var embedUrl = document.getElementById("videoUrlInput").value;
  var embedHeight = document.getElementById("videoHeightInput").value;
  var embedWidth = document.getElementById("videoWidthInput").value;  
  // if the video url has changed, reset playing and oldPlaying to false
  if (currentEmbedUrl != embedUrl) {
    playing = false;
    oldPlaying = false;
  }
  newState = {
    "video_url": embedUrl,
    "video_width": embedWidth,
    "video_height": embedHeight,
    "old_playing": JSON.stringify(playing),  // these should not be false, should be current vals
    "playing": JSON.stringify(oldPlaying),
  };
  console.log("Triggering a state change due to video params. Setting state:");
  console.log(newState);
  gapi.hangout.data.submitDelta(newState);
}

function togglePlayingState() {
  var state = gapi.hangout.data.getState();
  console.log("Attempt to toggle playing state. Current state:");
  console.log(state);
  if(state["video_url"]) {
    playing = JSON.parse(state["playing"]);
    newPlaying = !playing;
    newState = {
      "old_playing": JSON.stringify(playing),
      "playing": JSON.stringify(newPlaying)
    };
    console.log("Triggering a state change due to play/pause. Setting state:");
    console.log(newState);
    gapi.hangout.data.submitDelta(newState);
  }
}

function stateChanged(event) {
  /* Function called when state is updated */

  // Handle a video url or dimension change
  var state = gapi.hangout.data.getState();
  console.log("Received a state change event, updating based on state:");
  console.log(state);
  var embedUrl = state["video_url"];
  var embedWidth = state["video_width"];
  var embedHeight = state["video_height"];
  var playing = JSON.parse(state["playing"] || "false");
  var oldPlaying = JSON.parse(state["old_playing"] || "false");

  var videoPlayer = $("#videoPlayer");
  var currentVideoSource = videoPlayer.attr("src");
  // If the URL has changed (and there is one), use the new one in the <video> tag
  if (embedUrl && (!currentVideoSource || (currentVideoSource != embedUrl))) {
    videoPlayer.attr("src", embedUrl);
  }
  // Always set the width/height to the desired values if given
  if (embedWidth) {
    videoPlayer.attr("width", embedWidth);
  }
  if (embedHeight) {
    videoPlayer.attr("height", embedHeight);
  }

  // Handle a play/pause change
  // videoPlayer is a jQuery object so get the underlying DOM object with .get(0)
  if (playing && !oldPlaying) {
    videoPlayer.get(0).play();
  } else if (!playing && oldPlaying) {
    videoPlayer.get(0).pause();    
  }
}

function init() {
  // When API is ready...
  gapi.hangout.onApiReady.add(
      function(eventObj) {
        if (eventObj.isApiReady) {
          document.getElementById('playButton')
            .style.visibility = 'visible';
        }
      });
}

// Wait for gadget to load.
gadgets.util.registerOnLoadHandler(init);
gapi.hangout.data.onStateChanged.add(stateChanged);
