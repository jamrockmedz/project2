""" main.py is the top level script.

Return "Hello World" at the root URL.
"""

import os
import sys

# sys.path includes 'server/lib' due to appengine_config.py
from flask import Flask
from flask import render_template
app = Flask(__name__.split('.')[0])


@app.route('/')
@app.route('/<name>')
def game(name=None):
  """ Return template at application root URL."""
  name = "INFO 3180"
  return render_template('memory.html', name=name)

@app.route('/memory')
def memory():
  """ Return memory card game template at application root URL."""
  return render_template('memory.html')


