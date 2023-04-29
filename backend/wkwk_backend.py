from pymongo import MongoClient
from datetime import datetime
from flask import Flask, jsonify, request
from bson.objectid import ObjectId

app = Flask(__name__)
root = '/wkwk/api/v1'


# connect to database
client = MongoClient('localhost', 27017)
db = client.wkwk

# create collections for reports
reports = db.reports
activities = db.activities
languages = db.languages
collaborators = db.collaborators


# create report
@app.route(root + '/reports', methods=['POST'])
def create_report():
    report_item = request.get_json()

    # chceck json format is correct
    if 'project_name' not in report_item or 'owner' not in report_item:
        return jsonify({'result' : 'failed', 'message' : 'Invalid JSON format'}), 400

    # format datetime to smalldatetime from datetime.now()
    report_item['created_at'] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    reports.insert_one(report_item)
    return jsonify({'result' : 'success'}), 200

# get all reports
@app.route(root + '/reports', methods=['GET'])
def get_reports():
    report_list = []
    for report in reports.find():
        report_list.append({
            'id' : str(report['_id']),
            'project_name' : report['project_name'],
            'created_at' : report['created_at'],
            'owner' : report['owner']
        })
    return jsonify({'result' : report_list}), 200

# get report by id
@app.route(root + '/reports/<id>', methods=['GET'])
def get_report(id):
    report_item = reports.find_one({'_id' : ObjectId(id)})
    if report_item:
        return jsonify({'result' : {
            'id' : str(report_item['_id']),
            'project_name' : report_item['project_name'],
            'created_at' : report_item['created_at'],
            'owner' : report_item['owner']
        }}), 200
    

# delete all reports
@app.route(root + '/reports', methods=['DELETE'])
def delete_reports():
    for report in reports.find():
        reports.delete_one(report)
    return jsonify({'result' : 'success'}), 200

# publish report
@app.route(root + '/reports/<id>', methods=['POST'])
def post_report(id):
    return 

# get all activities in specific report draft
@app.route(root + '/reports/<report_id>/activities', methods=['GET'])
def get_activities(report_id, activity_id):
    return

# get activity query in specific report draft
@app.route(root + '/reports/<report_id>/activities/<activity_id>', methods=['GET'])
def get_activity(report_id, activity_id):
    return

# query activities in report 
@app.route(root + '/reports/<report_id>/activities', methods=['POST'])
def post_activity(report_id, id2):
    return

# generate report select language
@app.route(root + '/reports/<report_id>/languages/<language_id>', methods=['GET'])
def generate_report(report_id, language_id):
    return

# get all collaborators of a specific report
@app.route(root + '/reports/<report_id>/colaborators', methods=['GET'])
def get_collaborators(report_id):
    return

# add collaborator of a specific report
@app.route(root + '/reports/<report_id>/colaborators', methods=['POST'])
def post_collaborator(report_id):
    return


if __name__ == '__main__':
    app.run(port=8080)
