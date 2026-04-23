export function renderMain(el) {
  const main = document.querySelector("#content");
  main.innerHTML = "";
  main.appendChild(el);
}
