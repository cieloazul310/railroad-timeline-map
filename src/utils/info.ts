function createInfo() {
  const infoContainer = document.createElement("article");
  infoContainer.setAttribute("class", "info-container");
  const info = document.createElement("hgroup");
  info.setAttribute("class", "info");
  const railTitle = document.createElement("h1");
  const railDescription = document.createElement("p");
  info.appendChild(railTitle);
  info.appendChild(railDescription);

  infoContainer.appendChild(info);

  return { infoContainer, info, railTitle, railDescription };
}

export default createInfo;
