import os
import json
from flask import Flask, request, make_response

from .analyze import analyze_file

def create_app(config=None):
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_mapping()

    if config is None:
        # load the instance config, if it exists, when not testing
        app.config.from_pyfile('config.py', silent=True)
    else:
        # load the test config if passed in
        app.config.from_mapping(config)

    # ensure the audio folder exists
    try:
        os.makedirs('/app/uploads')
    except OSError:
        pass

    @app.route('/', methods=['GET'])
    def greet():
        return 'Hello there!'

    @app.route('/analyze', methods=['GET'])
    def analyze():
        filename = request.args.get('f')
        if filename is None:
            return make_response('Bad Request', 400)

        # try:
        #     res_dict = analyze_file(filename)
        #     return make_response(json.dumps(res_dict), 200)
        # except:
        #     return make_response('Server Error', 500)

        res_dict = analyze_file(filename)
        return make_response(json.dumps(res_dict), 200)
    return app
