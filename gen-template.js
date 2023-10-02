const fs = require("fs-extra");
const path = require("path");

(async () => {
  const len = 12;
  const name = "HeroSection";
  for (let i = 0; i < len; i++) {
    fs.writeFileSync(
      path.join(__dirname, "/resources/tailwindui/preview", `${name}${i + 1}.html`),
      "",
      "utf8"
    );
  }
})();
