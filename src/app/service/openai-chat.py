import os, requests
from openai import AzureOpenAI
import sys
import json  

# 重新加载 sys.stdout  设置控制台编码为 UTF-8  
sys.stdout.reconfigure(encoding='utf-8')  

client = AzureOpenAI(
    azure_endpoint="https://tourism-gpt-4o.openai.azure.com/",
    api_key="56065c4caa184770a6b32c64f75b3d42",
    api_version="2024-02-01",
)

api_type = "azure"
api_version = "2024-02-15-preview"

deployment_id = "gpt-4o"  # Add your deployment ID here

# openai.base_url = "https://tourism-gpt-4o.openai.azure.com/"
# Azure AI Search setup
search_endpoint = "https://tourismeastus.search.windows.net"
# Add your Azure AI Search endpoint here
search_key = "meodBNxaf5pcJ9sTQg3aV3K1wbEOl1PpFHDxMz4FdQAzSeDwdB8O"
# Add your Azure AI Search admin key here
search_index_name = "monthly2024allfull"
# Add your Azure AI Search index name here
semantic_configuration = "monthly2024allfull-semantic-configuration"

message_string = sys.argv[1]
role_information = sys.argv[2]
# 替换单引号为双引号  
message_string = message_string.replace("'", '"')  
role_information = role_information.replace("'", '"')  
message_text = json.loads(message_string)

response = client.chat.completions.create(
    model="gpt-4o",  # model = deployment_name".
    messages=message_text,
    extra_body={
        "data_sources": [  # camelCase is intentional, as this is the format the API expects
            {
                "type": "azure_search",
                "parameters": {
                    "endpoint": search_endpoint,
                    "index_name": search_index_name,
                    "semantic_configuration": semantic_configuration,
                    "query_type": "vector_semantic_hybrid",
                    "fields_mapping": {
                        "content_fields_separator": "\n",
                        "content_fields": ["chunk"],
                        "filepath_field": "parent_id",
                        "title_field": "title",
                        "url_field": "",
                        "vector_fields": ["text_vector"],
                    },
                    "in_scope": False,
                    "role_information": role_information,
                    "filter": "",
                    "strictness": 3,
                    "top_n_documents": 5,
                    "authentication": {
                        "type": "api_key",
                        "key": search_key,
                    },
                    "embedding_dependency": {
                        "type": "deployment_name",
                        "deployment_name": "text-embedding-ada",
                    },
                    "key": "'$search_key'",
                },
            }
        ]
    },
)
# 将 ChatCompletion 响应转换为字典  
response_dict = {  
    "id": getattr(response, 'id', None),  # 使用 getattr 防止属性不存在
    "choices": [{
            "message": {
                "content": getattr(choice.message, 'content', ''),
                "context": getattr(choice.message, 'context', ''),
            },
        } for choice in getattr(response, 'choices', [])],  # 确保 choices 存在
    "created": getattr(response, 'created', None),  
    "model": getattr(response, 'model', None),  
    "object": getattr(response, 'object', None),  
    "service_tier": getattr(response, 'service_tier', None),  
    "system_fingerprint": getattr(response, 'system_fingerprint', None),  
    "usage": {  
        "completion_tokens": getattr(response.usage, 'completion_tokens', 0),  
        "prompt_tokens": getattr(response.usage, 'prompt_tokens', 0),  
        "total_tokens": getattr(response.usage, 'total_tokens', 0),  
    } if hasattr(response, 'usage') else {},  # 确保 usage 存在
}  

# 将响应转换为 JSON 格式  
response_json = json.dumps(response_dict, ensure_ascii=False, default=str)  

# 输出 JSON 格式的响应  
print(response_json)  