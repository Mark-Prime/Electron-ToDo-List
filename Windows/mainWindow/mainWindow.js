const electron = require("electron");
const { ipcRenderer } = electron;
const ul = document.querySelector('ul')
const mainBody = document.getElementById('main-body')
const header = document.querySelector(".header");
const subheader = document.querySelector(".subheader");
const description = document.querySelector(".description");
const btnDelete = document.getElementById("btn-delete")
let selectedItem;

function setupTrigger() {
    const triggers = document.querySelectorAll(".sidenav-trigger");
    console.log(triggers)
    Array.from(triggers).forEach(function (event) {
      event.addEventListener("click", function (event) {
          const dataset = event.toElement.dataset;
          header.textContent = dataset.title;
          subheader.textContent = dataset.importance;
          description.textContent = dataset.description;

          selectedItem = event.target.parentElement.parentElement;
        });
    });
    
}

setupTrigger();

// Catch item:add
ipcRenderer.on("item:add", function (e, item) {
  const tr = document.createElement("tr");
  tr.id = item.title;
  tr.innerHTML = `
                <td>
                    <label>
                        <input type="checkbox" class="filled-in" />
                        <span>Incomplete</span>
                    </label>
                </td>
                <td>${item.title}</td>
                <td>${item.importance}</td>
                <td>
                    <a 
                        href="#" 
                        data-target="slide-out" 
                        class="sidenav-trigger"
                        data-title="${item.title}"
                        data-importance="${item.importance}"
                        data-description="${item.description}"
                    >Details...</a>
                </td>`;
  mainBody.appendChild(tr)
  setupTrigger();
});

// Catch item:clear
ipcRenderer.on("item:clear", function () {
  mainBody.innerHTML = "";
});

document.addEventListener("DOMContentLoaded", function () {
    let elems = document.querySelectorAll(".sidenav");
    let instances = M.Sidenav.init(elems, { edge: "right" });
});

btnDelete.addEventListener("click", function (event) {
    selectedItem.remove()
});