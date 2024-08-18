import os
import re


def get_useless_assets(folder_path):
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


def rename_asset(path, newname):
    # Get the directory and asset name
    directory, oldname = os.path.split(path)
    newpath = os.path.join(directory, newname)

    # Rename the asset file
    if os.path.exists(path):
        os.rename(path, newpath)
        print(f"Renamed asset: {oldname} to {newname}")
    else:
        print(f"Asset {oldname} not found in the specified path.")
        return

    # Compile regex pattern to match Markdown links
    pattern = re.compile(r'\[.*?\]\((.*?)\)')

    # Iterate through all .md files in the parent directory
    directory = os.path.dirname(path)

    for root, _, files in os.walk(directory):
        for file in files:
            if file.endswith('.md'):
                filepath = os.path.join(root, file)
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()

                # Replace old asset name with newname in Markdown links
                updated_content = re.sub(pattern, lambda m: m.group(0).replace(oldname, newname), content)

                # Write back to the file if changes were made
                if updated_content != content:
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write(updated_content)
                    print(f"Updated {file} with new asset name: {newname}")


def move_assets(path, newpath):
    return