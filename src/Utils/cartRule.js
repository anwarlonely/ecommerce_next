const buy_x_get_y_adjustments = (cartItems, rules) => {
  if (rules.length === 0) return cartItems;
  for (let elem of rules) {
    const productId = elem?.filters?.[1]?.value?.[0];
    const variantIds = elem?.filters?.[1]?.product_variants || [];

    const existingItemIndex = cartItems.findIndex(
      (item) =>
        item?.is_free_product &&
        item.product_id?.toString() === productId?.toString()
    );
    if (existingItemIndex !== -1) {
      cartItems.splice(existingItemIndex, 1);
    }

    if (cartItems.length === 0) return cartItems;

    let ruleQtyBuyed = 0;
    if (variantIds?.length > 0) {
      ruleQtyBuyed = variantIds.reduce((acc, variantId) => {
        const item = cartItems.find((item) => item.variation_id === variantId);
        if (item) {
          acc += parseInt(item.quantity);
        }
        return acc;
      }, 0);
    } else {
      ruleQtyBuyed = cartItems.reduce((acc, item) => {
        if (item.product_id.toString() === productId.toString()) {
          acc += parseInt(item.quantity);
        }
        return acc;
      }, 0);
    }

    const minRange =
      parseInt(elem?.buy_x_get_y_adjustments?.ranges?.[1]?.from) || 0;
    const maxRange =
      parseInt(elem?.buy_x_get_y_adjustments?.ranges?.[1]?.to) || Infinity;
    const isRecursive =
      parseInt(elem?.buy_x_get_y_adjustments?.ranges?.[1]?.recursive) || 0;

    if (
      !ruleQtyBuyed ||
      ruleQtyBuyed == 0 ||
      ruleQtyBuyed < minRange ||
      ruleQtyBuyed > maxRange
    ) {
      continue;
    }

    const freeVariantsList =
      (elem?.buy_x_get_y_adjustments?.ranges?.[1]?.products_variants &&
        !elem?.buy_x_get_y_adjustments?.ranges?.[1]?.products_variants
          ?.length &&
        elem?.buy_x_get_y_adjustments?.ranges?.[1]?.products_variants[
          productId
        ].map(String)) ||
      [];

    let freeProductList = [];
    if (freeVariantsList.length > 0) {
      freeProductList = cartItems.filter(
        (item) =>
          freeVariantsList.includes(item.variation_id?.toString()) &&
          item.product_id?.toString() === productId?.toString()
      );
    } else {
      freeProductList = cartItems.filter(
        (item) => item.product_id?.toString() === productId?.toString()
      );
    }

    let freeProduct = freeProductList[0];
    if (freeProductList.length > 1) {
      freeProduct = freeProductList.reduce((maxItem, currentItem) => {
        return parseInt(currentItem.stock) > parseInt(maxItem.stock)
          ? currentItem
          : maxItem;
      });
    }

    const givenFree = parseInt(
      elem?.buy_x_get_y_adjustments?.ranges["1"]?.free_qty
    );
    const quantity =
      isRecursive == 1
        ? Math.floor(ruleQtyBuyed / minRange) * givenFree
        : givenFree;

    // const insertItem = {
    //   ...freeProduct,
    //   quantity: quantity,
    //   is_free_product: true,
    //   initial_price: freeProduct?.product_price,
    //   unitDiscount: freeProduct?.product_price,
    //   discount_id: elem?.id,
    //   product_price: 0,
    //   taxPerUnit: 0
    // };

    // cartItems.push(insertItem);
    const insertItem = {
      ...{ ...freeProduct }, // Create a shallow copy of freeProduct
      quantity: quantity,
      is_free_product: true,
      initial_price: freeProduct?.product_price,
      unitDiscount: freeProduct?.product_price,
      discount_id: elem?.id,
      product_price: 0,
      taxPerUnit: 0
    };

    // Check if cartItems is extensible
    if (Object.isFrozen(cartItems) || Object.isSealed(cartItems)) {
      // Create a new array with the existing items and the new item
      cartItems = [...cartItems, insertItem];
    } else {
      cartItems.push(insertItem);
    }
  }
  return cartItems;
};

const applyRules = (cartItems, rules) => {
  if (cartItems.length === 0) return cartItems;

  const bXgYRules = rules.filter(
    (rule) =>
      rule.buy_x_get_y_adjustments &&
      (Array.isArray(rule.buy_x_get_y_adjustments)
        ? rule.buy_x_get_y_adjustments.length > 0
        : typeof rule.buy_x_get_y_adjustments === "object")
  );

  const buyXGetYAdjustments = buy_x_get_y_adjustments(cartItems, bXgYRules);
  return buyXGetYAdjustments;
};

export default applyRules;
