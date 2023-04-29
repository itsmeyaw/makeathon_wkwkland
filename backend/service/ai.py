import os
import logging

import openai
from azure.ai.translation.document import DocumentTranslationClient
from azure.ai.translation.text.models import InputTextItem
from azure.core.credentials import AzureKeyCredential
from dotenv import load_dotenv
from azure.cognitiveservices.vision.computervision import ComputerVisionClient
from azure.ai.translation.text import TextTranslationClient, TranslatorCredential
from msrest.authentication import CognitiveServicesCredentials
from azure.storage.blob import BlobServiceClient

# Make sure dotenv is loaded every time
load_dotenv()

logger = logging.getLogger('AI Service')

openai.api_key = os.getenv('OPENAI_API_KEY')


def recognize_speech(filename: str, language: str) -> str:
    """
    :param filename: The filename of the audio (must be WAV file)
    :return: The text recognized from the audio
    """
    logger.info(f'Started speech recognition with file ${filename}')
    with open(filename, 'rb') as audio_file:
        result = openai.Audio.transcribe("whisper-1", audio_file, language=language)
        return result.text


def translate_text(text: str, src_lang: str, dst_lang: str) -> (str, float):
    client = TextTranslationClient(
        endpoint=os.getenv('TRANSLATOR_TEXT_BACKEND'),
        credential=TranslatorCredential(os.getenv('TRANSLATOR_KEY'), region=os.getenv('TRANSLATOR_REGION'))
    )
    result = client.translate(
        content=[InputTextItem(text=text)],
        suggested_from=src_lang,
        to=[dst_lang]
    )

    translation = result[0] if result else None
    if translation and len(translation.translations) > 0:
        return translation.translations[0].text, translation.detected_language.score
    return '', 0


def upload_file_to_azure_blob(file_path: str) -> str:
    client = BlobServiceClient.from_connection_string(os.getenv('BLOB_CONNECTION_STRING'))
    pass


def translate_document(file_url: str, src_lang: str, dst_lang: str) -> (str, float):
    client = DocumentTranslationClient(
        endpoint=os.getenv('TRANSLATOR_DOCUMENT_BACKEND'),
        credential=AzureKeyCredential(os.getenv('TRANSLATOR_KEY'))
    )

    # translation = client.begin_translation(file_url=file_url, )


def create_title(text: str) -> str:
    logger.info("Starting text summarization")
    result = openai.ChatCompletion.create(
        model='gpt-3.5-turbo',
        messages=[
            {"role": "system", "content": "You are a helpful assistant for summarizing text."},
            {"role": "user", "content": f'Make a short title for this text:\n{text}'}
        ]
    )

    logger.info(f'Got summarize result of {result}')
    choices = result['choices']

    if choices is not None and len(choices) > 0:
        stopped_choices = list(filter(lambda c: c['finish_reason'] == 'stop', choices))
        if len(stopped_choices) == 0:
            logger.warning('There is 0 choices with valid response')
            return ''
        return stopped_choices[0]['message']['content']

    return ''


def describe_image(file_path: str) -> str:
    client = ComputerVisionClient(
        endpoint=os.getenv('COMPVI_ENDPOINT'),
        credentials=CognitiveServicesCredentials(os.getenv('COMPVI_KEY'))
    )

    with open(file_path, 'r+b') as image_file:
        response = client.describe_image_in_stream(image_file)
        return response.captions[0].text


def analyze_pdf_file(file_path: str) -> str:
    pass


def analyze_file(file_path: str) -> str:
    if file_path.endswith('.pdf'):
        return analyze_pdf_file(file_path)


if __name__ == '__main__':
    #file = os.getenv('SPEECH_FILE')
    #print(recognize_speech(file, 'en'))
    #print(translate_text('The quick brown fox jumps over the lazy dog', 'en', 'id'))
    #print(create_title("Now I am attending the Makeathon AI competition. It is very fun and the committe are very nice. The weather is very nice and everyone seems to enjoy the moment."))
    #print(str(describe_image(os.getenv('COMPVI_FILE'))))
    pass
