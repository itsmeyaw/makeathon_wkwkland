from pymongo import MongoClient
from datetime import datetime
from flask import Flask, jsonify, request
from bson.objectid import ObjectId
import base64
import uuid
from service import ai, pdf
from dto import report as report_dto




app = Flask(__name__)
root = '/wkwk/api/v1'


# connect to database
client = MongoClient('localhost', 27017)
db = client.wkwk

# reports structure : {id, project_name, description, created_at, start_date, end_date, [activities], [collaborators]}
    # collaborators structure : {name, email, role}
    # activities structure : {id, activity_name, description, date, [documents], language}
        # documents structure : {id, type, content}
            # type : image, text, , input_text, audio, video
reports = db.reports
activities = db.activities
documents = db.documents
employees = db.employees

# === debug ===
@app.route(root + '/debug', methods=['POST'])
def debug():
    # image_item = request.files['image']
    # img = Image.open(image_item)
    # img = img.convert('L')
    # img.save('test.jpg')
    # return "debug"


    # text_item = request.files['text']
    # text_item = text_item.read()
    # text_item = text_item.decode('utf-8')

    # with open('test.txt', 'w') as file:
    #     file.write(text_item)

    # return "debug"
    return " "




# ================================================================================================ /reports
# create report
@app.route(root + '/reports', methods=['POST'])
def create_report():
    report_item = request.get_json()

    # chceck json format is correct
    if 'project_name' not in report_item or 'start_date' not in report_item or 'end_date'not in report_item  or 'owner' not in report_item or 'description' not in report_item:
        return jsonify({'result' : 'failed', 'message' : 'Invalid JSON format'}), 400

    report_item['start_date'] = datetime.strptime(report_item['start_date'], "%Y-%m-%d")
    report_item['end_date'] = datetime.strptime(report_item['end_date'], "%Y-%m-%d")
    report_item['created_at'] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    report_item['activities'] = []
    owner_item = {
        'name' : report_item['owner']['name'],
        'email' : report_item['owner']['email'],
        'role' : 'owner'
    }
    report_item['collaborators'] = [owner_item]

    reports.insert_one(report_item)
    employees.insert_one(owner_item)
    return jsonify({'result' : 'report creation successful'}), 200

# get all reports
@app.route(root + '/reports', methods=['GET'])
def get_reports():
    report_list = []
    for report in reports.find():
        report_list.append({
            'id' : str(report['_id']),
            'project_name' : report['project_name'],
            'description' : report['description'],
            'created_at' : report['created_at'],
            'start_date' : report['start_date'],
            'end_date' : report['end_date'],
        })
    if len(report_list) == 0:
        return jsonify({'result' : 'no reports found'}), 404
    
    return jsonify({'result' : report_list}), 201

# get report by id
@app.route(root + '/reports/<id>', methods=['GET'])
def get_report(id):
    report_item = reports.find_one({'_id' : ObjectId(id)})
    if report_item:        
        activities_list = []
        for activity in report_item['activities']:
            activities_list.append({
                'id' : str(activity['_id']),
                'activity_name' : activity['activity_name'],
                'date' : activity['date'],
                'language' : activity['language'],
            })
        report = ({
            'id' : str(report_item['_id']),
            'project_name' : report_item['project_name'],
            'description' : report_item['description'],
            'created_at' : report_item['created_at'],
            'start_date' : report_item['start_date'],
            'end_date' : report_item['end_date'],
            'activities' : activities_list
        })
    else:
        return jsonify({'result' : 'report not found'}), 404
    
    return jsonify({'result' : report}), 201

# delete all reports
@app.route(root + '/reports', methods=['DELETE'])
def delete_reports():
    for report in reports.find():
        reports.delete_one(report)
    return jsonify({'result' : 'delete successful'}), 203

# ================================================================================================ /reports/<report_id>/activities
# query activities in report 
@app.route(root + '/reports/<report_id>/activities', methods=['POST'])
def post_activities(report_id):
    report_item = reports.find_one({'_id' : ObjectId(report_id)})
    if report_item:
        activity_item = request.get_json()
        if 'activity_name' not in activity_item or 'description' not in activity_item or 'date' not in activity_item or 'language' not in activity_item:
            return jsonify({'result' : 'failed', 'message' : 'Invalid JSON format'}), 400
        activity_item['documents'] = []
        activities.insert_one(activity_item)
        report_item['activities'].append(activity_item)
        reports.update_one({'_id' : ObjectId(report_id)}, {'$set' : report_item})
        return jsonify({'result' : 'activity creation successful'}), 200
    else:
        return jsonify({'result' : 'report not found'}), 404
    
