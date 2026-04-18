import os
import requests
from duckduckgo_search import DDGS
import time

products = [
    "Anchor Full Cream Milk Powder 400g carton",
    "Kotmale Fresh Milk 1L carton",
    "Astra Margarine 500g Sri Lanka",
    "Kothmale Swiss Roll Sri Lanka",
    "Munchee Super Cream Cracker 500g",
    "Maliban Lemon Puff 200g",
    "Munchee Chocolate Tikiri Marie",
    "Rancrisp Cassava Chips 100g",
    "Elephant House Ginger Beer 1.5L bottle",
    "Dilmah Premium Ceylon Tea Loose Leaf 400g",
    "Link Samahan Herbal Tea Pack",
    "Milo Chocolate Malt Drink 400g Sri lanka",
    "Kist Tomato Sauce 400g",
    "MD Mixed Fruit Jam 485g Sri lanka",
    "Keells Krest Chicken Sausages 500g",
    "Wijaya Roasted Curry Powder 100g",
    "Cargills Quality Keeri Samba 5kg",
    "Signal Strong Teeth Toothpaste 120g Sri Lanka",
    "Sunlight Care Detergent Soap Sri Lanka",
    "Dettol Original Soap 100g"
]

output_dir = "public/products"
os.makedirs(output_dir, exist_ok=True)

ddgs = DDGS()

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
}

for product in products:
    safe_name = product.replace(' ', '-').replace('/', '-').lower() + ".jpg"
    filepath = os.path.join(output_dir, safe_name)
    
    if os.path.exists(filepath):
        print(f"Already downloaded {safe_name}")
        continue
        
    print(f"Searching for: {product}")
    try:
        results = list(ddgs.images(product, max_results=3))
        downloaded = False
        
        for res in results:
            url = res['image']
            try:
                print(f"  Trying {url}...")
                response = requests.get(url, headers=headers, timeout=5)
                if response.status_code == 200:
                    with open(filepath, 'wb') as f:
                        f.write(response.content)
                    print(f"  SUCCESS! Saved {safe_name}")
                    downloaded = True
                    break
            except Exception as e:
                print(f"  Failed: {e}")
                
        if not downloaded:
            print(f"  FAIL for {product}")
    except Exception as e:
        print(f"Error searching {product}: {e}")
        
    time.sleep(1)
