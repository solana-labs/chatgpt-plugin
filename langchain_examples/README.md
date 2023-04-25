# Langchain Usage

Langchain has support for using ChatGPTs in their Agent via their `tool` interface.

We have provided examples below

### Python Example

To run the python example, you will have to have an OpenAI key (you do not need GPT-4 access to run this example).

```bash
poetry install
cd langchain_examples
OPENAI_API_KEY=sk-xxxxxxx DEV=true python python/main.py
```