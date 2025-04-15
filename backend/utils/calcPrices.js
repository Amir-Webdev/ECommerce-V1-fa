function addDecimals(num) {
  return (Math.round(num * 100) / 100).toFixed(2);
}

export function calcPrices(orderItems) {
  // Calculate the items price (ensure price and qty are numbers)
  const itemsPrice = Number(
    addDecimals(
      orderItems.reduce(
        (acc, item) => acc + Number(item.price) * Number(item.quantity),
        0
      )
    )
  );

  // Calculate the shipping price
  const shippingPrice = Number(addDecimals(itemsPrice > 100 ? 0 : 10));

  // Calculate the tax price
  const taxPrice = Number(addDecimals(Number((0.15 * itemsPrice).toFixed(2))));

  // Calculate the total price
  const totalPrice = Number((itemsPrice + shippingPrice + taxPrice).toFixed(2));

  return { itemsPrice, shippingPrice, taxPrice, totalPrice };
}
