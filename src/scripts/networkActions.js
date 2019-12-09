const loadFridge = async () => {
  const res = await fetch("/fetch-fridge", { credentials: "include" });
  let bod = await res.text();
  bod = JSON.parse(bod);
  if (bod.success) {
    return { success: true, fridge: bod.data };
  }
  return { success: false };
};

const loadPantry = async () => {
  const res = await fetch("/fetch-pantry", { credentials: "include" });
  let bod = await res.text();
  bod = JSON.parse(bod);
  if (bod.success) {
    return { success: true, pantry: bod.data };
  }
  return { success: false };
};

const loadList = async () => {
  const res = await fetch("/fetch-list", { credentials: "include" });
  let bod = await res.text();
  bod = JSON.parse(bod);
  if (bod.success) {
    return { success: true, data: bod.data };
  }
  return { success: false };
};

export { loadFridge, loadPantry, loadList };
