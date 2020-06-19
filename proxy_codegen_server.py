from flask import Flask, jsonify, request, render_template, flash, request, redirect, url_for
import os
import io
import json
from flask_cors import CORS
import yaml

import http.server
import socketserver
from  urllib.parse  import urlparse
import os

from threading import Thread
import webbrowser
import subprocess

bashCommand = "freeport 9000"
process = subprocess.Popen(bashCommand.split(), stdout=subprocess.PIPE)
output, error = process.communicate()

bashCommand = "freeport 3010"
process = subprocess.Popen(bashCommand.split(), stdout=subprocess.PIPE)
output, error = process.communicate()


INDEXFILE = 'index.html'
CLIENT_DIR = ''
class MyHandler(http.server.SimpleHTTPRequestHandler):
   def do_GET(self):

    # Parse query data to find out what was requested
    parsedParams = urlparse(self.path)

     # See if the file requested exists
    if os.access('.' + os.sep + parsedParams.path, os.R_OK):
        # File exists, serve it up
        http.server.SimpleHTTPRequestHandler.do_GET(self);
    else:
        # send index.html, but don't redirect
        self.send_response(200)
        self.send_header('Content-Type', 'text/html')  
        self.end_headers()
        with open(CLIENT_DIR+INDEXFILE, 'r') as fin:
          print(self.wfile)
          self.copyfile(fin, self.wfile)



def start_sub_server(PORT=9000):
    try:
        print(os.getcwd())
        # os.chdir('./build')
        print(os.getcwd())
    except OSError as e:
        print('Error')
        raise("Cant change directory to client!")
    
    
    # Handler = http.server.SimpleHTTPRequestHandler
    Handler = MyHandler

    while(True):
        try:
            with socketserver.TCPServer(("", PORT), Handler) as httpd:
                print("serving at port", PORT)
                webbrowser.open('http://localhost:'+str(PORT), new=2)
                httpd.serve_forever()
        except OSError as e:
            start_sub_server(PORT+1)

