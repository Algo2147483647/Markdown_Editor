from flask import Flask, request, jsonify
from file_system import *
from asset_system import *
from markdown_compiler import *
import urllib.parse
from pathlib import Path
from flask import Flask, request, jsonify
from flask_cors import CORS
from file_system import *
import urllib.parse

app = Flask(__name__)
CORS(app)  # Restrict domains in production

# Utility function to validate and retrieve JSON or query parameters
def get_param(source, key, default=None, required=False):
    value = source.get(key, default)
    if required and value is None:
        raise ValueError(f"Missing required parameter: '{key}'")
    return value


# Common error handler
@app.errorhandler(Exception)
def handle_exception(e):
    return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/file_system/operate_file', methods=['GET', 'POST'])
def service_operate_file():
    try:
        source = request.json if request.method == 'POST' else request.args
        path = get_param(source, 'path', required=True)
        operator = get_param(source, 'operator', required=True)
        content = get_param(source, 'content', default="")

        resp = operate_file(path, operator, content)
        if operator == "read" and Path(path).suffix == '.md':
            open_typora(urllib.parse.unquote(path))
            resp = markdown_to_html(resp)

        return jsonify({"status": "success", "data": resp}), 200
    except ValueError as e:
        return {"status": "error", "message": str(e)}, 400

@app.route('/file_system/get_file_graph', methods=['GET', 'POST'])
def service_get_file_graph():
    try:
        path = get_param(request.json if request.method == 'POST' else request.args, 'path', required=True)
        resp = build_graph_from_markdown_folder(path)
        return {"status": "success", "data": resp}, 200
    except ValueError as e:
        return {"status": "error", "message": str(e)}, 400


@app.route('/file_system/search_keyword_from_files', methods=['POST'])
def service_search_keyword_from_files():
    try:
        path = get_param(request.json, 'path', required=True)
        keyword = get_param(request.json, 'keyword', required=True)
        resp = search_from_folder(path, keyword)
        return {"status": "success", "data": resp}, 200
    except ValueError as e:
        return {"status": "error", "message": str(e)}, 400


@app.route('/asset_system/get_useless_assets', methods=['POST'])
def service_get_useless_assets():
    try:
        path = get_param(request.json, 'path', required=True)
        resp = get_useless_assets(path)
        return {"status": "success", "data": resp}, 200
    except ValueError as e:
        return {"status": "error", "message": str(e)}, 400


@app.route('/asset_system/rename_asset', methods=['POST'])
def service_rename_asset():
    try:
        path = get_param(request.json, 'path', required=True)
        newname = get_param(request.json, 'newname', required=True)
        resp = rename_asset(path, newname)
        return {"status": "success", "data": resp}, 200
    except ValueError as e:
        return {"status": "error", "message": str(e)}, 400


if __name__ == '__main__':
    app.run(port=5000)
