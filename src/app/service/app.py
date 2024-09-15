from flask import Flask, request, jsonify  
import subprocess  
from flask_cors import CORS  # 导入 CORS  

app = Flask(__name__)  
CORS(app)  # 允许所有域名的跨域请求  
@app.route('/run-script', methods=['POST'])  
def run_script():  
    # 这里可以添加任何需要的参数  
    data = request.json  
    messages = data.get('messages')
    print(messages)
    # 调用 Python 脚本  
    result = subprocess.run(['python', 'src/app/service/openai-chat.py',str(messages)], capture_output=True, text=True,encoding='utf-8')  
    return jsonify({'output': result.stdout, 'error': result.stderr})  

@app.route('/test', methods=['get'])  
def test():  
    # 调用 Python 脚本  
    result = 'test'
    return jsonify({'output': result, 'error': result})  

if __name__ == '__main__':  
    app.run(debug=True)