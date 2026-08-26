export const updatePaintProperty = (map, ref, key, value) => {
  if (!map) return;

  const { current: id } = ref;
  if (map.getLayer(id)) {
    map.setPaintProperty(id, key, value);
  }
};
