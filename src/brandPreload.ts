/** Calienta el trozo de Agency o Academy para que el fundido no espere a la red. */
export function preloadBrand(path: string) {
  if (path === "/agency") void import("./pages/Agency");
  if (path === "/academy") void import("./pages/Academy");
}

export function preloadBrands() {
  preloadBrand("/agency");
  preloadBrand("/academy");
}
