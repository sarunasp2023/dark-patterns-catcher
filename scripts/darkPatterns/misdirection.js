const ENGLISH_KEYWORDS = [
  "essential",
  "necessary",
  "only",
  "more",
  "decline",
  "settings",
  "reject",
  "refuse",
];
const LITHUANIAN_KEYWORDS = ["daugiau", "būtin", "atmesti", "nustatym"];
const GOOD_COOKIES_KEYWORDS = [...ENGLISH_KEYWORDS, ...LITHUANIAN_KEYWORDS];
const DELTAE_COLOR_THRESHOLD = 30;
var goodCokiesButtonsList;
var otherButtonsList;
var firstButtonCasesCount;
var lastButtonCasesCount;

function detectMisdirectionCases(highlight, modify, body) {
  firstButtonCasesCount = 0;
  lastButtonCasesCount = 0;
  goodCokiesButtonsList = [];
  otherButtonsList = [[]];

  const tagsWithoutChildTags = Array.from(
    body.querySelectorAll("div, p, span")
  ).filter((tag) => tag.querySelectorAll("div").length === 0);

  for (const tag of tagsWithoutChildTags) {
    const buttons = tag.querySelectorAll("button,a");
    if (buttons.length > 1) {
      const firstButtonBackgroundColor = getComputedStyle(buttons[0]);
      const firstButtonPosition = buttons[0].getBoundingClientRect();
      const lastButtonBackgroundColor = getComputedStyle(
        buttons[buttons.length - 1]
      );
      const lastButtonPosition =
        buttons[buttons.length - 1].getBoundingClientRect();

      buttons.forEach((button) => {
        const buttonBackgroundColor = getComputedStyle(button);
        const buttonPosition = button.getBoundingClientRect();

        // Compare to first button
        const colorDifferenceFirst = deltaE(
          firstButtonBackgroundColor["background-color"],
          buttonBackgroundColor["background-color"]
        );
        if (areElementsClose(firstButtonPosition, buttonPosition)) {
          if (colorDifferenceFirst > DELTAE_COLOR_THRESHOLD) {
            const isGoodCookieFirst = hasGoodCookieKeyword(
              button.innerText.toLowerCase()
            );
            if (isGoodCookieFirst) {
              goodCokiesButtonsList.push(buttons);
              firstButtonCasesCount++;
              if (highlight) {
                button.parentNode.style.border = "3px dashed red";
              }
            }
          } else {
            otherButtonsList.push(button);
          }
        }

        // Compare to last button
        if (areElementsClose(lastButtonPosition, buttonPosition)) {
          const colorDifferenceLast = deltaE(
            lastButtonBackgroundColor["background-color"],
            buttonBackgroundColor["background-color"]
          );
          if (colorDifferenceLast > DELTAE_COLOR_THRESHOLD) {
            const isGoodCookieLast = hasGoodCookieKeyword(
              button.innerText.toLowerCase()
            );
            if (isGoodCookieLast) {
              goodCokiesButtonsList.push(buttons);
              lastButtonCasesCount++;
              if (highlight) {
                button.parentNode.style.border = "3px dashed red";
              }
            }
          } else {
            otherButtonsList.push(button);
          }
        }
      });
    }
  }

  if (modify) {
    if (firstButtonCasesCount > 0) modifyButtonStyles("firstButtonCase");
    if (lastButtonCasesCount > 0) modifyButtonStyles("lastButtonCase");
  }

  return firstButtonCasesCount + lastButtonCasesCount;
}

