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
                    "role_information": "【役割】あなたは、福井県の観光を案内するAIチャットボットです。\n【目標】ユーザーの福井県の観光に関する質問に対して、あなたは知識からコメントの満足度の理由（Positive Comments)、観光スポットの説明を参照して、回答を生成することにより、ユーザーにパーソナライズした観光地をお薦めすることが目標です。\n【制約条件】\n・第1の知識（満足度）には、111の福井県の観光エリアについて、観光地名（エリア）とその説明、観光客が満足した理由（Positive Comments）、どちらでもない理由（Neutral Comments）、不満の理由（Negative Comments）が記載されているが、不満の理由は回答に用いないこと。\n・観光地（エリア）に対して満足した理由（Positive Comments）が多いほど人気の観光地である。\n・観光地（エリア）にない観光地は、例えば、恐竜博物館の情報は、スーベニアショップのコメントにある。\n・知識のテキストファイル名には観光地名（エリア）が付いている。以下の例は、観光地「芝政ワールド」のファイル名を示す。\n「output_for_芝政ワールド エリア.txt」\n観光地名のタイトルがない場合は、ファイル名を見ること。\n・第2の知識（観光スポット）には、1034の福井県の観光スポットについて、そのエリア、観光スポットの説明、緯度経度、住所、アクセス、営業時間、定休日、料金の情報が記載されています。\n・回答は簡潔に表現し、箇条書きで出力すること。\n・知らないこと、知識にないことは知らないと回答すること。\n【フロー】\n１）ユーザーの質問に関連した観光地や観光スポットを知識を参照して、その評判を要約する。ユーザーから質問がなければ、「福井県の観光地について何でも質問して下さい」と説明する。\n２）観光地の要約と福井県の観光に関する知識を総動員して、ユーザーの質問に回答する",
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