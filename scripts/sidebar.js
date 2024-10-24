// Save as bookmarklet: https://make-bookmarklets.com/
// Create a JSON file with the parsed data from the MDN sidebar

function parseSidebarBody() {
  const sidebarBody = document.querySelector(".sidebar-body");
  const result = {};

  if (!sidebarBody) {
    throw new Error("No sidebar-body element found.");
  }

  let rootSection = null;
  let className = "default"; // Default file name if no class name is found

  const sections = sidebarBody.querySelectorAll(
    "li.section, li.toggle details",
  );

  sections.forEach((section) => {
    const sectionTitle = section.querySelector("summary, a")?.textContent?.trim() || "";

    // Skip "Related pages for DOM" section or related sections
    if (
      sectionTitle === "Related pages for DOM" ||
      sectionTitle.includes("Related pages")
    ) {
      return;
    }

    const classElement = sidebarBody.querySelector("li.section em a code");
    if (classElement) {
      className = classElement.textContent?.trim() || "default"; // Set class name as file name

      // Set rootSection to class name instead of the first section title
      if (!rootSection) {
        rootSection = className;
        result[rootSection] = {};
      }
    }

    const links = section.querySelectorAll("li a");

    links.forEach((link) => {
      const codeElement = link.querySelector("code");

      if (codeElement) {
        const itemText = codeElement.textContent?.trim() || "";

        // Skip if the itemText and sectionTitle are the same
        if (itemText === sectionTitle) {
          return;
        }

        // Skip "Non-standard", "Deprecated", or "Experimental" items
        const parentLi = link.closest("li");
        if (
          parentLi && (parentLi.querySelector(".icon-nonstandard") ||
            parentLi.querySelector(".icon-deprecated") ||
            parentLi.querySelector(".icon-experimental"))
        ) {
          return; // Skip this item if it's marked as Non-standard, Deprecated, or Experimental
        }

        const type = determineType(sectionTitle);

        // Only add valid types
        if (type !== "Unknown") {
          result[rootSection][itemText] = {
            type,
            params: [],
            returns: "",
            inherits: [],
          };
        }
      }
    });
  });

  return { result, className };
}

function determineType(sectionTitle) {
  if (sectionTitle === "Constructor") {
    return "Constructor";
  } else if (sectionTitle === "Instance properties") {
    return "InstanceProperty";
  } else if (sectionTitle === "Static methods") {
    return "StaticMethod";
  } else if (sectionTitle === "Instance methods") {
    return "InstanceMethod";
  } else if (sectionTitle === "Events") {
    return "Event";
  } else if (sectionTitle === "Inheritance") {
    return "Inheritance";
  }
  return "Unknown";
}

function saveAsJSON(filename, data) {
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();

  // Clean up
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Example usage
const parsedData = parseSidebarBody();
saveAsJSON(`${parsedData.className}.json`, parsedData.result);

// function copyToClipboard(text) {
//   navigator.clipboard.writeText(text).then(() => {
//     console.log('Text copied to clipboard');
//   }).catch((err) => {
//     console.error('Failed to copy text: ', err);
//   });
// }

// // Example usage
// const parsedResult = JSON.stringify(parseSidebarBody(), null, 2);
// console.log(parsedResult);
// copyToClipboard(parsedResult);
