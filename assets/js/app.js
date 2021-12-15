const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const leftLine = $(".line--from");
const rightLine = $(".line--to");
let leftLanguageActive = $(".dictionary__from--active");
let rightLanguageActive = $(".dictionary__to--active");
const translateDictionary = $(".dictionary__from");
const translatedDictionary = $(".dictionary__to");

class Dictionary {
  #translateFromLanguage;
  #translateToLanguage;
  constructor(translateFromElm, translateToElm) {
    this.translateFromElm = translateFromElm;
    this.translateToElm = translateToElm;
    this.initApp();
  }

  initApp() {
    rightLine.style.left = rightLanguageActive.offsetLeft + "px";
    rightLine.style.width = rightLanguageActive.offsetWidth + "px";

    leftLine.style.left = leftLanguageActive.offsetLeft + "px";
    leftLine.style.width = leftLanguageActive.offsetWidth + "px";

    this.#translateFromLanguage = "eng";
    this.#translateToLanguage = "vie";
  }

  switchCurrentLanguage() {
    if (this.#translateFromLanguage === "eng") {
      this.#translateFromLanguage = "vie";
      this.#translateToLanguage = "eng";

      return;
    }

    this.#translateFromLanguage = "eng";
    this.#translateToLanguage = "vie";
  }

  switchLine(direction) {
    if (direction === "left") {
      const target =
        this.#translateFromLanguage === "vie"
          ? $(".dictionary__from p[data-language=eng]")
          : $(".dictionary__from p[data-language=vie]");
      leftLanguageActive.classList.remove("dictionary__to--active");
      leftLanguageActive = target;
      leftLanguageActive.classList.add("dictionary__to--active");

      leftLine.style.left = leftLanguageActive.offsetLeft + "px";
      leftLine.style.width = leftLanguageActive.offsetWidth + "px";
      return;
    }

    const target =
      this.#translateToLanguage === "vie"
        ? $(".dictionary__to p[data-language=eng]")
        : $(".dictionary__to p[data-language=vie]");

    rightLanguageActive.classList.remove("dictionary__to--active");
    rightLanguageActive = target;
    rightLanguageActive.classList.add("dictionary__to--active");

    rightLine.style.left = rightLanguageActive.offsetLeft + "px";
    rightLine.style.width = rightLanguageActive.offsetWidth + "px";
  }

  switchLanguage(e, direction) {
    if (e.target.tagName !== "P" && e.target.tagName !== "svg") return;

    if (direction === "right") {
      if (e.target.dataset.language === this.#translateToLanguage) return;

      this.switchLine("right");
      this.switchLine("left");
      this.switchCurrentLanguage();

      return;
    }

    if (direction === "left") {
      if (e.target.dataset.language === this.#translateFromLanguage) return;

      this.switchLine("left");
      this.switchLine("right");
      this.switchCurrentLanguage();

      return;
    }
    // Switch btn
    this.switchLine("left");
    this.switchLine("right");
    this.switchCurrentLanguage();
  }

  showModal(e) {
    $(".modal").classList.toggle("hidden");
    $(".overlay").classList.toggle("hidden");
  }

  closeModal(e) {
    if (
      e.target.classList.contains("modal__close") ||
      e.target.classList.contains("modal")
    ) {
      $(".modal").classList.toggle("hidden");
      $(".overlay").classList.toggle("hidden");
    }
    return;
  }

  preventPasteImage(e) {
    e.preventDefault();
    let text = e.clipboardData.getData("text/plain");
    document.execCommand("insertText", false, text);
  }
}

const app = new Dictionary();

// Prevent paste Image
$("[contenteditable]").addEventListener("paste", app.preventPasteImage);

// Close modal
$(".modal").addEventListener("click", app.closeModal);

// Show modal by clicking btn
$(".btn-dictionary").addEventListener("click", app.showModal);

translateDictionary.addEventListener("click", function (e) {
  app.switchLanguage(e, "left");
});

translatedDictionary.addEventListener("click", function (e) {
  app.switchLanguage(e, "right");
});

$(".dictionary__icon").addEventListener("click", app.switchLanguage.bind(app));