# get all activities in specific report draft
@app.route(root + '/reports/<report_id>/activities', methods=['GET'])
def get_activities(report_id):
    report_item = reports.find_one({'_id' : ObjectId(report_id)})
    if report_item:
        activities_list = []
        for activity in report_item['activities']:
            activities_list.append({
                'id' : str(activity['_id']),
                'activity_name' : activity['activity_name'],
                'date' : activity['date'],
            })
        return jsonify({'result' : activities_list}), 201
    else:
        return jsonify({'result' : 'report not found'}), 404

# get activity query in specific report draft
@app.route(root + '/reports/<report_id>/activities/<activity_id>', methods=['GET'])
def get_activity(report_id, activity_id):
    report_item = reports.find_one({'_id' : ObjectId(report_id)})
    if report_item:
        activity_item = activities.find_one({'_id' : ObjectId(activity_id)})
        if activity_item:
            doucments_list = []
            for document in activity_item['documents']:
                doucments_list.append({
                    'id' : str(document['_id']),
                    'type' : document['type'],
                    'content' : document['content']
                })
            print(activity_item['documents'])
            activity = ({   
                'id' : str(activity_item['_id']),
                'activity_name' : activity_item['activity_name'],
                'description' : activity_item['description'],
                'date' : activity_item['date'],
                'documents': doucments_list
            })
            return jsonify({'result' : activity}), 201
        else:
            return jsonify({'result' : 'activity not found'}), 404
    else:
        return jsonify({'result' : 'report not found'}), 404
    

# ================================================================================================ /reports/<report_id>/activities/<activity_id>/documents
# add a document to specific activity
@app.route(root + '/reports/<report_id>/activities/<activity_id>/documents', methods=['POST'])
def post_documents(report_id, activity_id):
    report_item = reports.find_one({'_id' : ObjectId(report_id)})
    if report_item:
        activity_item = activities.find_one({'_id' : ObjectId(activity_id)})
        if activity_item:
            file_name = str(activity_item['_id']) + '_' + str(uuid.uuid4())
            document_item = request.get_json()
            if 'type' not in document_item or 'content' not in document_item:
                return jsonify({'result' : 'failed', 'message' : 'Invalid JSON format'}), 400
            
            # if document is an encoded base64 string
            if document_item['type'] == 'text':
                text_item_raw = document_item['content']
                text_item_decoded = base64.b64decode(text_item_raw).decode('utf-8')
                with open(file_name + ".txt", 'w') as f:
                    f.write(text_item_decoded)
                    document_item['content'] = file_name + ".txt"

            # if document is an image encoded in base64 string
            if document_item['type'] == 'image':
                image_item_raw = document_item['content']
                image_item_decoded = base64.b64decode(image_item_raw)
                with open(file_name + ".png", 'wb') as f:
                    f.write(image_item_decoded)
                    document_item['content'] = file_name + ".png"

            # if document is an audio in base64 string
            if document_item['type'] == 'audio':
                audio_item_raw = document_item['content']
                audio_item_decoded = base64.b64decode(audio_item_raw)
                with open(file_name + ".mp3", 'wb') as f:
                    f.write(audio_item_decoded)
                    document_item['content'] = file_name + ".mp3"
                

            documents.insert_one(document_item)
            activity_item['documents'].append(document_item)
            
            activities.update_one({'_id' : ObjectId(activity_id)}, {'$set' : activity_item})
            reports.update_one({'_id' : ObjectId(report_id)}, {'$set' : report_item})

            return jsonify({'result' : 'document creation successful'}), 200
        else:
            return jsonify({'result' : 'activity not found'}), 404
    else:
        return jsonify({'result' : 'report not found'}), 404
    
# get all documents in specific activity
@app.route(root + '/reports/<report_id>/activities/<activity_id>/documents', methods=['GET'])
def get_documents(report_id, activity_id):
    report_item = reports.find_one({'_id' : ObjectId(report_id)})
    if report_item:
        activity_item = activities.find_one({'_id' : ObjectId(activity_id)})
        if activity_item:
            documents_list = []
            for document in activity_item['documents']:
                documents_list.append({
                    'id' : str(document['_id']),
                    'type' : document['type'],
                    'content' : document['content']
                })
            return jsonify({'result' : documents_list}), 201
        else:
            return jsonify({'result' : 'activity not found'}), 404
    else:
        return jsonify({'result' : 'report not found'}), 404

