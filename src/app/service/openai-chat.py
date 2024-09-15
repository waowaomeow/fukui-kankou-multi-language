import os, requests
from openai import AzureOpenAI

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


message_text = [
    {
        "role": "user",
        "content": "What are the differences between Azure Machine Learning and Azure AI services?",
    }
]

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

response = client.chat.completions.create(
    model="gpt-4o",  # model = deployment_name".
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "Does Azure OpenAI support customer managed keys?"},
        {
            "role": "assistant",
            "content": "Yes, customer managed keys are supported by Azure OpenAI.",
        },
        {"role": "user", "content": "Do other Azure AI services support this too?"},
        {"role": "user", "content": "我是来自中国的游客请问有什么福井县推荐的观光地?"},
    ],
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

print(response)
