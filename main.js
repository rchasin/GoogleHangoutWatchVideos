DEFAULT_WIDTH = 500
DEFAULT_HEIGHT = 400

function sendUpdatedVideoParams() {
  /* Function called to update state when someone enters a new URL/width/height */
  var embedUrl = document.getElementById("videoUrlInput").value;
  var embedHeight = document.getElementById("videoHeightInput").value;
  var embedWidth = document.getElementById("videoWidthInput").value;
  newState = {
    "video_url": embedUrl,
    "video_width": embedWidth,
    "video_height": embedHeight,
    "old_playing": "false",
    "playing": "false",
  };
  console.log("Triggering a state change due to video params. Setting state:");
  console.log(newState);
  gapi.hangout.data.submitDelta(newState);
}

function togglePlayingState() {
  var state = gapi.hangout.data.getState();
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

function stateChanged(event) {
  /* Function called when state is updated */

  // Handle a video url or dimension change
  var state = gapi.hangout.data.getState();
  console.log("Received a state change event, updating based on state:");
  console.log(state);
  var embedUrl = state["video_url"] || "";
  var embedWidth = state["video_width"] || DEFAULT_WIDTH;
  var embedHeight = state["video_height"] || DEFAULT_HEIGHT;
  var playing = JSON.parse(state["playing"] || "false");
  var oldPlaying = JSON.parse(state["old_playing"] || "false");

  var videoPlayer = $("#videoPlayer");
  var currentVideoSource = videoPlayer.src;
  // If the URL has changed, use a new one in the <video> tag
  if(!currentVideoSource || (currentVideoSource != embedUrl)) {
    videoPlayer.setAttribute("src", embedUrl);
  }
  // Always set the width/height to the desired values
  videoPlayer.setAttribute("width", embedWidth);
  videoPlayer.setAttribute("height", embedHeight);

  // Handle a play/pause change
  if (playing && !oldPlaying) {
    videoPlayer.play();
  } else if (!playing && oldPlaying) {
    videoPlayer.pause();    
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
