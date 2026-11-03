"""Import the supplied photography without changing originals or existing products."""
import csv
import json
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCE = Path('/Users/mac/Downloads/CraftingCorner_Real_Photos_28_Selected')
DRAFTS = Path('/Users/mac/Downloads/02_PRODUCT_DRAFTS_OWNER_APPROVAL.csv')

mapping = json.loads((SOURCE / '00_README_AND_MAPPING/CraftingCorner_Photo_Mapping.json').read_text())
photos = []
for photo in mapping['selected_images']:
    stem = Path(photo['filename']).stem
    for source_size, size in [('Large_2000px', 'large'), ('Thumbnail_900px', 'small')]:
        matches = list((SOURCE / '02_Web_Ready_WebP' / source_size).rglob(stem + '.webp'))
        if len(matches) != 1:
            raise ValueError(f'Expected exactly one {stem} {size} image')
        dest = ROOT / 'public/images/real' / size / (stem + '.webp')
        dest.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(matches[0], dest)
    photos.append({**photo, 'large': f'/images/real/large/{stem}.webp', 'small': f'/images/real/small/{stem}.webp'})

def slug(value):
    import re
    return re.sub(r'[^a-z0-9]+', '-', value.lower()).strip('-')

products = []
with DRAFTS.open(encoding='utf-8-sig', newline='') as handle:
    for index, row in enumerate(csv.DictReader(handle)):
        name = row['Draft Product Title']
        category = {'Living Room': 'living-room', 'Bedroom': 'bedroom', 'Study & Office': 'office'}[row['Website Category']]
        collection = row['Collection']
        product_type = ('chairs' if 'Seating' in collection or 'Chairs' in collection or 'Recliners' in collection else
                        'display-storage' if 'Display' in collection or 'Bedside' in collection else
                        'desks' if category == 'office' else 'console' if 'Console' in collection or 'Vanit' in collection or 'Designer' in collection else 'side-tables')
        stems = [Path(item.strip()).stem for item in row['All Web Images'].split('|')]
        images = [{'url': f'/images/real/large/{s}.webp', 'alt': row['Short Description'] if i == 0 else f'{name}, alternate view', 'isPrimary': i == 0} for i, s in enumerate(stems)]
        products.append({
            'id': row['Temporary Product ID'], 'slug': slug(name), 'name': name, 'title': name,
            'categorySlug': category, 'category': category, 'productTypeSlug': product_type,
            'price': 0, 'priceStatus': 'estimate', 'approximatePrice': int(row['Suggested Approx Website Price INR']),
            'priceUnit': row['Price Unit'], 'checkoutEnabled': False, 'ownerApproved': False,
            'stockStatus': 'unconfirmed', 'visibility': 'published', 'imageSource': 'real',
            'shortDescription': row['Short Description'], 'description': row['Long Product Description (visual evidence only)'],
            'images': images, 'img': [im['url'] for im in images], 'tags': [collection],
            'sortOrder': index + 1, 'sourcePhotos': [s + '.JPG' for s in stems],
            'ownerVerification': row['Owner Must Verify'], 'sections': {},
            'seo': {'title': f'{name} | Crafting Corner', 'description': row['Short Description']},
            'createdAt': '2026-11-03T00:00:00.000Z', 'updatedAt': '2026-11-03T00:00:00.000Z'
        })
output = {'version': 'real-photos-2026-11-03', 'photos': photos, 'products': products}
(ROOT / 'src/data/realPhotography.json').write_text(json.dumps(output, ensure_ascii=False, indent=2) + '\n')
print(f'Imported {len(photos)} photographs in two sizes and {len(products)} enquiry products. Originals preserved at {SOURCE}.')
