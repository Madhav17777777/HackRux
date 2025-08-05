from pymongo import MongoClient
from config import MONGO_URI

client = MongoClient(MONGO_URI)
db = client['hackrux']

def insert_document(doc):
    return db.documents.insert_one(doc)

def get_documents():
    return list(db.documents.find())