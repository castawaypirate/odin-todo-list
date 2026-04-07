import "../css/styles.css";

document
  .querySelector(".toggle")
  .addEventListener("click", function toggleNav() {
    document.querySelector("#sidebar").classList.toggle("min");
  });
