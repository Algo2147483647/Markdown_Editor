import os
import re


def get_assets_from_md_file(file_path):
    """
    Extracts all asset paths referenced in a Markdown file.

    Args:
        file_path (str): Path to the Markdown file.

    Returns:
        list: List of asset paths used in the Markdown file.
    """
    if not file_path.endswith('.md'):
        return []

    assets_path_list = []
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            content = file.read()

            # Match Markdown image or link syntax: ![alt text](path) or [text](path)
            pattern = r'!\[.*?\]\((.*?)\)|\[(.*?)\]\((.*?)\)'
            matches = re.findall(pattern, content)

            # Extract paths from matches
            assets_path_list = [
                match[0] or match[2]  # Use the non-empty group
                for match in matches if (match[0] or match[2])
            ]
    except (FileNotFoundError, IOError):
        print(f"Error: File not found or cannot be opened - {file_path}")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")

    return assets_path_list


def get_useless_assets(folder_path):
    """
    Identifies unused asset files in "assets" directories within a folder.

    Args:
        folder_path (str): Path to the root folder.

    Returns:
        list: List of absolute paths to unused asset files.
    """
    assets_all = []
    assets_used = set()

    # Collect all asset files in "assets" directories
    for root, dirs, files in os.walk(folder_path):
        if os.path.basename(root) == "assets":
            for file_name in files:
                file_path = os.path.abspath(os.path.join(root, file_name))
                if os.path.isfile(file_path):
                    assets_all.append(file_path)

    # Find all assets referenced in Markdown files
    for root, dirs, files in os.walk(folder_path):
        for file_name in files:
            if file_name.endswith(".md"):
                file_path = os.path.join(root, file_name)
                assets = get_assets_from_md_file(file_path)

                # Convert relative paths to absolute paths
                for asset in assets:
                    asset_path = os.path.abspath(os.path.join(root, asset))
                    if os.path.isfile(asset_path):
                        assets_used.add(asset_path)

    # Identify unused assets
    return [asset for asset in assets_all if asset not in assets_used]


def rename_asset(path, newname):
    """
    Rename an asset file and update references in Markdown files.

    Args:
        path (str): Absolute path to the asset file to rename.
        newname (str): New name for the asset file.

    Returns:
        bool: True if the renaming and updating were successful, False otherwise.
    """
    # Get the directory and old asset name
    directory, oldname = os.path.split(path)
    newpath = os.path.join(directory, newname)

    # Rename the asset file
    if not os.path.exists(path):
        print(f"Error: Asset file not found - {path}")
        return False

    try:
        os.rename(path, newpath)
        print(f"Renamed asset: {oldname} to {newname}")
    except OSError as e:
        print(f"Error renaming asset: {e}")
        return False

    # Compile regex patterns to match Markdown links and image tags
    markdown_link_pattern = re.compile(r'(\[.*?\]\()([^)]*?)\)')
    image_tag_pattern = re.compile(r'(<img[^>]+src=")([^"]*?)(")')

    # Update references in all Markdown files in the parent directory and subdirectories
    parent_directory = os.path.dirname(directory)
    for root, _, files in os.walk(parent_directory):
        for file in files:
            if file.endswith('.md'):
                filepath = os.path.join(root, file)
                try:
                    with open(filepath, 'r', encoding='utf-8') as f:
                        content = f.read()

                    # Update old asset name with the new name
                    updated_content = re.sub(
                        markdown_link_pattern,
                        lambda m: m.group(1) + m.group(2).replace(oldname, newname) + m.group(3),
                        content,
                    )
                    updated_content = re.sub(
                        image_tag_pattern,
                        lambda m: m.group(1) + m.group(2).replace(oldname, newname) + m.group(3),
                        updated_content,
                    )

                    # Write back to the file only if changes were made
                    if updated_content != content:
                        with open(filepath, 'w', encoding='utf-8') as f:
                            f.write(updated_content)
                        print(f"Updated references in {file} with new asset name: {newname}")

                except (FileNotFoundError, IOError) as e:
                    print(f"Error processing file {filepath}: {e}")

    return True


