from flask import Flask, jsonify, request, render_template
import requests
from deep_translator import GoogleTranslator
from concurrent.futures import ThreadPoolExecutor
import os

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

# Available languages from Google Translate
LANGUAGES = {
    'en': 'English',
    'af': 'Afrikaans',
    'sq': 'Albanian',
    'ar': 'Arabic',
    'hy': 'Armenian',
    'bn': 'Bengali',
    'bg': 'Bulgarian',
    'ca': 'Catalan',
    'zh-CN': 'Chinese',
    'hr': 'Croatian',
    'cs': 'Czech',
    'da': 'Danish',
    'nl': 'Dutch',
    'fi': 'Finnish',
    'fr': 'French',
    'de': 'German',
    'el': 'Greek',
    'gu': 'Gujarati',
    'hi': 'Hindi',
    'hu': 'Hungarian',
    'is': 'Icelandic',
    'id': 'Indonesian',
    'ga': 'Irish',
    'it': 'Italian',
    'ja': 'Japanese',
    'kn': 'Kannada',
    'ko': 'Korean',
    'lt': 'Lithuanian',
    'mk': 'Macedonian',
    'ms': 'Malay',
    'ml': 'Malayalam',
    'mr': 'Marathi',
    'ne': 'Nepali',
    'no': 'Norwegian',
    'fa': 'Persian',
    'pl': 'Polish',
    'pt': 'Portuguese',
    'pa': 'Punjabi',
    'ro': 'Romanian',
    'ru': 'Russian',
    'sr': 'Serbian',
    'si': 'Sinhala',
    'sk': 'Slovak',
    'es': 'Spanish',
    'sw': 'Swahili',
    'sv': 'Swedish',
    'ta': 'Tamil',
    'te': 'Telugu',
    'th': 'Thai',
    'tr': 'Turkish',
    'uk': 'Ukrainian',
    'ur': 'Urdu',
    'vi': 'Vietnamese',
}

def translate_text(text, target_lang):
    if target_lang == 'en':
        return text
    try:
        translator = GoogleTranslator(source='en', target=target_lang)
        return translator.translate(text)
    except Exception as e:
        print(f"Translation error: {e}")
        return text

def translate_question_data(question_data, target_lang):
    try:
        # Translate question
        translated_question = translate_text(question_data['question'], target_lang)
        
        # Translate answers
        translated_incorrect = [
            translate_text(answer, target_lang)
            for answer in question_data['incorrect_answers']
        ]
        translated_correct = translate_text(question_data['correct_answer'], target_lang)
        
        return {
            'question': translated_question,
            'incorrect_answers': translated_incorrect,
            'correct_answer': translated_correct,
            'type': question_data['type']
        }
    except Exception as e:
        print(f"Translation error in question: {e}")
        return question_data

@app.route('/get_languages')
def get_languages():
    return jsonify(LANGUAGES)

@app.route('/get_questions')
def get_questions():
    target_lang = request.args.get('lang', 'en')
    
    try:
        # Fetch questions from OpenTrivia
        response = requests.get('https://opentdb.com/api.php?amount=10&type=multiple')
        data = response.json()
        
        if data['response_code'] != 0:
            return jsonify({'error': 'Failed to fetch questions'}), 400
            
        questions = data['results']
        
        # If target language is English, return as is
        if target_lang == 'en':
            return jsonify({'results': questions})
            
        # Translate questions using thread pool for better performance
        with ThreadPoolExecutor(max_workers=10) as executor:
            translated_questions = list(executor.map(
                lambda q: translate_question_data(q, target_lang),
                questions
            ))
        
        return jsonify({'results': translated_questions})
        
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    app.run(debug=True, port=2031, host='0.0.0.0') # Replace 'port' with your desired port