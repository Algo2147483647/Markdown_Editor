import os
import re


def get_useless_resources(folder_path):
    assets_all = []

    # Collect all asset files in "assets" directories
    for root, dirs, files in os.walk(folder_path):
        if os.path.basename(root) == "assets":
            for file_name in files:
                file_path = os.path.join(root, file_name)
                if os.path.isfile(file_path):
                    assets_all.append(os.path.abspath(file_path))

    assets_used = set()

    # Find all assets referenced in markdown files
    for root, dirs, files in os.walk(folder_path):
        for file_name in files:
            if file_name.endswith(".md"):
                file_path = os.path.join(root, file_name)
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                    # Extract asset references
                    img_assets_1 = re.findall(r'<img[^>]+src="([^"]+)"', content)
                    img_assets_2 = re.findall(r'!\[.*?\]\((.*?)\)', content)

                    for asset in img_assets_1 + img_assets_2:
                        asset_path = os.path.abspath(os.path.join(root, asset))
                        if os.path.isfile(asset_path):
                            assets_used.add(asset_path)

    # Identify unused assets
    results = [element for element in assets_all if element not in assets_used]
    return results

result = get_useless_resources('C:/Algo/Notes/Science/')
for asset in sorted(result):
    print(asset)