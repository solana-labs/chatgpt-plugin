from langchain.chat_models import ChatOpenAI
from langchain.agents import load_tools, initialize_agent
from langchain.agents import AgentType
from plugintool import AIPluginTool

if __name__ == '__main__':
    # Setup environment variables
    import os
    DEV_ENV = os.environ['DEV'] == 'true'
    URL = "http://localhost:3000" if DEV_ENV else "https://solana-gpt-plugin.onrender.com"
    llm = ChatOpenAI(temperature=0) 

    # AI Agent does best when it only has one available tool
    # to engage with URLs
    tools = load_tools(["requests_post"])

    # AIPluginTool only fetches and returns the openapi.yaml linked to in /.well-known/ai-plugin.json
    # This may need some more work to avoid blowing up LLM context window
    # This is a way of defining a tool from the ai plugin documentation in a way that langchain understands
    tool = AIPluginTool.from_plugin_url(URL + "/.well-known/ai-plugin.json")
    tools += [tool]

    # Setup an agent to answer the question without further human feedback
    agent_chain = initialize_agent(
        tools, llm, agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION, verbose=True)
    
    # Uncomment the following print statements to see the prompts that led to the decisions
    # print("Log: Now we're printing the prompt and what led to the decisions:")
    # print(agent_chain.agent.llm_chain.prompt.template)

    # All the chains will run one by one independently. You can test any one of them individually. 
    # Ask the question, and the agent loop
    # Case 1 (getBalance):
    agent_chain.run("What is the balance in account 8fbqVvpK3Dj7fdP2c8JJhtD7Zy3n9qtwAeGfbkgPu625?")
    # Expected response: <Numerical value>
    
    # Case 2 (getAccountInfo): 
    agent_chain.run("Could you some info for the account 8fbqVvpK3Dj7fdP2c8JJhtD7Zy3n9qtwAeGfbkgPu625?")
    # Expected response: The account 8fbqVvpK3Dj7fdP2c8JJhtD7Zy3n9qtwAeGfbkgPu625 has a balance of <Numerical value> lamports and is owned by the address <owner>.

    # Case 3 (getTokenAccounts): 
    agent_chain.run("Could you tell me all the assets owned by owner 8fbqVvpK3Dj7fdP2c8JJhtD7Zy3n9qtwAeGfbkgPu625 ?")
    # Expected response: The assets owned by the owner with address 8fbqVvpK3Dj7fdP2c8JJhtD7Zy3n9qtwAeGfbkgPu625 are [{"mint":<Address>,"amount":<Numerical Value>}].
    

    # Case 4 (getTokenAccounts): 
    agent_chain.run("Could you tell me the last transaction i made on Solana with address 8fbqVvpK3Dj7fdP2c8JJhtD7Zy3n9qtwAeGfbkgPu625?")
    # Expected response: The last transaction made by the given address is the one with signature <Signature>.
