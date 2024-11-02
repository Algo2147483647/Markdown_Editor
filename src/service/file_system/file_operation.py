import os


def operate_file(path, operator, content=""):
    if operator == "create":
        return create_file(path, content)
    if operator == "delete":
        return delete_file(path)
    if operator == "read":
        return read_file(path)
    if operator == "update":
        return update_file(path, content)
    return "operator error"


def create_file(path, content = ""):
    with open(path, 'w') as file:
        file.write(content)
    print(f"File created at: {path}")


def read_file(path):
    if not os.path.exists(path):
        return f"File not found: {path}"
    with open(path, 'r') as file:
        return file.read()


def update_file(path, new_content):
    if not os.path.exists(path):
        return f"File not found: {path}"
    with open(path, 'w') as file:
        file.write(new_content)
    print(f"File updated at: {path}")


def delete_file(path):
    if not os.path.exists(path):
        return f"File not found: {path}"
    os.remove(path)
    print(f"File deleted at: {path}")
