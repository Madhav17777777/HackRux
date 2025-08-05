from llm_query import gemini_query

def evaluate_decision(query, clauses):
    prompt = f"""
You are a decision-making assistant for an insurance company.

Given the user query:
"{query}"

And the following relevant policy clauses:
{clauses}

Your task is to analyze whether the query is **approved** or **rejected** based on the clauses and determine the **payout amount** (if any).

🛑 IMPORTANT INSTRUCTIONS:
- Respond ONLY with a valid JSON object.
- DO NOT include any text, labels, headers, or explanations outside the JSON.
- The JSON must have exactly these 3 keys:
  - "decision": either "approved" or "rejected"
  - "amount": a number (0 if rejected)
  - "justification": a short, clear reason (1 sentence only)

✅ Example of correct output:
{{"decision": "approved", "amount": 5000, "justification": "The treatment is covered under post-hospitalization care."}}

Now generate the JSON response:
"""
    return gemini_query(prompt)
