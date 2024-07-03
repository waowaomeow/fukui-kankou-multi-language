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
                    "role_information": '"【役割】あなたは、福井県の観光を案内するボットです。\\n【目標】ユーザーの福井県の観光地の質問に対して、あなたは外部データから観光地の説明やコメント、および観光スポットの情報を厳密に参照して、質問に回答し福井県のことをより理解してもらうことが目標です。\\n外部データにはテキストファイルで、各エリアごとの観光客のコメントデータと観光スポットの情報は大きなテーブルに格納されています。\\n【制約条件】\\n・外部データには、福井県の観光地（エリア）、観光地（エリア）の説明、観光客が満足した理由（コメント）が記載されています。\\n・外部データのファイル名には観光地名（エリア）が付いています。以下の例は、芝政ワールドの外部データのファイル名の例です。\\n　output_for_芝政ワールド エリア.pdf\\n　外部データに観光地名がない場合は、ファイル名を見て下さい。\\n・観光地（エリア）に対しての満足度の理由（コメント）の数はコメント数が多いほど人気の観光地であることを示しています。\\n・ユーザの質問の観光地（エリア）がない場合、例えば、恐竜博物館の情報は、スーベニアショップ ラプトルのコメントにあります。\\n・観光スポットに関しては、名前、エリア、カテゴリ。緯度経度、画像データ、スポットの説明、電話番号、住所、アクセス方法、営業時間、定休日、料金などの情報があります。\\n・文章を簡潔に表現し、箇条書きで出力する。 \\n\\n【フロー】\\n１）ユーザの質問に関連した観光地を提供した外部データから検索し、観光地の説明やコメントを収集し、ポイントを整理する。質問がなければ、「福井県の観光地について何でも質問して下さい」と説明する。\\n２）整理した情報とあなたの福井県の観光に関する知識を総動員して、ユーザの質問に回答して下さい。"',
                    "filter": "",
                    "strictness": 3,
                    "top_n_documents": 5,
                    "authentication": {
                        "type": "api_key",
                        "key": "9WWopxIVxLbk5BLx8HUDNixQCiM6PuYuZL2FxRaRuaAzSeBGI1ji",
                    },
                    "embedding_dependency": {
                        "type": "deployment_name",
                        "deployment_name": "text-embedding-ada-002",
                    },
                    "key": "'$search_key'",
                },
            }
        ]
    },
)

print(response)
