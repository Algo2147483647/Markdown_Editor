import os
import re


def search_from_file(file_path, regex_pattern):
    """
    Searches for the keyword in a file and returns a list of tuples containing the line number and the line content.

    :param file_path: Path to the file.
    :param regex_pattern: Regular expression pattern to search for.
    :return: List of tuples with (line number, line content) for lines containing the keyword.
    """
    results = []
    with open(file_path, 'r', encoding='utf-8') as file:
        for i, line in enumerate(file, 1):
            if re.search(regex_pattern, line):
                results.append((i, line.strip()))
    return results


def search_from_files(folder_paths, regex_pattern):
    """
    Searches for the keyword in all files list and returns a dictionary where the keys are file names and
    the values are lists of results from search_from_file.

    :param folder_paths: Path list to the files.
    :param regex_pattern: Regular expression pattern to search for.
    :return: Dictionary with file names as keys and lists of tuples (line number, line content) as values.
    """
    all_results = {}
    for file_path in folder_paths:
        if os.path.isfile(file_path):
            search_results = search_from_file(file_path, regex_pattern)
            if search_results:
                all_results[file_path] = search_results
    return all_results


def search_from_folder(folder_path, regex_pattern):
    """
    Searches for the keyword in all files within a folder and returns a dictionary where the keys are file names and
    the values are lists of results from search_from_file.

    :param folder_path: Path to the folder containing the files.
    :param regex_pattern: Regular expression pattern to search for.
    :return: Dictionary with file names as keys and lists of tuples (line number, line content) as values.
    """
    all_results = {}
    for root, dirs, files in os.walk(folder_path):
        for file_name in files:
            file_path = os.path.join(root, file_name)
            if os.path.isfile(file_path):
                search_results = search_from_file(file_path, regex_pattern)
                if search_results:
                    all_results[file_path] = search_results
    return all_results


