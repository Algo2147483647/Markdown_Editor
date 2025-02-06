import os
import shutil
from .asset_management import get_assets_from_md_file, get_useless_assets, copy_assets, delete_unused_assets


def move_md_file(original_md_path, new_folder_path):
    """
    Moves a Markdown file and its associated assets to a new folder.

    Args:
        original_md_path (str): Path to the original Markdown file.
        new_folder_path (str): Path to the new folder.

    Returns:
        None
    """
    if not os.path.isfile(original_md_path) or not original_md_path.endswith('.md'):
        print(f"Error: Invalid Markdown file - {original_md_path}")
        return False

    # Ensure the new folder exists
    os.makedirs(new_folder_path, exist_ok=True)

    # Get asset paths used in the Markdown file
    asset_path_list = get_assets_from_md_file(original_md_path)
    for i, asset_path in enumerate(asset_path_list):
        original_folder_path = os.path.dirname(os.path.abspath(original_md_path)).replace('\\', '/')
        if asset_path.startswith('./'):
            asset_path = os.path.join(original_folder_path, asset_path[2:])
        asset_path = asset_path.replace('\\', '/')
        asset_path_list[i] = asset_path

    # Copy all referenced assets to the new folder
    copy_assets(asset_path_list, new_folder_path)

    # Move the Markdown file to the new folder
    try:
        new_md_path = shutil.move(original_md_path, new_folder_path)
    except Exception as e:
        print(f"Error moving Markdown file to {new_folder_path}: {e}")
        return False

    # Delete unused assets in the original folder
    return delete_unused_assets(os.path.dirname(original_md_path))


