const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const leftLine = $(".line--from");
const rightLine = $(".line--to");
let leftLanguageActive = $(".dictionary__from--active");
let rightLanguageActive = $(".dictionary__to--active");
const translateDictionary = $(".dictionary__from");
const translatedDictionary = $(".dictionary__to");
const translateElm = $(".dictionary__translate");
const translatedElm = $(".dictionary__translated");
const btnAddTo = $(".btn.btn-dictionary");
const btnClearData = $(".clear-data");
const formAddTo = $(".modal__form");

class Dictionary {
  #translateFromLanguage;
  #translateToLanguage;
  #initData;
  #typingTimeout;
  constructor(translateElm, translatedElm) {
    this.translateElm = translateElm;
    this.translatedElm = translatedElm;
    this.initApp();
  }

  initApp() {
    rightLine.style.left = rightLanguageActive.offsetLeft + "px";
    rightLine.style.width = rightLanguageActive.offsetWidth + "px";

    leftLine.style.left = leftLanguageActive.offsetLeft + "px";
    leftLine.style.width = leftLanguageActive.offsetWidth + "px";

    this.#translateFromLanguage = "eng";
    this.#translateToLanguage = "vie";

    // this.#initData = [
    //   {
    //     vocal: "hello",
    //     meaning: "Xin chào",
    //     type: "noun",
    //     example: "<strong>Hello</strong>, I'm Vu",
    //   },
    //   {
    //     vocal: "hi",
    //     meaning: "Xin chào",
    //     type: "noun",
    //     example: "<strong>Hi</strong>, I'm Vu",
    //   },
    //   {
    //     vocal: "year",
    //     meaning: "năm",
    //     type: "noun",
    //     example: "Happy new <strong>year</strong>",
    //   },
    //   {
    //     vocal: "age",
    //     meaning: "tuổi",
    //     type: "noun",
    //     example: "What is your <strong>age?</strong>",
    //   },
    // ];
    this.#initData = new Map([
      [
        "hello",
        {
          vocal: "hello",
          meaning: "Xin chào",
          type: "noun",
          example: "<strong>Hello</strong>, I'm Vu",
        },
      ],
      [
        "hi",
        {
          vocal: "hi",
          meaning: "Xin chào",
          type: "noun",
          example: "<strong>Hi</strong>, I'm Vu",
        },
      ],
      [
        "year",
        {
          vocal: "year",
          meaning: "năm",
          type: "noun",
          example: "Happy new <strong>year</strong>",
        },
      ],
    ]);
    console.log(this.#initData.get("hello"));
  }

  clearData() {
    this.translateElm.innerText = "";
    this.translatedElm.firstElementChild.innerText = "";
    $(".dictionary__explaination").innerHTML = "";
    btnAddTo.classList.add("btn-hidden");
    btnClearData.classList.add("hidden");
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
      leftLanguageActive.classList.remove("dictionary__from--active");
      leftLanguageActive = target;
      leftLanguageActive.classList.add("dictionary__from--active");

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
      this.translate($(".dictionary__translate").innerText.trim());

      return;
    }

    if (direction === "left") {
      if (e.target.dataset.language === this.#translateFromLanguage) return;

      this.switchLine("left");
      this.switchLine("right");
      this.switchCurrentLanguage();
      this.translate($(".dictionary__translate").innerText.trim());

      return;
    }
    // Switch btn
    this.switchLine("left");
    this.switchLine("right");
    this.switchCurrentLanguage();
    this.translate($(".dictionary__translate").innerText.trim());
  }

  showModal(e) {
    $(".modal").classList.toggle("hidden");
    $(".overlay").classList.toggle("hidden");
  }

  closeModal(e) {
    $(".modal").classList.toggle("hidden");
    $(".overlay").classList.toggle("hidden");
    return;
  }

  translate(data) {
    if (!data) return;
    if (this.#initData.get(data)) {
      const findingData = this.#initData.get(data);
      const html = `
      <p class="">Loại từ: <span>${findingData.type}</span></p>
      <p>Ví dụ cho <span>${findingData.vocal}</span></p>
      <blockquote>
        ${findingData.example}
      </blockquote>
    </div>`;
      $(".dictionary__explaination").innerHTML = html;
      $(".translated").innerText = findingData.meaning;
      return;
    }

    /* Khong tim ra trong init data */

    /* Khong su dung API */
    if (!$("#switch-api").checked) {
      btnAddTo.classList.remove("btn-hidden");
      this.translatedElm.firstElementChild.innerText = "";
      return;
    }

    /* Dung google API */
    btnAddTo.classList.add("btn-hidden");
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${
      this.#translateFromLanguage === "eng" ? "en" : "vi"
    }&tl=${
      this.#translateToLanguage === "eng" ? "en" : "vi"
    }&dt=t&q=${encodeURI(data)}`;
    console.log(url);

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        const [x] = data;
        const translatedWord = x
          .map((elm) => elm[0])
          .map((elm) => elm.replace(elm[0], elm[0].toUpperCase()));
        $(".translated").innerText = translatedWord.join("");
      })
      .catch((error) => {
        console.log("Loi API roi");
      });
  }

  handleInputChange() {
    if (!this.translateElm.innerText.trim()) this.clearData();
    btnClearData.classList.remove("hidden");
    if (this.#typingTimeout) {
      clearTimeout(this.#typingTimeout);
    }

    $(".dictionary__explaination").innerHTML = "";

    const data = $(".dictionary__translate").innerText.trim().toLowerCase();
    this.#typingTimeout = setTimeout(() => {
      this.translate(data);
    }, 800);
  }

  addAWord(data) {
    // this.#initData.push(data);
    this.#initData.set(data.vocal, data);
    formAddTo.reset();
    $(".modal__example").innerText = "";
    btnAddTo.classList.add("btn-hidden");
    this.closeModal();
    this.translate($(".dictionary__translate").innerText.trim().toLowerCase());
  }

  preventPasteImage(e) {
    e.preventDefault();
    let text = e.clipboardData.getData("text/plain");
    document.execCommand("insertText", false, text);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const app = new Dictionary(translateElm, translatedElm);
  // Prevent paste Image
  $("[contenteditable]").addEventListener("paste", app.preventPasteImage);

  // Close modal
  $(".modal").addEventListener("click", (e) => {
    if (
      e.target.classList.contains("modal__close") ||
      e.target.classList.contains("modal")
    ) {
      app.closeModal();
    }
  });

  // Show modal by clicking btn
  $(".btn-dictionary").addEventListener("click", (e) => {
    app.showModal();
    $("#modal__vocabulary").value = $(".dictionary__translate").innerText;
    $("#modal__translate").focus();
  });

  // Switch Langugage
  translateDictionary.addEventListener("click", function (e) {
    app.switchLanguage(e, "left");
  });

  translatedDictionary.addEventListener("click", function (e) {
    app.switchLanguage(e, "right");
  });

  $(".dictionary__icon").addEventListener(
    "click",
    app.switchLanguage.bind(app)
  );

  $(".dictionary__translate").addEventListener(
    "input",
    app.handleInputChange.bind(app)
  );

  formAddTo.addEventListener("submit", (e) => {
    e.preventDefault();

    const data = {
      vocal: $("#modal__vocabulary").value.trim().toLowerCase(),
      meaning: $("#modal__translate").value.trim().toLowerCase(),
      type: $(".modal__select").value,
      example: $(".modal__example").innerText.trim(),
    };
    app.addAWord(data);
  });

  $("#switch-api").addEventListener("change", (e) => {
    app.translate($(".dictionary__translate").innerText.trim());
  });
  btnClearData.addEventListener("click", app.clearData.bind(app));
});
