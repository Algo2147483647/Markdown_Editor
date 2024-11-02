import markdown
import os


def markdown_to_html(md_path, html_path):
    # Ensure the Markdown file exists
    if not os.path.exists(md_path):
        return f"Markdown file not found: {md_path}"

    # Read the content of the Markdown file
    with open(md_path, 'r', encoding='utf-8') as file:
        md_content = file.read()

    # Convert the Markdown content to HTML
    html_content = markdown.markdown(md_content)

    # Write the HTML content to a new file
    with open(html_path, 'w', encoding='utf-8') as file:
        file.write(html_content)

    return f"HTML file created at: {html_path}"


# Example usage
md_file_path = 'example.md'
html_file_path = 'example.html'
result = markdown_to_html(md_file_path, html_file_path)
print(result)
