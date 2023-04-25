from langchain.chat_models import ChatOpenAI
from langchain.agents import load_tools, initialize_agent
from langchain.agents import AgentType
from langchain.tools import AIPluginTool


if __name__ == '__main__':
    # Setup environment variables
    import os
    DEV_ENV = os.environ['DEV'] == 'true'
    URL = "http://localhost:3333" if DEV_ENV else "https://solana-gpt-plugin.onrender.com"

    llm = ChatOpenAI(temperature=0)

    # AI Agent does best when it only has one available tool
    # to engage with URLs
    tools = load_tools(["requests_post"])

    # AIPluginTool only fetches and returns the openapi.yaml linked to in /.well-known/ai-plugin.json
    # This may need some more work to avoid blowing up LLM context window
    tool = AIPluginTool.from_plugin_url(URL + "/.well-known/ai-plugin.json")
    tools += [tool]

    # Setup an agent to answer the question without further human feedback
    agent_chain = initialize_agent(
        tools, llm, agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION, verbose=True)

    # Ask the question, and the agent loop
    agent_chain.run(
        "How many lamports does 8fbqVvpK3Dj7fdP2c8JJhtD7Zy3n9qtwAeGfbkgPu625 have?")
