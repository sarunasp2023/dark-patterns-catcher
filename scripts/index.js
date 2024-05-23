document.addEventListener('DOMContentLoaded', async function () {
  const highlightCheckbox = document.getElementById('highlightSwitch');
  const modifyCheckbox = document.getElementById('modifySwitch');
  const highlightPatternAlert = document.getElementById('highlightPatternAlert');
  const removePatternAlert = document.getElementById('removePatternAlert');
  
  loadSettings(highlightCheckbox, modifyCheckbox);

  highlightCheckbox.addEventListener('change', async function () {
    await updateSettingsAndSendMessage();
  });

  modifyCheckbox.addEventListener('change', async function () {
    await updateSettingsAndSendMessage();
  });

  highlightPatternAlert.addEventListener('click', async function() {
      let [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });

      chrome.tabs.reload(tab.id);
      chrome.runtime.reload();
  });

  removePatternAlert.addEventListener('click', async function() {
    let [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    chrome.tabs.reload(tab.id, async function() {
      await updateSettingsAndSendMessage();
    });
    
  });

  await updateSettingsAndSendMessage();
});

async function updateSettingsAndSendMessage() {
  try {
      let [tab] = await chrome.tabs.query({
          active: true,
          currentWindow: true,
      });

      // Retrieve updated settings from checkboxes
      const highlightCheckbox = document.getElementById('highlightSwitch');
      const modifyCheckbox = document.getElementById('modifySwitch');
      const highlightSetting = highlightCheckbox.checked ? 1 : 0;
      const modifySetting = modifyCheckbox.checked ? 1 : 0;

      // Save settings in local storage
      chrome.storage.local.set({
          "highlightSetting": highlightSetting,
          "modifySetting": modifySetting,
      });

      // Send updated settings to content script
      const response = await chrome.tabs.sendMessage(tab.id, {
          requestType: "darkPatternsCount",
          settings: {
              highlight: highlightSetting,
              modify: modifySetting
          }
      });

      const countdownTimerCount = response.countdownTimerDarkPatterns || 0;
      const preselectionCount = response.preselectionDarkPatterns || 0;
      const misdirectionCount = response.misdirectionDarkPatterns || 0;
      const scarcityCount = response.scarcityDarkPatterns || 0;
      const disguisedAdCount = response.disguisedAdDarkPatterns || 0;
      const socialProofCount = response.socialProofDarkPatterns || 0;

      // Update UI based on the response
      if (response.darkPatternsCount > 0) {
          document.getElementById("darkPatternsCount").style.color = "red";
      } else {
          document.getElementById("darkPatternsCount").style.color = "green";
      }

      document.getElementById("darkPatternsCount").textContent = response.darkPatternsCount;

      if (response.darkPatternsCount > 0) {
          document.getElementById("found-pattern-cases").textContent = "Found types";
      }
      
      if (countdownTimerCount > 0) {
          document.getElementById("countdownTimerCount").textContent = countdownTimerCount;
          const countdownTimerSection = document.getElementById("countdownTimerSection");
          countdownTimerSection.style.display = "block";
      }

      if (preselectionCount > 0) {
          document.getElementById("preselectionCount").textContent = preselectionCount;
          const preselectionSection = document.getElementById("preselectionSection");
          preselectionSection.style.display = "block";
      }

      if (misdirectionCount > 0) {
          document.getElementById("misdirectionCount").textContent = misdirectionCount;
          const misdirectionSection = document.getElementById("misdirectionSection");
          misdirectionSection.style.display = "block";
      }

      if (scarcityCount > 0) {
        document.getElementById("scarcityCount").textContent = scarcityCount;
        const scarcitySection = document.getElementById("scarcitySection");
        scarcitySection.style.display = "block";
      }

      if (disguisedAdCount > 0) {
        document.getElementById("disguisedAdCount").textContent = disguisedAdCount;
        const scarcitySection = document.getElementById("disguisedAdSection");
        scarcitySection.style.display = "block";
      }

      if (socialProofCount > 0) {
        document.getElementById("socialProofCount").textContent = socialProofCount;
        const socialProofSection = document.getElementById("socialProofSection");
        socialProofSection.style.display = "block";
      }
  } catch (error) {
      console.log(error);
  }
}

function loadSettings(highlightCheckbox, modifyCheckbox) {
  chrome.storage.local.get(["highlightSetting", "modifySetting"], function (result) {
      highlightCheckbox.checked = result.highlightSetting === 1;
      modifyCheckbox.checked = result.modifySetting === 1;
  });
}