def start():
    app = Flask(__name__)

    thread1 = Thread(target=start_sub_server)
    thread1.start()

    print(os.getcwd())
    UPLOAD_FOLDER = './'
    app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
    CORS(app, support_credentials=True)
    PREFIX = ""

    @app.route(PREFIX+'/create_service', methods=['POST'])
    def create_service():
        if request.method == 'POST':
                try:
                        name = request.form["name"]
                        description = request.form["description"]
                        for (index,file) in request.files.items():
                            file = yaml.safe_load(file)
                            file["description"] = description
                            service_dir = 'Services/{0}'.format(name)
                            try:
                                os.mkdir(service_dir)
                                os.mkdir(service_dir+"/Configs")
                                os.mkdir(service_dir+"/Handlers")
                                os.mkdir(service_dir+"/Clients")
                                os.mkdir(service_dir+"/Configs/schemas")
                                os.mkdir(service_dir+"/Handlers/schemas")
                                os.mkdir(service_dir+"/Clients/schemas")
                            except Exception as e:
                                return json.dumps({'Service already exists!':True, "message":str(e)}), 400, {'ContentType':'application/json'} 
                            path_to_yaml = service_dir+"/service.yaml"

                            with io.open(path_to_yaml, 'w+', encoding='utf8') as outfile:
                                yaml.dump(file, outfile, default_flow_style=False, allow_unicode=True,sort_keys=False)

                except Exception as e:
                    response = app.response_class(
                            status=400,
                            mimetype='application/json'
                        )
                    return json.dumps({'Incorrect yaml':True, "message":str(e)}), 400, {'ContentType':'application/json'} 
                response = app.response_class(
                            response=json.dumps("OK"),
                            status=200,
                            mimetype='application/json'
                        )
        
        response.headers['Access-Control-Allow-Origin'] = "*"
        return json.dumps({'success':True}), 200, {'ContentType':'application/json'} 

    @app.route(PREFIX+'/create_handler', methods=['POST'])
    def create_handler():
        if request.method == 'POST':
                try:
                        name = request.form["name"]
                        handler_name = request.form["handler_name"]
                        description = request.form["description"]
                        for (index,file) in request.files.items():
                            file = yaml.safe_load(file)
                            file["description"] = description
                            service_dir = 'Services/{0}'.format(name)
                            try:
                                os.mkdir(service_dir+"/Handlers/schemas")
                            except Exception as e:
                                pass
                            dir_to_yaml = service_dir+"/Handlers/schemas"
                            path_to_yaml = dir_to_yaml+"/"+handler_name+".yaml"
                            print("fasdfsd")
                            if os.path.isfile(path_to_yaml):
                                return json.dumps('Handler already exists!'), 400, {'ContentType':'application/json'} 
                            print("HHHHfasdfsd")
                            with io.open(path_to_yaml, 'w+', encoding='utf8') as outfile:
                                print("ADFASFSAFS")
                                yaml.dump(file, outfile, default_flow_style=False, allow_unicode=True,sort_keys=False)
                                print("JJJJJJ")

                except Exception as e:
                    response = app.response_class(
                            status=400,
                            mimetype='application/json'
                        )
                    return json.dumps({'Incorrect yaml':True, "message":str(e)}), 400, {'ContentType':'application/json'} 
                response = app.response_class(
                            response=json.dumps("OK"),
                            status=200,
                            mimetype='application/json'
                        )
        
        response.headers['Access-Control-Allow-Origin'] = "*"
        return json.dumps({'success':True}), 200, {'ContentType':'application/json'} 

    @app.route(PREFIX+'/create_client', methods=['POST'])
    def create_client():
        if request.method == 'POST':
                try:
                        name = request.form["name"]
                        client_name = request.form["client_name"]
                        description = request.form["description"]
                        for (index,file) in request.files.items():
                            file = yaml.safe_load(file)
                            file["description"] = description
                            service_dir = 'Services/{0}'.format(name)
                            try:
                                os.mkdir(service_dir+"/Clients/schemas")
                            except Exception as e:
                                pass
                            dir_to_yaml = service_dir+"/Clients/schemas"
                            path_to_yaml = dir_to_yaml+"/"+client_name+".yaml"
                            if os.path.isfile(path_to_yaml):
                                return json.dumps('Client already exists!'), 400, {'ContentType':'application/json'} 
                            with io.open(path_to_yaml, 'w+', encoding='utf8') as outfile:
                                yaml.dump(file, outfile, default_flow_style=False, allow_unicode=True,sort_keys=False)

                except Exception as e:
                    response = app.response_class(
                            status=400,
                            mimetype='application/json'
                        )
                    return json.dumps({'Incorrect yaml':True, "message":str(e)}), 400, {'ContentType':'application/json'} 
                response = app.response_class(
                            response=json.dumps("OK"),
                            status=200,
                            mimetype='application/json'
                        )
        
        response.headers['Access-Control-Allow-Origin'] = "*"
        return json.dumps({'success':True}), 200, {'ContentType':'application/json'} 

    @app.route(PREFIX+'/create_config', methods=['POST'])
    def create_config():
        if request.method == 'POST':
                try:
                        name = request.form["name"]
                        config_name = request.form["config_name"]
                        description = request.form["description"]
                        for (index,file) in request.files.items():
                            file = yaml.safe_load(file)
                            file["description"] = description
                            service_dir = 'Services/{0}'.format(name)
                            try:
                                os.mkdir(service_dir+"/Configs/schemas")
                            except Exception as e:
                                pass
                            dir_to_yaml = service_dir+"/Configs/schemas"
                            path_to_yaml = dir_to_yaml+"/"+config_name+".yaml"
                            if os.path.isfile(path_to_yaml):
                                return json.dumps('Config already exists!'), 400, {'ContentType':'application/json'} 
                            with io.open(path_to_yaml, 'w+', encoding='utf8') as outfile:
                                yaml.dump(file, outfile, default_flow_style=False, allow_unicode=True,sort_keys=False)

                except Exception as e:
                    response = app.response_class(
                            status=400,
                            mimetype='application/json'
                        )
                    return json.dumps({'Incorrect yaml':True, "message":str(e)}), 400, {'ContentType':'application/json'} 
                response = app.response_class(
                            response=json.dumps("OK"),
                            status=200,
                            mimetype='application/json'
                        )
        
        response.headers['Access-Control-Allow-Origin'] = "*"
        return json.dumps({'success':True}), 200, {'ContentType':'application/json'} 

    @app.route('/get_services', methods=['GET'])
    def get_services():
        if request.method == 'GET':
                print("GET SERVICES: "+os.getcwd())
                services_list_names = [service for service in os.listdir("Services") if service.find('.') == -1]
                configs_list_names = [os.listdir("Services/{0}/Configs/schemas".format(service)) for service in services_list_names if os.path.isdir("Services/{0}/Configs/schemas".format(service))]
                handlers_list_names = [os.listdir("Services/{0}/Handlers/schemas".format(service)) for service in services_list_names if os.path.isdir("Services/{0}/Handlers/schemas".format(service))]

                for handlers_names in handlers_list_names:
                    for i in range(len(handlers_names)):
                        handlers_names[i] = handlers_names[i].replace(".yaml","")
                for configs_names in configs_list_names:
                    for i in range(len(configs_names)):
                        configs_names[i] = configs_names[i].replace(".yaml","")

                services_list = []
                for service_name, configs_names, handlers_names in zip(services_list_names,configs_list_names,handlers_list_names):
                    services_list += [{"name":service_name,"handlers":handlers_names, "configs":configs_names}]
                print(services_list)
                response = app.response_class(
                                    response=json.dumps(services_list),
                                    status=200,
                                    mimetype='application/json'
                                )
                return response
        response.headers['Access-Control-Allow-Origin'] = "*"
        return json.dumps({'success':True}), 200, {'ContentType':'application/json'} 
    port_main = 3010
        
    app.run(port=port_main,threaded=False)      
start()
