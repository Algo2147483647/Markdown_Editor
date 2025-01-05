import os
import shutil
from .asset_management import get_assets_from_md_file, get_useless_assets

def move_md_file(original_md_path, new_folder_path):
    """
    Moves a Markdown file and its associated assets to a new folder.

    Args:
        original_md_path (str): Path to the original Markdown file.
        new_folder_path (str): Path to the new folder.

    Returns:
        None
    """
    print([original_md_path, new_folder_path])
    if not os.path.isfile(original_md_path) or not original_md_path.endswith('.md'):
        print(f"Error: Invalid Markdown file - {original_md_path}")
        return

    # Ensure the new folder exists
    os.makedirs(new_folder_path, exist_ok=True)

    # Get asset paths used in the Markdown file
    asset_path_list = get_assets_from_md_file(original_md_path)

    # Copy all referenced assets to the new folder
    for asset_path in asset_path_list:
        if os.path.isfile(asset_path):
            try:
                shutil.copy(asset_path, new_folder_path)
            except Exception as e:
                print(f"Error copying {asset_path} to {new_folder_path}: {e}")
                return False

    # Move the Markdown file to the new folder
    try:
        new_md_path = shutil.move(original_md_path, new_folder_path)
    except Exception as e:
        print(f"Error moving Markdown file to {new_folder_path}: {e}")
        return False

    # Delete unused assets in the original folder
    unused_assets = get_useless_assets(os.path.dirname(original_md_path))
    for asset_path in unused_assets:
        try:
            os.remove(asset_path)
        except Exception as e:
            print(f"Error deleting unused asset {asset_path}: {e}")
            return False

    return True
