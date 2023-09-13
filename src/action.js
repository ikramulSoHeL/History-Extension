document.addEventListener("DOMContentLoaded", function () {
  var history = document.getElementById("urlList");
  var clearBtn = document.getElementById("clearBtn");
  var exportTxtBtn = document.getElementById("exportTxtBtn");
  var exportCsvBtn = document.getElementById("exportCsvBtn");

  chrome.storage.local.get(["urlList"], function (result) {
    var urlList = result.urlList;
    if (urlList === undefined) {
      urlList = [];
    }
    if (urlList.length == 0) {
      var span = document.createElement("span");
      span.style.color = "red";
      span.style.fontWeight = "bold";
      span.style.fontSize = "20px";
      span.style.textAlign = "center";
      span.appendChild(document.createTextNode("No history"));
      history.appendChild(span);
    } else {
      // sort by timestamp
      var sortedUrlList = urlList.sort(function (a, b) {
        return b.timestamp - a.timestamp;
      });
      sortedUrlList.forEach(function (url) {
        var hostname = url.hostname;
        var li = document.createElement("li");
        var time = document.createElement("time");
        var span = document.createElement("span");
        var btn = document.createElement("button");

        time.classList.add("text");
        time.innerHTML = new Date(url.timestamp).toLocaleString();

        span.innerHTML = "Url: " + hostname;
        span.classList.add("url");
        span.addEventListener("click", function (e) {
          e.preventDefault();
          //   console.log(hostname);
          chrome.tabs.create({ url: hostname });
        });

        btn.classList.add("removeBtn");
        btn.appendChild(document.createTextNode("Remove"));
        btn.addEventListener("click", function (e) {
          e.preventDefault();
          var index = urlList.findIndex(function (e) {
            return e.hostname == url.hostname;
          });
          if (index !== -1) {
            urlList.splice(index, 1);

            chrome.storage.local.set({ urlList: urlList }, function () {
              li.remove();
            });
          }
        });

        li.classList.add("urlItem");
        li.appendChild(span);
        li.appendChild(time);
        li.appendChild(btn);
        history.appendChild(li);
      });
    }
  });

  clearBtn.addEventListener("click", function (e) {
    e.preventDefault();
    chrome.storage.local.set({ urlList: [] }, function () {
      history.innerHTML = "";
      var span = document.createElement("span");
      span.appendChild(document.createTextNode("No history"));
      history.appendChild(span);
    });
  });

  exportTxtBtn.addEventListener("click", function (e) {
    e.preventDefault();
    chrome.storage.local.get(["urlList"], function (result) {
      var urlList = result.urlList;
      if (urlList === undefined) {
        urlList = [];
      }
      var text = "";
      urlList.forEach(function (url) {
        text += url.hostname + "," + url.timestamp + "," + url.path + "\n";
      });
      var blob = new Blob([text], { type: "text/plain" });
      var blobURL = URL.createObjectURL(blob);

      // Create an anchor element to trigger the download
      const anchor = document.createElement("a");
      anchor.href = blobURL;
      anchor.download = "history.txt"; // Set the desired file name

      // Programmatically click the anchor element to initiate the download
      anchor.click();

      // Clean up by revoking the object URL
      URL.revokeObjectURL(blobURL);
    });
  });

  exportCsvBtn.addEventListener("click", function (e) {
    e.preventDefault();
    chrome.storage.local.get(["urlList"], function (result) {
      var urlList = result.urlList;
      if (urlList === undefined) {
        urlList = [];
      }
      var text = "";
      urlList.forEach(function (url) {
        text += url.hostname + "," + url.timestamp + "," + url.path + "\n";
      });
      var blob = new Blob([text], { type: "text/csv" });
      var blobURL = URL.createObjectURL(blob);

      // Create an anchor element to trigger the download
      const anchor = document.createElement("a");
      anchor.href = blobURL;
      anchor.download = "history.csv"; // Set the desired file name

      // Programmatically click the anchor element to initiate the download
      anchor.click();

      // Clean up by revoking the object URL
      URL.revokeObjectURL(blobURL);
    });
  });
});
