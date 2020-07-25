const electron = require("electron");
const { ipcRenderer } = electron;

const form = document.querySelector("form");
form.addEventListener("submit", submitForm);

function submitForm(e) {
    e.preventDefault();
    const title = document.querySelector("#item").value;
    const description = document.querySelector("#description").value;
    const importance = document.querySelector("#importance").value;

    const item = {
      title: title || "N/A",
      description: description || "N/A",
      importance: importance || "Moderate",
    };

    ipcRenderer.send("item:add", item);
}

document.addEventListener("DOMContentLoaded", function () {
  var elems = document.querySelectorAll("select");
  var instances = M.FormSelect.init(elems, options);
});
