/**
 * Browser-run acceptance check. Pass an existing browser-client tab showing
 * AdventureApp in map mode. This inspects real layout, not source text; it is
 * intentionally separate from the Node rendered-HTML suite.
 */
export async function requireVisibleStarModeEntry(tab) {
  const observation = await tab.playwright.evaluate(() => ({
    viewport: { width: window.innerWidth, height: window.innerHeight },
    controls: Array.from(document.querySelectorAll(
      'nav[aria-label="アプリのモード"] button, nav[aria-label="モバイルのモード切替"] button, button[aria-label="地図から星座モードを開く"]',
    )).map((button) => {
      const rect = button.getBoundingClientRect();
      return {
        name: button.getAttribute("aria-label") || button.textContent.trim(),
        visible: rect.width > 0 && rect.height > 0
          && rect.right > 0 && rect.bottom > 0
          && rect.left < window.innerWidth && rect.top < window.innerHeight,
      };
    }),
  }));
  if (!observation.controls.some((control) => control.name.includes("星座") && control.visible)) {
    throw new Error(`SKY_ENTRY_NOT_VISIBLE ${JSON.stringify(observation)}`);
  }
  return observation;
}

export async function readStarSelection(tab) {
  return tab.playwright.evaluate(() => {
    const region = document.querySelector("#mode-stars");
    const heading = region.querySelector("h3");
    const moonButton = Array.from(region.querySelectorAll("button"))
      .find((button) => button.textContent.trim() === "月");
    return {
      search: region.querySelector("input[list]").value,
      moonPressed: moonButton.getAttribute("aria-pressed"),
      heading: heading?.textContent ?? "",
      details: heading?.parentElement.textContent ?? "",
      status: region.querySelector('[role="status"]').textContent,
    };
  });
}

/** Run only after entering StarGuide. It never starts sensors or requests GPS. */
export async function runMoonSearchAcceptance(tab) {
  const results = [];
  const search = tab.playwright.getByRole("combobox", { name: "月・星・星座を探す", exact: true });
  async function expectSelection(step, expectedSearch, moonSelected, expectedTarget) {
    let state;
    for (let attempt = 0; attempt < 5; attempt += 1) {
      state = await readStarSelection(tab);
      if (state.search === expectedSearch
        && state.moonPressed === String(moonSelected)
        && state.heading.includes(expectedTarget)
        && state.details.includes("月面の明るさ") === moonSelected) {
        results.push({ step, ...state });
        return;
      }
    }
    throw new Error(`MOON_SEARCH_STATE_MISMATCH ${step} ${JSON.stringify(state)}`);
  }

  await tab.playwright.getByRole("button", { name: "月", exact: true }).click();
  await expectSelection("select-moon", "", true, "月");
  await search.fill("北極星");
  await expectSelection("search-polaris-after-moon", "北極星", false, "北極星");
  // Exercise the real clear gesture; an empty fill can be a no-op in a browser bridge.
  await search.press("ControlOrMeta+A");
  await search.press("Backspace");
  await expectSelection("clear-search", "", true, "月");
  await search.fill("   ");
  await expectSelection("whitespace-search", "   ", true, "月");
  await search.fill("moon");
  await expectSelection("english-moon-search", "moon", true, "月");
  return results;
}
