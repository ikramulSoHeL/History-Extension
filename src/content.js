const currentURL = window.location.href;

chrome.runtime.sendMessage(
  { type: "checkVisited", url: currentURL },
  (response) => {
    if (response.visited) {
      // The website has been visited, display a message
      const messageDiv = document.createElement("div");
      messageDiv.innerText = "You have visited this website before.";
      messageDiv.style.backgroundColor = "yellow";
      messageDiv.style.textAlign = "center";
      messageDiv.style.padding = "10px";
      messageDiv.style.position = "fixed";
      messageDiv.style.top = "0";
      messageDiv.style.width = "100%";
      document.body.prepend(messageDiv);
    }
  }
);
