from flask import Flask, request, jsonify
from build_graph_from_markdown import build_graph_from_markdown_folder
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


# GET 请求 - 获取特定项目
@app.route('/file_system/get_file_graph', methods=['POST'])
def getFileGraph():
    path = request.json.get('path')  # Get the 'url' parameter from the POST request body
    if path:
        resp = build_graph_from_markdown_folder(path)
        return {"status": "success", "data": resp}, 200
    else:
        return {"status": "error", "message": "Missing 'url' parameter"}, 400


if __name__ == '__main__':
    app.run()
