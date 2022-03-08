"use strict";

exports.name = "convertClones";
exports.type = "visitor";
exports.active = true;
exports.description = "convert cloned nodes into their original nodes";

/**
 * Convert cloned nodes into their original nodes.
 *
 * @author René Herrmann
 *
 * @type {import('svgo/lib/types').Plugin}
 */
exports.fn = function () {
  const elements = [];

  return {
    element: {
      enter: (node) => {
        elements.push(node);
      },
    },
    root: {
      exit: () => {
        for (const element of elements) {
          if (element.name !== "use") {
            continue;
          }

          const referenceElement = elements.find((el) => {
            const id = element.attributes["xlink:href"]?.replace("#", "");
            if (id == null) {
              return;
            }
            return el.attributes.id === id;
          });

          if (referenceElement == null) {
            continue;
          }

          const { transform: cloneTransform, ...elementAttributes } =
            element.attributes;
          const { transform: referenceTransform, ...referenceAttributes } =
            referenceElement.attributes;

          element.name = referenceElement.name;
          element.attributes = {
            ...referenceAttributes,
            ...elementAttributes,
          };
          element.attributes.transform = [cloneTransform, referenceTransform]
            .filter(Boolean)
            .join(" ");
          element.children = referenceElement.children;

          delete element.attributes.id;
          delete element.attributes.width;
          delete element.attributes.height;
          delete element.attributes["xlink:href"];
        }
      },
    },
  };
};
