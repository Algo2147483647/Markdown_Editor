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
    if not os.path.isfile(original_md_path) or not original_md_path.endswith('.md'):
        print(f"Error: Invalid Markdown file - {original_md_path}")
        return False

    # Ensure the new folder exists
    os.makedirs(new_folder_path, exist_ok=True)

    # Get asset paths used in the Markdown file
    asset_path_list = get_assets_from_md_file(original_md_path)

    # Copy all referenced assets to the new folder
    for asset_path in asset_path_list:
        original_folder_path = os.path.dirname(os.path.abspath(original_md_path)).replace('\\', '/')
        asset_path = asset_path.replace('./', original_folder_path + '/')
        print(asset_path)
        if os.path.isfile(asset_path):
            try:
                new_assets_folder_path = os.path.join(new_folder_path, "assets")
                os.makedirs(new_assets_folder_path, exist_ok=True)
                shutil.copy(asset_path, new_assets_folder_path)
                print([asset_path, new_assets_folder_path])
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
    return delete_unused_assets(os.path.dirname(original_md_path))


def delete_unused_assets(assets_folder_path):
    unused_assets = get_useless_assets(assets_folder_path)
    print(unused_assets)
    for asset_path in unused_assets:
        try:
            os.remove(asset_path)
        except Exception as e:
            print(f"Error deleting unused asset {asset_path}: {e}")
            return False
    return True
