# Import the Flask class and other necessary functions
import os
from flask import Flask, render_template, send_from_directory

# Create an instance of the Flask class.
# The template_folder and static_folder are set to the current directory
# to match your file structure.
app = Flask(__name__, template_folder='.', static_folder='.')

# Define the root route ('/').
@app.route('/')
def home():
    # Render the index.html file directly from the current directory.
    return render_template('index.html')

# Define a route to serve the CSS file.
# The path is set to /styles.css to match your file's location.
@app.route('/styles.css')
def serve_css():
    # Use send_from_directory to serve the file from the current folder.
    return send_from_directory(app.static_folder, 'styles.css')

# Define a route to serve the JavaScript file.
# The path is set to /script.js to match your file's location.
@app.route('/script.js')
def serve_js():
    # Use send_from_directory to serve the file from the current folder.
    return send_from_directory(app.static_folder, 'script.js')

# This route handles all files in the assets directory.
@app.route('/assets/<path:filename>')
def serve_assets(filename):
    # This route serves any file from the assets folder.
    return send_from_directory('assets', filename)

# Ensure this block is executed only when the script is run directly.
if __name__ == '__main__':
    # Determine if debug mode should be enabled
    debug_mode = os.environ.get('FLASK_DEBUG') == '1'

    # Get the port from the environment, defaulting to 5000 if not specified
    port = int(os.environ.get('PORT', 5000))

    # The function call _ensure_database_schema() is commented out
    # as it's not a standard Flask function and would require a custom implementation.
    # _ensure_database_schema()

    # Run the application
    # host='0.0.0.0' makes the server accessible from outside the local machine.
    app.run(debug=debug_mode, host='0.0.0.0', port=port)
