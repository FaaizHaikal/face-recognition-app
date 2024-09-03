const cropImageWithOvalShape = (
  image,
  horizontalDiameter,
  verticalDiameter
) => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  // Set canvas dimensions to match the webcam's resolution
  canvas.width = image.width;
  canvas.height = image.height;

  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

  // Draw the oval crop mask
  ctx.globalCompositeOperation = 'destination-in';
  ctx.beginPath();
  ctx.ellipse(
    canvas.width / 2, // X-coordinate of the center
    canvas.height / 2, // Y-coordinate of the center
    horizontalDiameter / 2, // Horizontal radius
    verticalDiameter / 2, // Vertical radius
    0, // Rotation angle
    0, // Start angle
    2 * Math.PI // End angle (full circle)
  );
  ctx.fill();
  ctx.globalCompositeOperation = 'source-over';
  ctx.stroke();

  // Convert the canvas to a base64 encoded string
  return canvas.toDataURL('image/jpeg');
};

export default cropImageWithOvalShape;
