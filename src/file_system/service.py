from flask import Flask, request, jsonify
from flask_cors import CORS
from build_graph_from_markdown import build_graph_from_markdown_folder
from search import search_from_folder
from asset_management import get_useless_assets

app = Flask(__name__)
CORS(app)


# GET 请求 - 获取特定项目
@app.route('/file_system/get_file_graph', methods=['POST'])
def Service_getFileGraph():
    path = request.json.get('path')
    if path:
        resp = build_graph_from_markdown_folder(path)
        return {"status": "success", "data": resp}, 200
    else:
        return {"status": "error", "message": "Missing 'url' parameter"}, 400


@app.route('/file_system/search', methods=['POST'])
def Service_search():
    path = request.json.get('path')
    keyword = request.json.get('keyword')
    if path:
        resp = search_from_folder(path, keyword)
        return {"status": "success", "data": resp}, 200
    else:
        return {"status": "error", "message": "Missing 'url' parameter"}, 400


@app.route('/file_system/get_useless_assets', methods=['POST'])
def Service_get_useless_assets():
    path = request.json.get('path')
    if path:
        resp = get_useless_assets(path)
        return {"status": "success", "data": resp}, 200
    else:
        return {"status": "error", "message": "Missing 'url' parameter"}, 400


if __name__ == '__main__':
    app.run(port=5000)
