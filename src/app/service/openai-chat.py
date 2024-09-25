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
search_endpoint = "https://tourism-ai-search.search.windows.net"
# Add your Azure AI Search endpoint here
search_key = "9WWopxIVxLbk5BLx8HUDNixQCiM6PuYuZL2FxRaRuaAzSeBGI1ji"
# Add your Azure AI Search admin key here
search_index_name = "txt2024-0316-0601-usermodel"
# Add your Azure AI Search index name here


# completion = openai.chat.completions.create(
#     messages=message_text,
#     model=deployment_id,

#     ],
#     temperature=0,
#     top_p=1,
#     max_tokens=800,
#     stop=None,
#     stream=True

# )
message_string = sys.argv[1]
role_information = sys.argv[2]
# model_string = sys.argv[2]
# print(model_string)
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
                    "endpoint": "https://tourism-ai-search.search.windows.net",
                    "index_name": "txt2024-0316-0601-usermodel",
                    "semantic_configuration": "txt2024-0316-0601-usermodel-semantic-configuration",
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
                        "key": "9WWopxIVxLbk5BLx8HUDNixQCiM6PuYuZL2FxRaRuaAzSeBGI1ji",
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
    "id": response.id,  
    "choices": [{  
            "message": {
                "content":choice.message.content,
                "context":choice.message.context
            },  
        } for choice in response.choices],  
    "created": response.created,  
    "model": response.model,  
    "object": response.object,  
    "service_tier": response.service_tier,  
    "system_fingerprint": response.system_fingerprint,  
    "usage": {  
        "completion_tokens": response.usage.completion_tokens,  
        "prompt_tokens": response.usage.prompt_tokens,  
        "total_tokens": response.usage.total_tokens,  
    },
}  

# 将响应转换为 JSON 格式  
response_json = json.dumps(response_dict, ensure_ascii=False)  

# 输出 JSON 格式的响应  
print(response_json)  