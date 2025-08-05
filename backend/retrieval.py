from llm_query import gemini_query

def semantic_search(query, documents):
    # Combine all docs for context
    context = "\n\n".join(documents)
    prompt = f"""
You are an expert assistant. Given the following documents:
{context}

And the query:
{query}

Extract the most relevant clauses or rules from the documents that answer the query. Return the clause text and its location (e.g., section or paragraph).
"""
    return gemini_query(prompt)