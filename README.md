# MindSparks

MindSparks is a multilingual trivia application built with Flask that allows users to play trivia games in multiple languages. The application fetches trivia questions and automatically translates them into the user's preferred language using Google Translate.

🎮 **[Play the game now!](https://mindsparks.vulpine.pro)**

## Features

- Dynamic trivia questions from an external API
- Support for 50+ languages
- Real-time translation of questions and answers
- Clean and intuitive web interface
- Beautiful animations and loading states
- Mobile-responsive design

## Prerequisites

- Python 3.6 or higher
- A web browser (not internet explorer lmao)
- Internet connection (for translations and trivia questions)

## Installation

> **Note**: These installation steps are for local development. To play the game, simply visit [mindsparks.vulpine.pro](https://mindsparks.vulpine.pro)

1. Clone the repository:
```bash
git clone https://github.com/vulpinefriend87/MindSparks.git
cd MindSparks
```

2. Create and activate a virtual environment (optional but recommended):
```bash
python -m venv venv
# On Windows
.\venv\Scripts\activate
# On Unix or MacOS
source venv/bin/activate
```

3. Install the required dependencies:
```bash
pip install -r requirements.txt
```

## Running the Application

To start the application, run:
```bash
python app.py
```

The application will be available at `http://localhost:2031`

## Project Structure

```
MindSparks/
├── app.py              # Main Flask application file
├── requirements.txt    # Python dependencies
├── static/            # Static files
│   ├── script.js      # Frontend game logic
│   └── styles.css     # Application styling
├── templates/         # HTML templates
│   └── index.html     # Main game interface
└── README.md          # Project documentation
```

## Technical Stack

- **Backend**: Flask (Python web framework)
- **Frontend**: HTML5, CSS3, JavaScript
- **External Services**:
  - Google Translate API (via [deep-translator](https://pypi.org/project/deep-translator/))
  - Trivia Question API ([OpenTriviaDB](https://opentdb.com/))
- **Styling**: Custom CSS with animations
- **Fonts**: Google Fonts ([Poppins](https://fonts.google.com/specimen/Poppins))

## Contributing

Feel free to fork the repository and submit pull requests for any improvements.

## License

This project is open source and available under the MIT License.
