import json
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class Person(BaseModel):
    name: str
    age: int
    
    
with open('people.json','r') as f:
    people = json.load(f)
print(people)
@app.get('/person/{age}')
def ger_person(age:int):
    person = [p for p in people if p['age']==age]
    print(person)
    return person[0] if len(person)>0 else {}