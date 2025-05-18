#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Mock AI API Server

Creates a local HTTP server that simulates AI model API responses.
Returns predefined random prompt data for frontend development and testing.

Usage:
    python mock_ai_api.py [--port PORT]
    Default port: 8000
"""

import json
import random
import argparse
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
import time
import os

# 从data.json文件中读取提示数据
def load_prompts():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    data_file = os.path.join(script_dir, 'data.json')
    try:
        with open(data_file, 'r', encoding='utf-8') as f:
            # 直接加载已经格式化好的嵌套数组
            return json.load(f)
    except Exception as e:
        print(f'Failed to load prompts: {e}')
        return []

# 加载提示数据
PROMPTS = load_prompts()
# 初始化未使用的提示池和已使用的提示池
UNUSED_PROMPTS = list(range(len(PROMPTS)))
USED_PROMPTS = []

class AIAPIHandler(BaseHTTPRequestHandler):
    """处理AI API请求的HTTP处理器"""
    
    def _set_headers(self, content_type="application/json"):
        """设置HTTP响应头，包括CORS支持"""
        self.send_response(200)
        self.send_header('Content-type', content_type)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')
        self.send_header('Access-Control-Allow-Credentials', 'true')
        self.send_header('Access-Control-Max-Age', '86400')
        self.end_headers()
    
    def do_OPTIONS(self):
        """处理OPTIONS请求，支持CORS预检请求"""
        self._set_headers()
        self.wfile.write(b'')

    def do_POST(self):
        global UNUSED_PROMPTS, USED_PROMPTS
        
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        
        # 生成随机ID和时间戳
        response_id = f"{random.randint(100000, 999999)}-{random.randint(1000, 9999)}-{random.randint(1000, 9999)}-{random.randint(1000, 9999)}-{random.randint(100000000000, 999999999999)}"
        created_timestamp = int(time.time())
        
        # 从未使用池中随机选择提示，如果未使用池为空则重置
        selected_indices = []
        
        for _ in range(min(5, len(PROMPTS))):
            if not UNUSED_PROMPTS:
                print("⚠️ All prompts have been used once, resetting prompt pool")
                UNUSED_PROMPTS = USED_PROMPTS
                USED_PROMPTS = []
                
            # 从未使用池中随机选择一个索引
            random_index = random.randint(0, len(UNUSED_PROMPTS) - 1)
            prompt_index = UNUSED_PROMPTS.pop(random_index)
            USED_PROMPTS.append(prompt_index)
            selected_indices.append(prompt_index)
        
        # 只在请求结束时输出一次使用情况
        print(f"📊 Used: {len(USED_PROMPTS)}/{len(PROMPTS)}")

        bilingual_prompts = [PROMPTS[i] for i in selected_indices]
        
        # 构建完整的DeepSeek API响应格式
        response = {
            "id": response_id,
            "object": "chat.completion",
            "created": created_timestamp,
            "model": "deepseek-chat",
            "choices": [
                {
                    "index": 0,
                    "message": {
                        "role": "assistant",
                        "content": f"```json\n{json.dumps(bilingual_prompts, ensure_ascii=False, indent=4)}\n```"
                    },
                    "logprobs": None,
                    "finish_reason": "stop"
                }
            ],
            "usage": {
                "prompt_tokens": random.randint(300, 350),
                "completion_tokens": random.randint(900, 1100),
                "total_tokens": random.randint(1200, 1400),
                "prompt_tokens_details": {"cached_tokens": 0},
                "prompt_cache_hit_tokens": 0,
                "prompt_cache_miss_tokens": random.randint(300, 350)
            },
            "system_fingerprint": f"fp_{random.randint(10000000, 99999999)}_{random.choice(['prod0225', 'prod0301', 'prod0315'])}"
        }
        
        # 添加随机延迟（1-5秒）模拟网络延迟
        delay_time = random.uniform(1, 5)
        print(f"Simulated delay: {delay_time:.2f}s")
        time.sleep(delay_time)
        
        self._set_headers()
        self.wfile.write(json.dumps(response, ensure_ascii=False).encode())


if __name__ == '__main__':
    # 解析命令行参数
    parser = argparse.ArgumentParser(description='Start mock AI API server')
    parser.add_argument('--port', type=int, default=8000, help='Server port (default: 8000)')
    args = parser.parse_args()

    # 创建服务器实例
    server_address = ('', args.port)
    httpd = HTTPServer(server_address, AIAPIHandler)
    
    try:
        # 输出启动信息
        print(f'🚀 Server started at http://localhost:{args.port}')
        print('📡 Available endpoints:')
        print(f'• POST http://localhost:{args.port}/  Get random prompts (1-5s delay)')
        print('📊 Current status: Total {0} prompts'.format(len(PROMPTS)))
        print('\n🔍 Request example:')
        print(f'curl -X POST http://localhost:{args.port}/ -H "Content-Type: application/json" -d \'{{"model": "deepseek-chat"}}\'')
        print('\n🛑 Press Ctrl+C to stop the server')
        
        # 启动服务
        httpd.serve_forever()
    except KeyboardInterrupt:
        print('\n🛑 Server stopped')
    except OSError as e:
        if e.errno == 48:
            print(f'❌ Port {args.port} is already in use, please use a different port')
        else:
            print(f'❌ Failed to start: {str(e)}')