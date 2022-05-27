// Methods used by both InsertVisualCommand and UpdateVisualCommand
export function createVisual(writer, visualJson) {
  [visualJson.__style, visualJson.thumbnailStyle] = createStyleAttribute(
    visualJson
  );

  const visualElement = writer.createElement("visual", visualJson);

  const portionMarkSpan = writer.createElement("visualPortionMark");
  const portionMarkText = writer.createText(
    "(" + visualJson.classification + ")"
  );
  writer.append(portionMarkText, portionMarkSpan);
  writer.append(portionMarkSpan, visualElement);

  const titleSpan = writer.createElement("visualTitle");
  const titleText = writer.createText(visualJson.title);
  writer.append(titleText, titleSpan);
  writer.append(titleSpan, visualElement);

  const thumbSrc = visualJson.path.replace(/\?.*/, "") + "/thumbnail";
  const thumbnail = writer.createElement("visualThumbnail", {
    src: thumbSrc,
    __style: visualJson.thumbnailStyle,
  });
  writer.append(thumbnail, visualElement);

  const captionSpan = writer.createElement("visualCaption");
  const captionText = writer.createText(visualJson.caption);
  writer.append(captionText, captionSpan);
  writer.append(captionSpan, visualElement);

  return visualElement;
}

export function createStyleAttribute(visualJson) {
  const visualFloat = visualJson.alignment;
  const visualHeight = visualJson.inlineHeight;
  const visualWidth = visualJson.inlineWidth;

  let visualStyle = "height: auto;";
  let thumbnailStyle = "width: 100%;";

  if (visualFloat && visualFloat != "none") {
    visualStyle = visualStyle + ` float: ${visualFloat};`;
  }

  if (visualWidth) {
    visualStyle = visualStyle + ` width: ${visualWidth};`;
  }

  if (visualHeight) {
    thumbnailStyle = ` height: ${visualHeight};`;
  }

  return [visualStyle, thumbnailStyle];
}