# get document query in specific activity
@app.route(root + '/reports/<report_id>/activities/<activity_id>/documents/<document_id>', methods=['GET'])
def get_document(report_id, activity_id, document_id):
    report_item = reports.find_one({'_id' : ObjectId(report_id)})
    if report_item:
        activity_item = activities.find_one({'_id' : ObjectId(activity_id)})
        if activity_item:
            document_item = documents.find_one({'_id' : ObjectId(document_id)})
            if document_item:
                document = ({   
                    'id' : str(document_item['_id']),
                    'type' : document_item['type'],
                    'content' : document_item['content']
                })
                return jsonify({'result' : document}), 201
            else:
                return jsonify({'result' : 'document not found'}), 404
        else:
            return jsonify({'result' : 'activity not found'}), 404
    else:
        return jsonify({'result' : 'report not found'}), 404
    
# ================================================================================================ 

# generate report select language
@app.route(root + '/reports/<report_id>/languages/<target_language>', methods=['GET'])
def generate_report(report_id, target_language):
    report_item = reports.find_one({'_id' : ObjectId(report_id)})
    activity_list_translated = []
    if report_item:
        # translate all activities in report for languages other than the selected one
        for activity in report_item['activities']:
            activity_item = activities.find_one({'_id' : ObjectId(activity['_id'])})
            
            document_list_translated = []
            lang_activity = activity_item['language']

            # change activity name if language is different
            if lang_activity != target_language:
                activity_item['activity_name'] = ai.translate_text(activity_item['activity_name'], lang_activity, target_language)
                activity_item['description'] = ai.translate_text(activity_item['description'], lang_activity, target_language)

            # if language is different, translate the activity and all the documents in it
            for document in activity_item['documents']:
                document_item = documents.find_one({'_id' : ObjectId(document['_id'])})

                # search for text documents in the activity and translate them
                if document['type'] == 'text':
                    if lang_activity != target_language:
                        with open(document['content'], 'r') as f:
                            text = f.read()
                            translated_text, metric = ai.translate_text(text, lang_activity, target_language)
                            document_item['content'] = translated_text
                
                # search for audio files in the activity and transcribe them
                elif document['type'] == 'audio':
                    transcripted_text = ai.recognize_speech(document['content'], lang_activity)
                    translated_text, metric = ai.translate_text(transcripted_text, lang_activity, target_language)
                    document_item['content'] = translated_text

                document_list_translated.append(
                    report_dto.Document(
                        id = uuid.uuid4(),
                        type= str(document_item['type']).replace('_', '\\_'),
                        content = str(document_item['content']).replace('_', '\\_')
                    )
                )

            print(document_list_translated)

            activity_list_translated.append(report_dto.Activity(
                id = uuid.uuid4(),
                activity_name = str(activity_item['activity_name']).replace('_', '\\_'),
                description = str(activity_item['description']).replace('_', '\\_'),
                # make date iso format
                date = datetime.strptime(activity_item['date'], '%Y-%m-%d').isoformat(),
                documents = document_list_translated
            ))

        print(activity_list_translated)
        # report_translated = {
        #     'project_name' : report_item['project_name'],
        #     'description' : report_item['description'],
        #     'success' : True,
        #     'activities' : activity_list_translated,
        #     'created_at' : report_item['created_at'],
        #     'owner' : report_item['collaborators'][0]['name'],
        #     'collaborators' : report_item['collaborators'][1:],
        # }

        collaborator_list = []
        for collaborator in report_item['collaborators']:
            collaborator_list.append(collaborator['name'])

        report_object = report_dto.Report(
            id = uuid.uuid4(),
            project_name = str(report_item['project_name']).replace('_', '\\_'),
            description = str(report_item['description']).replace('_', '\\_'),
            success = True,
            activities= activity_list_translated,
            owner= report_item['collaborators'][0]['name'],
            collaborators= collaborator_list,
            created_at= datetime.strptime(report_item['created_at'], "%Y-%m-%d %H:%M:%S").date()
        )

        pdf.compile_pdf(report=report_object, output_folder_path='data/output/output_latex', template_folder_path='resource/latex')
            
                            
                    

    return "debug"

# get all collaborators of a specific report
@app.route(root + '/reports/<report_id>/colaborators', methods=['GET'])
def get_collaborators(report_id):
    return

# add collaborator of a specific report
@app.route(root + '/reports/<report_id>/colaborators', methods=['POST'])
def post_collaborator(report_id):
    report_item = reports.find_one({'_id' : ObjectId(report_id)})
    if report_item:
        collaborator_item = request.get_json()
        if 'username' not in collaborator_item:
            return jsonify({'result' : 'failed', 'message' : 'Invalid JSON format'}), 400
        employees.insert_one(collaborator_item)
        report_item['collaborators'].append(collaborator_item)
        reports.update_one({'_id' : ObjectId(report_id)}, {'$set' : report_item})
        return jsonify({'result' : 'collaborator creation successful'}), 200
    return


if __name__ == '__main__':
    app.run(port=8080, host="10.183.126.209")
