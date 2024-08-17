import os
import re
import json


class Cell:
    def __init__(self, name, path):
        self.name = name
        self.path = path
        self.content = ""
        self.kid = set()
        self.parent = set()
        
    def to_dict(self):
        return {
            "name": self.name,
            "path": self.path,
            "kid": list(self.kid),    # Convert set to list for JSON serialization
            "parent": list(self.parent)  # Convert set to list
        }


def build_graph_from_markdown_folder(folder_path):
    result = {}
    for root, dirs, files in os.walk(folder_path):
        for file_name in files:
            file_path = os.path.join(root, file_name)
            if os.path.isfile(file_path) and file_name.endswith(".md"):
                build_graph_from_markdown_file(file_path, result)

    result = json.dumps({key: cell.to_dict() for key, cell in result.items()})
    return result


def build_graph_from_markdown_file(file_path, graph):
    file_path = os.path.abspath(file_path)
    if file_path in graph:
        return graph[file_path]

    graph[file_path] = Cell(
        name=os.path.splitext(os.path.basename(file_path))[0],
        path=file_path,
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
                    graph[file_path].parent.add(link_path)
                    graph[link_path].kid.add(file_path)
                else:
                    graph[file_path].kid.add(link_path)
                    graph[link_path].parent.add(file_path)

            return graph[file_path]
    except IOError:
        return graph[file_path]
