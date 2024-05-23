const detectDarkPatterns = async (sendResponse, highlight, modify) => {
  const domCopy = document.body;

  removeHiddenElements(domCopy);

  const foundCountdownTimerDarkPatternsNumber = await detectCountdownTimerCases(
    highlight,
    modify,
    domCopy
  );
  const foundPreselectionDarkPatternsNumber = detectPreselectionCases(
    highlight,
    modify,
    domCopy
  );
  const foundMisdirectionDarkPatternsNumber = detectMisdirectionCases(
    highlight,
    modify,
    domCopy
  );
  const foundScarcityDarkPatternsNumber = detectScarcityCases(
    highlight,
    modify,
    domCopy
  );
  const foundDisguisedAdDarkPatternsNumber = detectDisguisedAdCases(
    highlight,
    modify,
    domCopy
  );
  const foundSocialProofPatternsNumber = detectSocialProofCases(
    highlight,
    modify,
    domCopy
  );

  const darkPatternsCount =
    foundCountdownTimerDarkPatternsNumber +
    foundPreselectionDarkPatternsNumber +
    foundMisdirectionDarkPatternsNumber +
    foundScarcityDarkPatternsNumber +
    foundDisguisedAdDarkPatternsNumber +
    foundSocialProofPatternsNumber;

  sendResponse({
    darkPatternsCount,
    countdownTimerDarkPatterns: foundCountdownTimerDarkPatternsNumber,
    preselectionDarkPatterns: foundPreselectionDarkPatternsNumber,
    misdirectionDarkPatterns: foundMisdirectionDarkPatternsNumber,
    scarcityDarkPatterns: foundScarcityDarkPatternsNumber,
    disguisedAdDarkPatterns: foundDisguisedAdDarkPatternsNumber,
    socialProofDarkPatterns: foundSocialProofPatternsNumber,
  });

  foundDarkPatterns = 0;
};

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  const { highlight, modify } = request.settings;

  if (request.requestType === "darkPatternsCount") {
    detectDarkPatterns(sendResponse, highlight, modify);
  }

  return true;
});

function removeHiddenElements(dom) {
  const hiddenElements = dom.querySelectorAll(
    '*[aria-hidden="true"] *, [class*="hidden"] *, .hidden *, [style*="hidden"] *'
  );

  for (const elem of hiddenElements) {
    elem.remove();
  }
}
