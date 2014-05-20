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

function embedVideo(event) {
  /* Function called when state is updated */
  var state = gapi.hangout.data.getState();
  console.log("Received a state change event, updating based on state:");
  console.log(state);
  var embedUrl = state["video_url"];
  var embedWidth = state["video_width"];
  var embedHeight = state["video_height"];
  var playing = JSON.parse(state["playing"]);
  var oldPlaying = JSON.parse(state["old_playing"]);
  var ifr = document.getElementById("videoIframe");
  if (ifr.getAttribute("src") != embedUrl) {
    ifr.setAttribute("src", embedUrl);
  }
  ifr.setAttribute("width", embedWidth);
  ifr.setAttribute("height", embedHeight);
  if ((playing && !oldPlaying) || (!playing && oldPlaying)) {
    $(ifr).click();
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
gapi.hangout.data.onStateChanged.add(embedVideo);