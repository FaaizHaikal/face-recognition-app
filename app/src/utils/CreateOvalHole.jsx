const createOvalHole = (
  canvas,
  width,
  height,
  horizontalDiameter,
  verticalDiameter
) => {
  const ctx = canvas.getContext('2d');

  canvas.width = width;
  canvas.height = height;

  // Clear the canvas
  ctx.clearRect(0, 0, width, height);

  // Draw the background outside the oval (semi-transparent overlay)
  ctx.fillStyle = 'rgba(0, 0, 0, 1.0)';
  ctx.fillRect(0, 0, width, height);

  // Create the oval path
  ctx.globalCompositeOperation = 'destination-out';
  ctx.beginPath();
  ctx.ellipse(
    width / 2, // x-coordinate of the oval center
    height / 2, // y-coordinate of the oval center
    horizontalDiameter / 2, // horizontal radius
    verticalDiameter / 2, // vertical radius
    0, // rotation (0 for no rotation)
    0, // start angle
    2 * Math.PI // end angle (full circle)
  );
  ctx.fill();

  // Reset composite operation to default
  ctx.globalCompositeOperation = 'source-over';
};

export default createOvalHole;
