export const calculateAverageColor = (colors: string[]): string => {
  // Convertir los colores a un arreglo de objetos que representen el valor RGB de cada color
  const rgbColors = colors.map((color) => {
    return {
      r: parseInt(color.substring(1, 3), 16),
      g: parseInt(color.substring(3, 5), 16),
      b: parseInt(color.substring(5, 7), 16),
    };
  });

  // Calcular el promedio de cada valor RGB
  const avgColor = {
    r: Math.round(
      rgbColors.reduce((acc, color) => acc + color.r, 0) / rgbColors.length
    ),
    g: Math.round(
      rgbColors.reduce((acc, color) => acc + color.g, 0) / rgbColors.length
    ),
    b: Math.round(
      rgbColors.reduce((acc, color) => acc + color.b, 0) / rgbColors.length
    ),
  };

  // Convertir el valor RGB promedio a un string hexadecimal que represente el color
  return `#${avgColor.r.toString(16).padStart(2, "0")}${avgColor.g
    .toString(16)
    .padStart(2, "0")}${avgColor.b.toString(16).padStart(2, "0")}`;
};

export const calculateColorValue = (component: number): string => {
  const range = 255 / 10; // 10 is the max component value
  const value = Math.floor(component * range);
  const hex = value.toString(16).padStart(2, "0");
  return hex;
};
