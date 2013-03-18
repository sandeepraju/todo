import pickle
import json

from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

# view
@app.route('/')
def index():
    return render_template("index.html")

# refresh
@app.route('/refresh')
def refresh():
    data = [
    {
        "id": 1,
        "todo": 'Test application',
        "priority": 5,
        "completed": False
    },
    {
        "id": 2,
        "todo": 'Test product',
        "priority": 3,
        "completed": True
    },
    {
        "id": 3,
        "todo": 'Learn python',
        "priority": 2,
        "completed": False
    },
    {
        "id": 4,
        "todo": 'Nothing Here',
        "priority": 1,
        "completed": True
    }]

    db = open("todo.db", "w")
    db.write(pickle.dumps({
        "data": data,
        "nextId": len(data) + 1
        }))
    db.close()

    return "OK"

# api

@app.route('/api/task', methods=['GET', 'POST'])
@app.route('/api/task/<id>', methods=['PUT', 'DELETE'])
def task(id=None):
    db = open("todo.db", "r")
    database = pickle.loads(db.read())
    db.close()

    if id is None:
        if request.method == 'GET':
            return json.dumps(database["data"])
        elif request.method == 'POST':
            data = json.loads(request.data)
            # No validation for now
            # assuming everything ok
            print data
            print database
            data["id"] = database["nextId"]
            database["data"].append(data)
            database["nextId"] += 1

            db = open("todo.db", "w")
            db.write(pickle.dumps(database))
            db.close()

            return json.dumps({"status": "success"})

    else:
        if request.method == 'PUT':
            data = json.loads(request.data)
            for i in xrange(len(database["data"])):
                if database["data"][i]["id"] == int(id):
                    # update the record
                    if data.get('priority', None) is not None:
                        print "yes"
                        database["data"][i]["priority"] = data["priority"]
                    if data.get('completed', None) is not None:
                        print "yes"
                        database["data"][i]["completed"] = data["completed"]
                    if data.get('todo', None) is not None:
                        print "yes"
                        database["data"][i]["todo"] = data["todo"]

                    db = open("todo.db", "w")
                    db.write(pickle.dumps(database))
                    db.close()

                    return json.dumps({"status": "success"})

            return json.dumps({"status": "failure"})

        elif request.method == 'DELETE':
            data = json.loads(request.data)
            for i in xrange(len(database["data"])):
                if database["data"][i]["id"] == int(id):
                    # delete the record

                    database["data"].pop(i)
                    
                    db = open("todo.db", "w")
                    db.write(pickle.dumps(database))
                    db.close()

                    return json.dumps({"status": "success"})

            return json.dumps({"status": "failure"})

if __name__ == "__main__":
    app.run(debug=True,
            port=8000)