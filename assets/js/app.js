const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const lineTo = $(".line--to");
const lineFrom = $(".line--from");
let languageFromActive = $(".dictionary__from--active");
let languageToActive = $(".dictionary__to--active");
const translateFrom = $(".dictionary__from");
const translateTo = $(".dictionary__to");

lineTo.style.left = languageToActive.offsetLeft + "px";
lineTo.style.width = languageToActive.offsetWidth + "px";

lineFrom.style.left = languageToActive.offsetLeft + "px";
lineFrom.style.width = languageFromActive.offsetWidth + "px";

translateTo.addEventListener("click", (e) => {
  if (e.target.classList.contains("line--to")) return;

  languageToActive.classList.remove("dictionary__to--active");
  languageToActive = e.target;
  languageToActive.classList.add("dictionary__to--active");
  lineTo.style.left = languageToActive.offsetLeft + "px";
  lineTo.style.width = languageToActive.offsetWidth + "px";
});

translateFrom.addEventListener("click", (e) => {
  console.log(e.target.tagName);
  if (e.target.tagName !== "P") return;

  languageFromActive.classList.remove("dictionary__from--active");
  languageFromActive = e.target;
  languageFromActive.classList.add("dictionary__from--active");
  lineFrom.style.left = languageFromActive.offsetLeft + "px";
  lineFrom.style.width = languageFromActive.offsetWidth + "px";
});

class Dictionary {
  constructor(translateFromElm, translateToElm) {
    this.translateFromElm = translateFromElm;
    this.translateToElm = translateToElm;
  }

  switchLanguage(e) {}
}

$("[contenteditable]").addEventListener("paste", (e) => {
  e.preventDefault();
  var text = e.clipboardData.getData("text/plain");
  document.execCommand("insertText", false, text);
});

// toggle Modal
$(".modal").addEventListener("click", (e) => {
  if (
    e.target.classList.contains("modal__close") ||
    e.target.classList.contains("modal")
  ) {
    $(".modal").classList.toggle("hidden");
    $(".overlay").classList.toggle("hidden");
  }
});

$(".btn-dictionary").addEventListener("click", (e) => {
  $(".modal").classList.toggle("hidden");
  $(".overlay").classList.toggle("hidden");
});
