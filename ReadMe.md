# Markdown Editor

[TOC]

<img src="./docs/assets/af01f5153ba19d653bde07e3f4b1c70.png" alt="af01f5153ba19d653bde07e3f4b1c70" style="zoom: 33%;" />

## File System

### Draw the graph form files

The system supports drawing a visual file graph to provide a comprehensive overview of file relationships and structures. This feature is particularly useful for understanding dependencies and hierarchy within a project. You can see it in detail on [Note Graph](./docs/Note_Graph.md).

### List the file tree

Once the workspace path is specified, the system will display the file tree in the sidebar. We support the Expand/collapse icon for file subtrees, enabling efficient navigation.

### Basic operation for file

The system supports the core operations of a file lifecycle, often summarized as CRUD:

- Create: Add a new file to the system.
- Read: View the contents of a file.
- Update: Edit and modify file contents.
- Delete: Permanently remove a file from the system.

Right-clicking on a file in the file sidebar opens a context menu with these operations. If you read the markdown file, the system will run the Typora to help you edit the markdown file.

### Keyword Search in Files

Users can search for specific content across files by entering a keyword or using regular expressions for more complex queries. We will return matching lines and corresponding file names and the matching keywords are highlighted.

### Management the assets

We can management all assets which linked to the markdown notes including rename, crud, change the path.

## Editor

### Parse the Markdown files

We use run the Typora to editor the markdown files. 

### SVG Editing

We use run the Draw.io to editor the SVG files. 

### Table Editing

We create a Table Editor to editor the tables in markdown files. 

## User Interface

### File sidebar

