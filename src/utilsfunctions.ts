export function magnitude(x : number, y : number) : number {
	return Math.sqrt(x * x + y * y);
}

export function distanceBetweenPoints(x1 : number, y1 : number, x2 : number, y2 : number) : number {
  return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
}

export function fastDistance(x1 : number, y1 : number, x2 : number, y2 : number) : number {
  const dx = Math.abs(x1 - x2);
  const dy = Math.abs(y1 - y2);
  return 0.4 * (dx + dy) + 0.56 * Math.max(dx, dy);
}

export function RotateVector2d(x : number, y : number, radians : number) : {x:number, y:number} {
  return {
      x: x * Math.cos(radians) - y * Math.sin(radians),
      y: x * Math.sin(radians) + y * Math.cos(radians)
  };
}

export function getRandomElementFromArray<T>(array : T[], random : number) : T {
  return array[Math.floor(random * array.length)];
}

export function rgbToHex(r : number, g : number, b : number) : number {
	return b | (g << 8) | (r << 16);
}

export function format2Places(input : number) : string {
  return formatNumber(input, 2);
}

export function formatWhole(input : number) : string {
  if (input > 1000) {
    return formatNumber(input, 2);
  }
  return formatNumber(input, 0);
}

export function formatNumber(input : number, decimals : number) : string {
  if (!input) input = 0;
  if (input >= 1000000000000000)
    return input.toExponential(decimals).replace("+","");
  if (input >= 1000000000000)
    return (input / 1000000000000).toFixed(decimals) + 'T';
  if (input >= 1000000000)
    return (input / 1000000000).toFixed(decimals) + 'B';
  if (input >= 1000000)
    return (input / 1000000).toFixed(decimals) + 'M';
  if (input >= 1000)
    return (input / 1000).toFixed(decimals) + 'K';

  return input.toFixed(decimals);
}

export function getMaxUpgrades(basePrice : number, exponent : number, numberOwned : number, resourcesOwned : number) : number {
  if (exponent == 1) {
    return Math.floor(resourcesOwned / basePrice);
  }
  return Math.floor(
    Math.log(
      ((resourcesOwned * (exponent - 1)) / (basePrice * Math.pow(exponent, numberOwned))) + 1
    ) / Math.log(exponent)
  );
}

export function getCostForUpgrades(basePrice : number, exponent : number, numberOwned : number, numberToBuy : number) : number {
  if (exponent == 1) {
    return basePrice * numberToBuy;
  }
  return basePrice * (
    (Math.pow(exponent, numberOwned) * (Math.pow(exponent, numberToBuy) - 1)) / (exponent - 1)
  )
}

export function moveToolTip(event : MouseEvent, element : HTMLElement) : void {
  const menuRect = document.getElementById("champ-hold").getBoundingClientRect();
  const x = event.clientX - menuRect.x;
  const y = event.clientY - menuRect.y;
  (element.getElementsByClassName("tooltip")[0] as HTMLElement).style.top = (y + 20) + "px";
  (element.getElementsByClassName("tooltip")[0] as HTMLElement).style.left = (x + 20) + "px";
}