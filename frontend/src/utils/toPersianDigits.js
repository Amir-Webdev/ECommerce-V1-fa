function toPersianDigits(num) {
  return num.toString().replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[d]);
}

function formatNumber(number) {
  // Persian digits
  const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

  // Convert number to string and reverse it
  const reversedString = number.toString().split("").reverse().join("");

  // Add commas every 3 digits
  const formattedString = reversedString
    .replace(/(\d{3})(?=\d)/g, "$1,")
    .split("")
    .reverse()
    .join("");

  // Convert digits to Persian
  const persianFormattedString = formattedString.replace(
    /\d/g,
    (match) => persianDigits[parseInt(match)]
  );

  return persianFormattedString;
}

export { toPersianDigits, formatNumber };
