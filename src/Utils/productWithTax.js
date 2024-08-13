const getItemTax = ({
  taxArray,
  location_tax,
  ml1,
  ml2,
  price,
  taxState = "",
  tax_class = ""
}) => {
  let isVapeExist = false;
  if (!taxArray.length && !location_tax && !ml1 && !ml2 && !price)
    return { taxPerUnit: 0, isVapeExist };
  const filteredTaxState = taxArray.filter(
    (item) =>
      item?.indirect_tax_type?.toString() === location_tax?.toString() &&
      item?.indirect_tax_state?.toUpperCase() === taxState?.toUpperCase()
  );
  if (!filteredTaxState.length) return { taxPerUnit: 0, isVapeExist };
  if (filteredTaxState.length > 0) {
    let taxPerUnit = filteredTaxState.reduce((total, item) => {
      const taxRate = parseFloat(item.indirect_tax_rate);
      const calcMethod = parseInt(item.indirect_tax_calc_method);

      if (calcMethod == 4) {
        if (ml1 && ml1 > 0) {
          return total + ml1 * taxRate;
        }
      }
      if (calcMethod == 5) {
        if (ml2 && ml2 > 0) {
          return total + ml2 * taxRate;
        }
      }
      if (tax_class == "vapes") {
        isVapeExist = true;
        return total + price * 0.15;
      }
      if (calcMethod == 10) {
        return total + (taxRate / 100) * price;
      }
      return total;
    }, 0);
    return { taxPerUnit: Math.ceil(taxPerUnit * 100) / 100, isVapeExist };
  }
};

export const addTaxInItem = (cartItem = [], stateTax = [], taxState) => {
  if (!cartItem && cartItem?.length <= 0) return [];
  if (!stateTax && stateTax?.length <= 0) return [];
  let isVape = false;

  const updatedArray = cartItem?.map((item) => {
    const { taxPerUnit = 0, isVapeExist = false } = item?.is_free_product
      ? { taxPerUnit: 0, isVapeExist: false }
      : getItemTax({
          taxArray: stateTax,
          location_tax: item?.location_tax,
          ml1: parseFloat(item?.ml1),
          ml2: parseFloat(item?.ml2),
          price: parseFloat(item?.product_price),
          tax_class: item?.tax_class,
          taxState
        });
    isVape = !isVape ? isVapeExist : isVape;

    return {
      ...item,
      taxPerUnit: taxPerUnit,
      isVape: isVapeExist,
      taxSubtotal: parseInt(item?.quantity) * parseFloat(taxPerUnit),
      subTotal: parseInt(item?.quantity) * parseFloat(item?.product_price)
    };
  });

  return { updatedArray, isVape };
};
