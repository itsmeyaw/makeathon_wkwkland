import os
import logging

import openai
from dotenv import load_dotenv
from azure.cognitiveservices.vision.computervision import ComputerVisionClient
from msrest.authentication import CognitiveServicesCredentials

# Make sure dotenv is loaded every time
load_dotenv()

logger = logging.getLogger('AI Service')

openai.api_key = os.getenv('OPENAI_API_KEY')


def recognize_speech(filename: str) -> str:
    """
    :param filename: The filename of the audio (must be WAV file)
    :return: The text recognized from the audio
    """
    logger.info(f'Started speech recognition with file ${filename}')
    with open(filename, 'rb') as audio_file:
        result = openai.Audio.transcribe("whisper-1", audio_file)
        return result.text


def create_title(text: str) -> str:
    logger.info("Starting text summarization")
    result = openai.ChatCompletion.create(
        model='gpt-3.5-turbo',
        messages=[
            {"role": "system", "content": "You are a helpful assistant for summarizing text."},
            {"role": "user", "content": f'Make a short title for this text: {text}'}
        ]
    )

    return result


def describe_image(file_path: str) -> str:
    client = ComputerVisionClient(
        endpoint=os.getenv('COMPVI_ENDPOINT'),
        credentials=CognitiveServicesCredentials(os.getenv('COMPVI_KEY'))
    )

    with open(file_path, 'r+b') as image_file:
        response = client.describe_image_in_stream(image_file)
        return response.captions[0].text


if __name__ == '__main__':
    #file = os.getenv('SPEECH_FILE')
    #print(recognize_speech(file))
    #print(create_title("Now I am attending the Makeathon AI competition. It is very fun and the committe are very nice. The weather is very nice and everyone seems to enjoy the moment."))
    #print(str(describe_image(os.getenv('COMPVI_FILE'))))
    pass
