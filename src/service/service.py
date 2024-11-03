from flask import Flask, request, jsonify
from flask_cors import CORS
from file_system import *
import urllib.parse

app = Flask(__name__)
CORS(app)


@app.route('/file_system/get_file_graph', methods=['GET'])
def service_get_get_file_graph():
    path = request.args.get('path')
    if path:
        resp = build_graph_from_markdown_folder(path)
        return {"status": "success", "data": resp}, 200
    else:
        return {"status": "error", "message": "Missing 'url' parameter"}, 400


@app.route('/file_system/get_file_graph', methods=['POST'])
def service_post_get_file_graph():
    path = request.json.get('path')
    if path:
        resp = build_graph_from_markdown_folder(path)
        return {"status": "success", "data": resp}, 200
    else:
        return {"status": "error", "message": "Missing 'url' parameter"}, 400


@app.route('/file_system/search', methods=['POST'])
def search_file():
    path = request.json.get('path')
    keyword = request.json.get('keyword')
    if path:
        resp = search_from_folder(path, keyword)
        return {"status": "success", "data": resp}, 200
    else:
        return {"status": "error", "message": "Missing 'url' parameter"}, 400


@app.route('/file_system/operate_file', methods=['POST'])
def service_post_operate_file():
    path = request.json.get('path')
    operator = request.json.get('operator')
    if path:
        resp = operate_file(path, operator)
        return {"status": "success", "data": resp}, 200
    else:
        return {"status": "error", "message": "Missing 'url' parameter"}, 400


@app.route('/file_system/operate_file', methods=['GET'])
def service_get_operate_file():
    path = request.args.get('path')
    operator = request.args.get('operator')
    content = request.args.get('content', "")

    if path and operator:
        resp = operate_file(path, operator, content)
        if operator == "read":
            open_typora(urllib.parse.unquote(path))
            resp = markdown_to_html(resp)
        return jsonify({"status": "success", "data": resp}), 200
    else:
        return jsonify({"status": "error", "message": "Missing 'path' or 'operator' parameter"}), 400


@app.route('/file_system/get_useless_assets', methods=['POST'])
def Service_get_useless_assets():
    path = request.json.get('path')
    if path:
        resp = get_useless_assets(path)
        return {"status": "success", "data": resp}, 200
    else:
        return {"status": "error", "message": "Missing 'url' parameter"}, 400


@app.route('/file_system/rename_asset', methods=['POST'])
def Service_rename_asset():
    path = request.json.get('path')
    newname = request.json.get('newname')
    if path:
        resp = rename_asset(path, newname)
        return {"status": "success", "data": resp}, 200
    else:
        return {"status": "error", "message": "Missing 'url' parameter"}, 400


if __name__ == '__main__':
    app.run(port=5000)
