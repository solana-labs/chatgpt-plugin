import os
from langchain.chat_models import ChatOpenAI
from langchain.agents import load_tools, initialize_agent
from langchain.agents import AgentType
from langchain.tools import AIPluginTool

if __name__ == '__main__':
    # Setup environment variables
    dev_env = os.environ['DEV'] == 'true'
    url = "http://localhost:3333" if dev_env else "https://solana-gpt-plugin.onrender.com"

    # Create a ChatOpenAI object with a temperature of 0
    llm = ChatOpenAI(temperature=0)

    # Load the "requests_post" tool for interacting with URLs
    tools = load_tools(["requests_post"])

    # Use the AIPluginTool to fetch the openapi.yaml file from the specified URL
    tool = AIPluginTool.from_plugin_url(url + "/.well-known/ai-plugin.json")

    # Add the AIPluginTool to the list of available tools
    tools += [tool]

    # Initialize an agent to answer the question without further human feedback
    agent_chain = initialize_agent(
        tools,
        llm,
        agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION,
        verbose=True
    )

    # Ask the question and run the agent loop
    agent_chain.run("How many lamports does 8fbqVvpK3Dj7fdP2c8JJhtD7Zy3n9qtwAeGfbkgPu625 have?")
