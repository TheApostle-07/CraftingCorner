import type { Product, SiteData } from './types';

export function productPrice(
  product: Pick<Product, 'price' | 'priceStatus' | 'approximatePrice'>,
) {
  const amount =
    product.priceStatus === 'estimate'
      ? product.approximatePrice
      : product.price;
  if (
    product.priceStatus === 'enquiry' ||
    !Number.isFinite(amount) ||
    amount <= 0
  )
    return 'Price on enquiry';
  return `${product.priceStatus === 'estimate' ? 'Approx. ' : ''}₹${amount.toLocaleString('en-IN')}`;
}

export function productGallery(product: Pick<Product, 'images' | 'img'>) {
  const images =
    product.images?.map((i) => i.url) ||
    (Array.isArray(product.img) ? product.img : [product.img]);
  return [
    ...new Set(
      images.filter(
        (src): src is string => typeof src === 'string' && src.length > 0,
      ),
    ),
  ];
}

export function enquiryHref(product: Product, site: SiteData) {
  const number = site.whatsapp.number.replace(/\D/g, '');
  if (!site.whatsapp.enabled || !/^[1-9]\d{9,14}$/.test(number))
    return '/contact';
  const link = `https://www.craftingcorner.in/products/${product.slug}`;
  const message = `Hi Crafting Corner, I am interested in ${product.title}. ${productPrice(product)}${product.priceStatus === 'estimate' ? ' (indicative only)' : ''}. Please confirm the final price, dimensions, finish and availability. Product: ${link}`;
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
