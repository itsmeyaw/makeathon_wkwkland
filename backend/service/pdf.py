import datetime
import logging
import os
import re
import shutil
import subprocess
import sys
import tempfile
import uuid
import ai

from dto.report import Report, Activity, Document, DocumentType

logger = logging.getLogger('PDF Service')


def obtain_latex_for_recording(file_name: str, src_lang: str, dst_lang: str = None, translation: str = None) -> str:
    if dst_lang is None:
        dst_lang = src_lang

    if translation is None:
        transcription = ai.recognize_speech(filename=file_name, language=src_lang)
        translation, score = ai.translate_text(transcription, src_lang, dst_lang)

    return \
        f"""
\\\\\\\\textbf{{Recording name}}: {file_name} 

\\\\\\\\textbf{{Translation}}: {translation + ', translation score: ' + score if translation is not None and score is not None else 'No translation'}
"""


def obtain_latex_for_picture(file_path: str, destination_path: str, caption: str = None) -> str:
    location = shutil.copy(file_path, destination_path)
    logger.info(f'Copied file to {location}')

    if caption is None:
        caption = ai.describe_image(file_path)

    return \
        f"""
\\\\\\\\begin{{figure}}[H]
\\\\\\\\includegraphics[width=0.5\\\\\\\\linewidth]{{resource/{location.split('/')[-1]}}}""" + (f'\\\\\\\\caption{{{caption}}}' if caption is not None else '') + f"\\\\\\\\end{{figure}}"


def obtain_latex_for_paragraph(text: str) -> str:
    return text


def obtain_latex_for_file(file_path: str) -> str:
    return \
        f"""
\\\\\\\\textbf{{File path}}: {file_path}        
"""

def convert_latex_to_normal_text(text: str) -> str:
    # Change double
    escaped_backslash = re.sub(r'\\', '\\' * 4, text)
    return escaped_backslash


def convert_normal_text_to_latex(text: str) -> str:
    """
    Convert normal text to latex compatible string
    :param text: Normal text
    :return: Latex-formatted string
    """
    # Change new line in text to new line in Latex
    escaped_new_line = re.sub('\n', ' \n\n ', text)
    return escaped_new_line


def process_latex_template(template_folder_path: str, output_folder_path: str, report: Report) -> None:
    """
    Process latex template for report
    :param template_folder_path: Folder path of the template
    :param output_folder_path: Output folder path
    :param report: Report object
    """
    report_template_file_name = 'report.template.tex'
    activity_template_file_name = 'activity.template.tex'

    os.makedirs(output_folder_path, exist_ok=True)
    with open(f'{output_folder_path}/report.tex', 'w+') as report_tex_file, \
            open(f'{template_folder_path}/{report_template_file_name}', 'r') as report_template_file:
        activities_text = ''

        for activity in report.activities:
            documents_string = ''
            for document in activity.documents:
                if document.type == DocumentType.TEXT:
                    documents_string += obtain_latex_for_paragraph(document.content)
                elif document.type == DocumentType.PICTURE:
                    file_path = document.content
                    documents_string += obtain_latex_for_picture(file_path, f'{output_folder_path}/resource', caption=document.summary)
                elif document.type == DocumentType.AUDIO:
                    file_path = document.content
                    documents_string += obtain_latex_for_recording(file_path, document.language, translation=document.translation)
                elif document.type == DocumentType.FILE:
                    file_path = document.content
                    documents_string += obtain_latex_for_file(file_path)
                documents_string += ' \n\n '
            logger.info(documents_string)
            activity_variable_dictionary = {
                'ACTIVITY_NAME': activity.activity_name,
                'ACTIVITY_DESCRIPTION': convert_normal_text_to_latex(activity.description),
                'ACTIVITY_DATE': str(activity.date),
                'ACTIVITY_DOCUMENTS': documents_string
            }
            logger.debug(str(activity_variable_dictionary))
            with open(f'{template_folder_path}/{activity_template_file_name}', 'r') as activity_template_file:
                activity_text = activity_template_file.read()
                activity_text = convert_latex_to_normal_text(activity_text)

                for key, value in activity_variable_dictionary.items():
                    activity_text = re.sub(r'\{\{ ' + key + r' \}\}', value, activity_text)
                activities_text += activity_text + '\n\n'

        report_variable_dictionary = {
            'PROJECT_NAME': report.project_name,
            'OWNER_NAME': report.owner,
            'CREATED_AT': report.created_at.isoformat(),
            'ACTIVITIES': activities_text,
            'DESCRIPTION': report.description,
            'SUCCESS': 'Yes' if report.success else 'No'
        }

        report_text = report_template_file.read()

        for key, value in report_variable_dictionary.items():
            report_text = re.sub(r'\{\{ ' + key + r' \}\}', value, report_text)

        report_tex_file.write(report_text)


def compile_pdf(template_folder_path: str, output_folder_path: str, report: Report) -> None:
    tex_file_name = 'report.tex'

    logger.info(f'Compiling PDF from template folder {template_folder_path} for report {report.id}')

    tempdir = tempfile.mkdtemp()
    logger.info(f'Created temporary folder {tempdir}')

    shutil.copytree(f'{template_folder_path}/resource', f'{tempdir}/resource')
    process_latex_template(template_folder_path, tempdir, report)

    os.makedirs(output_folder_path)
    command = ['pdflatex', f'-output-directory={os.getcwd()}/{output_folder_path}', f'{tex_file_name}']
    subprocess.run(
        args=command,
        capture_output=False,
        cwd=tempdir
    )

    # shutil.rmtree(tempdir)
    logger.info(f'Deleted temporary directory {tempdir}')


if __name__ == '__main__':
    logger.setLevel(logging.DEBUG)
    handler = logging.StreamHandler(sys.stdout)
    handler.setLevel(logging.DEBUG)
    logger.addHandler(handler)
    shutil.rmtree('data/output/output_latex', ignore_errors=True)
    report = Report(
        id=uuid.uuid4(),
        project_name='Test Project',
        created_at=datetime.date.today(),
        success=True,
        owner='Yudhistira Wibowo',
        description='This is test desc',
        collaborators=[
            'Misayaki Suzuki',
            'YOASOBI'
        ],
        activities=[
            Activity(
                id=uuid.uuid4(),
                activity_name='Singing',
                description='Song: DADDY DADDY DO!\nResult: Good',
                date=datetime.date.today(),
                documents=[
                    Document(
                        id=uuid.uuid4(),
                        type=DocumentType.TEXT,
                        content='Everything went OK'
                    ),
                    Document(
                        id=uuid.uuid4(),
                        type=DocumentType.PICTURE,
                        content='data/hanabi.jpg'
                    )
                ]
            ),
            Activity(
                id=uuid.uuid4(),
                activity_name='Singing',
                description='Song: Idol!\nResult: excellent',
                date=datetime.date.today(),
                documents=[
                    Document(
                        id=uuid.uuid4(),
                        type=DocumentType.TEXT,
                        content='The stage rocks!'
                    ),
                ]
            )
        ]
    )
    compile_pdf('resource/latex', 'data/output/output_latex', report)
