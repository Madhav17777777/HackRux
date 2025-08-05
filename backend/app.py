from fastapi import FastAPI, UploadFile, File
from pydantic import BaseModel
from models import insert_document, get_documents
from document_ingest import ingest_document
from retrieval import semantic_search
from decision_logic import evaluate_decision
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi import Request
import re

app = FastAPI()
# filepath: c:\Users\madha\OneDrive\Desktop\HackRux\HackRux\backend\app.py
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
@app.post("/upload/")
async def upload_doc(file: UploadFile = File(...)):
    contents = await file.read()
    file_path = f"../data/uploads/{file.filename}"
    with open(file_path, "wb") as f:
        f.write(contents)
    text = ingest_document(file_path)
    insert_document({"filename": file.filename, "text": text})
    return {"status": "uploaded"}

class QueryRequest(BaseModel):
    query: str

@app.post("/query/")
async def process_query(request: QueryRequest):
    try:
        query = request.query
        docs = [doc['text'] for doc in get_documents()]
        clauses = semantic_search(query, docs)
        decision_raw = evaluate_decision(query, clauses)

        print("RAW DECISION OUTPUT FROM MODEL:\n", decision_raw)  # Log for debugging

        import json

        decision = {
            "decision": "rejected",
            "amount": 0,
            "justification": ""
        }

        if isinstance(decision_raw, str):
            try:
                decision = json.loads(decision_raw)
            except:
                match = re.search(r"\{.*\}", decision_raw, re.DOTALL)
                if match:
                    try:
                        decision = json.loads(match.group())
                    except:
                        # Heuristic fallback
                        if any(x in decision_raw.lower() for x in ["yes", "approved", "covered"]):
                            decision["decision"] = "approved"
                        decision["justification"] = decision_raw
                else:
                    if any(x in decision_raw.lower() for x in ["yes", "approved", "covered"]):
                        decision["decision"] = "approved"
                    decision["justification"] = decision_raw
        elif isinstance(decision_raw, dict):
            decision = decision_raw

        return {"response": decision}
    except Exception as e:
        print("Error in /query/:", e)
        return JSONResponse(status_code=500, content={"error": str(e)})
