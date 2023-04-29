import datetime
import logging
import os
import re
import shutil
import subprocess
import tempfile
import uuid

from backend.dto.report import Report, Activity, Document, DocumentType

logger = logging.getLogger('PDF Service')


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
    escaped_new_line = re.sub('\n', '\\\\', text)
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
            activity_variable_dictionary = {
                'ACTIVITY_NAME': activity.activity_name,
                'ACTIVITY_DESCRIPTION': convert_normal_text_to_latex(activity.description),
                'ACTIVITY_DATE': str(activity.date)
            }
            with open(f'{template_folder_path}/{activity_template_file_name}', 'r') as activity_template_file:
                activity_text = activity_template_file.read()
                activity_text = convert_latex_to_normal_text(activity_text)

                for key, value in activity_variable_dictionary.items():
                    activity_text = re.sub(r'\{\{ ' + key + r' \}\}', value, activity_text)
                activities_text += activity_text + '\n' + '\\' * 8 + '\n\n'

        report_variable_dictionary = {
            'PROJECT_NAME': report.project_name,
            'OWNER_NAME': report.owner,
            'CREATED_AT': report.created_at.isoformat(),
            'ACTIVITIES': activities_text
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

    process_latex_template(template_folder_path, tempdir, report)

    os.makedirs(output_folder_path)
    command = ['pdflatex', f'-output-directory={output_folder_path}', f'{tempdir}/{tex_file_name}']
    subprocess.run(
        args=command,
        capture_output=False
    )

    shutil.rmtree(tempdir)
    logger.info(f'Deleted temporary directory {tempdir}')


if __name__ == '__main__':
    shutil.rmtree('../data/output/output_latex', ignore_errors=True)
    report = Report(
        id=uuid.uuid4(),
        project_name='Test Project',
        created_at=datetime.date.today(),
        owner='Yudhistira Wibowo',
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
                        content='This will be picture'
                    )
                ]
            ),
            Activity(
                id=uuid.uuid4(),
                activity_name='Singing',
                description='Song: Idol! Result: excellent',
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
    compile_pdf('../resource/latex', '../data/output/output_latex', report)
