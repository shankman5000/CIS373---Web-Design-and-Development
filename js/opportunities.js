"use strict";
// Example opportunities, not a live list of available rescue positions.
const opportunities = [
  { id: "animal-care", title: "Animal Care Support", category: "volunteer", description: "Ask about helping with basic animal care and enrichment." },
  { id: "event-support", title: "Community Event Support", category: "volunteer", description: "Ask about supporting adoption events and community outreach." },
  { id: "transport", title: "Transportation Help", category: "volunteer", description: "Ask about assisting with safe transportation when needed." },
  { id: "foster-home", title: "Foster Home", category: "foster", description: "Ask about temporary foster care and available support." }
];
const storageKeys = { filter: "tcar-opportunity-filter", saved: "tcar-saved-opportunities" };
const filterElement = document.getElementById("opportunity-filter");
const listElement = document.getElementById("opportunity-list");
const statusElement = document.getElementById("opportunity-status");

function readSaved() {
  try {
    const data = JSON.parse(localStorage.getItem(storageKeys.saved) || "[]");
    return Array.isArray(data) ? data.filter(id => opportunities.some(item => item.id === id)) : [];
  } catch { return []; }
}
function readFilter() {
  try { return localStorage.getItem(storageKeys.filter) || "all"; }
  catch { return "all"; }
}
function storeValue(key, value) {
  try { localStorage.setItem(key, value); }
  catch { statusElement.textContent = "Your browser cannot save preferences right now; filtering and saving still work on this page."; }
}
let savedIds = readSaved();
function renderOpportunities() {
  const selected = filterElement.value;
  const visible = opportunities.filter(item => selected === "all" || item.category === selected);
  listElement.replaceChildren();
  for (const item of visible) {
    const card = document.createElement("article"); card.className = "opportunity-card";
    const heading = document.createElement("h3"); heading.textContent = item.title;
    const description = document.createElement("p"); description.textContent = item.description;
    const button = document.createElement("button"); button.type = "button"; button.className = "save-button";
    const isSaved = savedIds.includes(item.id);
    button.textContent = isSaved ? "Remove saved opportunity" : "Save opportunity";
    button.setAttribute("aria-pressed", String(isSaved));
    button.setAttribute("aria-label", `${isSaved ? "Remove" : "Save"} ${item.title}`);
    button.addEventListener("click", () => toggleSaved(item.id));
    card.append(heading, description, button); listElement.append(card);
  }
  statusElement.textContent = `${visible.length} opportunities shown. ${savedIds.length} saved for later.`;
}
function toggleSaved(id) {
  savedIds = savedIds.includes(id) ? savedIds.filter(saved => saved !== id) : [...savedIds, id];
  storeValue(storageKeys.saved, JSON.stringify(savedIds));
  renderOpportunities();
}
if (filterElement && listElement && statusElement) {
  const previous = readFilter();
  filterElement.value = ["all", "volunteer", "foster"].includes(previous) ? previous : "all";
  filterElement.addEventListener("change", () => {
    storeValue(storageKeys.filter, filterElement.value);
    renderOpportunities();
  });
  renderOpportunities();
}
