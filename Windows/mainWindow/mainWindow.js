const electron = require("electron");
const { ipcRenderer } = electron;
const mainBody = document.getElementById('main-body')
const header = document.querySelector(".header");
const subheader = document.querySelector(".subheader");
const description = document.querySelector(".description");
const btnDelete = document.getElementById("btn-delete")
let selectedItem;

function setupTrigger() {
    const triggers = document.querySelectorAll(".sidenav-trigger");
    Array.from(triggers).forEach(function (event) {
      if (!event.getAttribute("enabled")) {
        event.addEventListener("click", function (e) {
          const dataset = e.toElement.dataset;
          header.textContent = dataset.title;
          subheader.textContent = dataset.importance;
          description.textContent = dataset.description;

          selectedItem = e.target.parentElement.parentElement;
        });
        event.setAttribute("enabled", "true");
      }
    });

    const checkboxes = document.querySelectorAll(".checkbox");
    Array.from(checkboxes).forEach(function (event) {
      if (!event.getAttribute("enabled")) {
        event.addEventListener("click", function (e) {
          const data = e.toElement.dataset;
          const search = `span-${data.title}`
          const span = document.getElementById(search);
          if (e.target.checked) {
            e.toElement.parentElement.children[1].textContent = 'Completed';
            span.classList.add("completed");
          } else {
            e.toElement.parentElement.children[1].textContent = "Incomplete";
            span.classList.remove("completed");
          }
        });
        event.setAttribute("enabled", "true");
      }
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
                        <input type="checkbox" class="filled-in checkbox" data-title="${item.title}"/>
                        <span>Incomplete</span>
                    </label>
                </td>
                <td><span id="span-${item.title}"><p class="title">${item.title}<p></span></td>
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