function modifyButtonStyles(buttonCase) {
  if (goodCokiesButtonsList) {
    for (var goodCookieButtons of goodCokiesButtonsList) {
      var goodCookieStyle;
      var badCookieStyle;
      for (var goodCookieButton of goodCookieButtons) {
        var isGoodCookie = false;
        GOOD_COOKIES_KEYWORDS.forEach((keyword) => {
          if (goodCookieButton.innerText.toLowerCase().includes(keyword)) {
            goodCookieStyle = getComputedStyle(goodCookieButton);
            goodCookieButton.parentNode.style.border = "3px dashed green";
            isGoodCookie = true;
          }
        });
        if (!isGoodCookie) {
          badCookieStyle = getComputedStyle(goodCookieButton);
        }
      }
      for (var goodCookieButton of goodCookieButtons) {
        Array.from(goodCookieStyle).forEach((key) =>
          goodCookieButton.style.setProperty(
            key,
            goodCookieStyle.getPropertyValue(key),
            goodCookieStyle.getPropertyPriority(key)
          )
        );
        GOOD_COOKIES_KEYWORDS.forEach((keyword) => {
          if (goodCookieButton.innerText.toLowerCase().includes(keyword)) {
            Array.from(badCookieStyle).forEach((key) =>
              goodCookieButton.style.setProperty(
                key,
                goodCookieStyle.getPropertyValue(key),
                goodCookieStyle.getPropertyPriority(key)
              )
            );
          }
        });
      }
    }

    otherButtonsList.forEach((buttons) => {
      if (buttons.length > 1) {
        const buttonIndex =
          buttonCase === "firstButtonCase" ? 0 : buttons.length - 1;
        const backgroundColor = getComputedStyle(buttons[buttonIndex]);

        buttons.forEach((button) => {
          button.style.backgroundColor = backgroundColor;
        });
      }
    });
  }
}

function areElementsClose(firstElement, secondElement) {
  var distanceLimit = calculateDistanceLimit();

  var firstElementX = firstElement.left + firstElement.width / 2;
  var firstElementY = firstElement.top + firstElement.height / 2;

  var secondElementX = secondElement.left + secondElement.width / 2;
  var secondElementY = secondElement.top + secondElement.height / 2;

  var distanceSquared =
    Math.pow(firstElementX - secondElementX, 2) +
    Math.pow(firstElementY - secondElementY, 2);
  var distance = Math.sqrt(distanceSquared);

  return distance < distanceLimit;
}

function calculateDistanceLimit() {
  var viewportWidth = window.innerWidth;
  var viewportWidthLimit = viewportWidth * 0.5;

  var viewportHeight = window.innerHeight;
  var viewportHeightLimit = viewportHeight * 0.5;

  return (viewportWidthLimit + viewportHeightLimit) / 2;
}

function hasGoodCookieKeyword(text) {
  return GOOD_COOKIES_KEYWORDS.some((keyword) => text.includes(keyword));
}

function deltaE(rgbA1, rgbB1) {
  let rgbA = rgbA1
    .slice(rgbA1.indexOf("(") + 1, rgbA1.indexOf(")"))
    .split(", ");
  let rgbB = rgbB1
    .slice(rgbB1.indexOf("(") + 1, rgbB1.indexOf(")"))
    .split(", ");
  let labA = rgb2lab(rgbA);
  let labB = rgb2lab(rgbB);
  let deltaL = labA[0] - labB[0];
  let deltaA = labA[1] - labB[1];
  let deltaB = labA[2] - labB[2];
  let c1 = Math.sqrt(labA[1] * labA[1] + labA[2] * labA[2]);
  let c2 = Math.sqrt(labB[1] * labB[1] + labB[2] * labB[2]);
  let deltaC = c1 - c2;
  let deltaH = deltaA * deltaA + deltaB * deltaB - deltaC * deltaC;
  deltaH = deltaH < 0 ? 0 : Math.sqrt(deltaH);
  let sc = 1.0 + 0.045 * c1;
  let sh = 1.0 + 0.015 * c1;
  let deltaLKlsl = deltaL / 1.0;
  let deltaCkcsc = deltaC / sc;
  let deltaHkhsh = deltaH / sh;
  let i =
    deltaLKlsl * deltaLKlsl + deltaCkcsc * deltaCkcsc + deltaHkhsh * deltaHkhsh;
  return i < 0 ? 0 : Math.sqrt(i);
}

function rgb2lab(rgb) {
  let r = rgb[0] / 255,
    g = rgb[1] / 255,
    b = rgb[2] / 255,
    x,
    y,
    z;
  r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
  g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
  b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;
  x = (r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047;
  y = (r * 0.2126 + g * 0.7152 + b * 0.0722) / 1.0;
  z = (r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883;
  x = x > 0.008856 ? Math.pow(x, 1 / 3) : 7.787 * x + 16 / 116;
  y = y > 0.008856 ? Math.pow(y, 1 / 3) : 7.787 * y + 16 / 116;
  z = z > 0.008856 ? Math.pow(z, 1 / 3) : 7.787 * z + 16 / 116;
  return [116 * y - 16, 500 * (x - y), 200 * (y - z)];
}
