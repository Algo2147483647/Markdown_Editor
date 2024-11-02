class Node:
    def __init__(self, file_path="", content="", kids=None, parents=None):
        self.file_path = file_path
        self.content = content
        self.kids = kids if kids is not None else set()
        self.parents = parents if parents is not None else set()
        self.coordinate = None

    def to_dict(self):
        return {
            "file_path": self.file_path,
            "kids": list(self.kids),
            "parents": list(self.parents),
            "coordinate": list(self.coordinate)
        }
