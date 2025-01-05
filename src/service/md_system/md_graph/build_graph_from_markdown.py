import os
import re
import json
from pathlib import Path
from .node import Node
from .analysis_dag import *


def build_graph_from_markdown_folder(folder_path):
    result = {}
    for root, dirs, files in os.walk(folder_path):
        for file_name in files:
            file_path = os.path.join(root, file_name)
            if os.path.isfile(file_path) and file_name.endswith(".md"):
                build_graph_from_markdown_file(file_path, result)

    result = build_coordinates_of_dag(result)
    result = json.dumps({key: node.to_dict() for key, node in result.items()})
    return result


def build_graph_from_markdown_file(file_path, graph):
    file_path = os.path.abspath(file_path)
    key = file_path
    if file_path in graph:
        return graph[file_path]

    graph[key] = Node(
        file_path=file_path,
    )

    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            graph[file_path].content = f.read()

            links = re.findall(r'\]\((.*?\.md)\)', graph[file_path].content)
            define_section = re.search(r'##\s*Define(.*?)(## \w+|$)', graph[file_path].content, re.DOTALL)
            define_section = define_section.group(1).strip() if define_section else None

            for link in links:
                link_path = os.path.abspath(os.path.join(os.path.dirname(file_path), link))
                build_graph_from_markdown_file(link_path, graph)

                if define_section and link in define_section:
                    graph[file_path].parents.add(link_path)
                    graph[link_path].kids.add(file_path)
                else:
                    graph[file_path].kids.add(link_path)
                    graph[link_path].parents.add(file_path)

            return graph[file_path]
    except IOError:
        return graph[file_path]
