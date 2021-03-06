from flask import Flask, jsonify, request, render_template, flash, request, redirect, url_for, send_from_directory
import os
import io
import json
from flask_cors import CORS
import yaml
from sys import getdefaultencoding

import http.server
import socketserver
from  urllib.parse  import urlparse
import os

from threading import Thread
import webbrowser
import subprocess

from psutil import process_iter
from signal import SIGKILL
# bashCommand = "freeport 9000"
# process = subprocess.Popen(bashCommand.split(), stdout=subprocess.PIPE)
# output, error = process.communicate()

# bashCommand = "freeport 3010"
# process = subprocess.Popen(bashCommand.split(), stdout=subprocess.PIPE)
# output, error = process.communicate()
# for proc in process_iter():
#     for conns in proc.connections(kind='inet'):
#         if conns.laddr[1] == 3010:
#             proc.send_signal(SIGKILL) 
#             continue

getdefaultencoding()

def start(port):
    app = Flask(__name__)

    UPLOAD_FOLDER = './'
    app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
    CORS(app, support_credentials=True)

    PREFIX = ""
    SERVICES_DIR = "./Services"
    CONFIGS_DIR = "/Configs"
    CLIENTS_DIR = "/Clients"
    HANDLERS_DIR = "/Handlers"
    SCHEMAS_DIR = "/schemas"
    DIRS_FOR_NEW_SERVICE = [CONFIGS_DIR,
                            CLIENTS_DIR,
                            HANDLERS_DIR,
                            CONFIGS_DIR+SCHEMAS_DIR,
                            CLIENTS_DIR+SCHEMAS_DIR,
                            HANDLERS_DIR+SCHEMAS_DIR,
                            ]
    
    PARAMS_FOR_SERVICE = ['description']

    create_service_router = app.route(PREFIX+'/create_service', methods=['POST'])
    update_service_router = app.route(PREFIX+'/update_service', methods=['POST'])
    delete_service_router = app.route(PREFIX+'/delete_service/<name>', methods=['POST'])
    create_service_check_name_router = app.route(PREFIX+'/create_service/check_name', methods=['POST'])

    create_handler_router = app.route(PREFIX+'/create_handler', methods=['POST'])
    update_handler_router = app.route(PREFIX+'/update_handler', methods=['POST'])
    delete_handler_router = app.route(PREFIX+'/delete_handler/<name>/<handler_name>', methods=['POST'])
    create_handler_check_name_router = app.route(PREFIX+'/create_handler/check_name', methods=['POST'])

    create_client_router  = app.route(PREFIX+'/create_client', methods=['POST'])
    update_client_router  = app.route(PREFIX+'/update_client', methods=['POST'])
    delete_client_router  = app.route(PREFIX+'/delete_client/<name>/<client_name>', methods=['POST'])
    create_client_check_name_router = app.route(PREFIX+'/create_client/check_name', methods=['POST'])

    create_config_router  = app.route(PREFIX+'/create_config', methods=['POST'])
    update_config_router  = app.route(PREFIX+'/update_config', methods=['POST'])
    delete_config_router  = app.route(PREFIX+'/delete_config/<name>/<config_name>', methods=['POST'])
    create_config_check_name_router = app.route(PREFIX+'/create_config/check_name', methods=['POST'])

    get_services_router   = app.route('/get_services', methods=['GET'])
    get_service_router   = app.route('/get_service/<name>', methods=['GET'])
    get_handler_router   = app.route('/get_handler/<name>/<handler_name>', methods=['GET'])
    get_config_router   = app.route('/get_config/<name>/<config_name>', methods=['GET'])
    get_client_router   = app.route('/get_client/<name>/<client_name>', methods=['GET'])


    #Utilities
    def create_folders(SERVICE_DIR):
            try:
                os.mkdir(SERVICES_DIR)
            except:
                pass
            os.mkdir(SERVICE_DIR)
            for DIR in DIRS_FOR_NEW_SERVICE:
                os.mkdir(SERVICE_DIR+DIR)

    def check_folders(SERVICE_DIR):
            if os.path.isdir(SERVICE_DIR):
                return True

    def check_name(name):
        if not name or name == "undefined":
             raise Exception("Name is empty or equals undefined")
        if not name.islower():
            raise Exception("Name must be lowercase")
        if ' ' in name:
            raise Exception("Name must not have spaces")

    ############
    @create_service_check_name_router
    def create_service_check_name():
         if request.method == 'POST':
                try:
                    service_name = request.form["name"]
                    description = request.form["description"]
                    if not description or description == "undefined":
                        return (json.dumps("Empty description"),
                                400, 
                                {'ContentType':'application/json'})      
                    try:
                        check_name(service_name)
                    except Exception as e:
                        return (json.dumps("Service name error: {0}".format(str(e))),
                                400, 
                                {'ContentType':'application/json'})
                    service_dir = SERVICES_DIR+'/'+service_name
                    
                    if check_folders(service_dir):
                            return (json.dumps('Service already exists!'),
                                400, 
                                {'ContentType':'application/json'})
                    return (json.dumps('OK. Correct service name'),
                                200, 
                                {'ContentType':'application/json'})
                except Exception as e:
                    return (json.dumps({'Incorrect name':True, "message":str(e)}),
                            400, {'ContentType':'application/json'})
                            
    @create_service_router
    def create_service():
        if request.method == 'POST':
                try:
                    service_name = request.form["name"]
                    try:
                        check_name(service_name)
                    except Exception as e:
                        return (json.dumps("Service name error: {0}".format(str(e))),
                                400, 
                                {'ContentType':'application/json'})
                    params = []
                    for param in PARAMS_FOR_SERVICE:
                        params.append(param)
                    
                    files = list(request.files.items())
                    if(len(list(files)) == 0):
                        files = [request.form["file"]]

                    if(not files):
                        return (json.dumps("There are no files!"),
                                    400, {'ContentType':'application/json'})

                    for file in files:
                        file = yaml.safe_load(file)
                        for param,param_name in zip(params,PARAMS_FOR_SERVICE):
                            file[param_name] = param
                        service_dir = SERVICES_DIR+'/'+service_name
                        
                        try:
                            create_folders(service_dir)
                        except Exception as e:
                            return (json.dumps({'Service already exists!':True,
                                "message":str(e)}),
                                400, 
                                {'ContentType':'application/json'})

                        path_to_yaml = service_dir+"/service.yaml"

                        with io.open(path_to_yaml, 'w+', encoding='utf8') as outfile:
                            yaml.dump(file, outfile, default_flow_style=False, allow_unicode=True,sort_keys=False)

                except Exception as e:
                    return (json.dumps({'Incorrect yaml':True, "message":str(e)}),
                            400, {'ContentType':'application/json'})

        return (json.dumps({'success':True}),
                200, {'ContentType':'application/json'})

    @update_service_router
    def update_service():
        if request.method == 'POST':
                try:
                    service_name = request.form["name"]
                    try:
                        check_name(service_name)
                    except Exception as e:
                        return (json.dumps("Service name error: {0}".format(str(e))),
                                400, 
                                {'ContentType':'application/json'})
               
                    files = list(request.files.items())
                    if(len(list(files)) == 0):
                        files = [request.form["file"]]

                    if(not files):
                        return (json.dumps("There are no files!"),
                                    400, {'ContentType':'application/json'})

                    for file in files:
                        file = yaml.safe_load(file)
                        service_dir = SERVICES_DIR+'/'+service_name
                        
                        try:
                            create_folders(service_dir)
                            return (json.dumps({'Service does not exist!':True,
                                "message":str(e)}),
                                400, 
                                {'ContentType':'application/json'})
                        except Exception as e:
                             pass

                        path_to_yaml = service_dir+"/service.yaml"

                        with io.open(path_to_yaml, 'w+', encoding='utf8') as outfile:
                            yaml.dump(file, outfile, default_flow_style=False, allow_unicode=True,sort_keys=False)

                except Exception as e:
                    return (json.dumps({'Incorrect yaml':True, "message":str(e)}),
                            400, {'ContentType':'application/json'})

        return (json.dumps({'success':True}),
                200, {'ContentType':'application/json'})





    @create_handler_router
    def create_handler():
        if request.method == 'POST':
                try:
                        name = request.form["name"]
                        handler_name = request.form["handler_name"]
                        description = request.form["description"]

                        try:
                            check_name(handler_name)
                        except Exception as e:
                            return (json.dumps("Handler name error: {0}".format(str(e))),
                                    400, 
                                    {'ContentType':'application/json'})

                        files = list(request.files.items())
                        if(len(list(files)) == 0):
                            files = [request.form["file"]]

                        if(not files):
                            return (json.dumps("There are no files!"),
                                        400, {'ContentType':'application/json'})

                        for file in files:
                            file = yaml.safe_load(file)
                            file["description"] = description
                            service_dir = SERVICES_DIR+'/'+name
                        
                            dir_to_yaml = service_dir+HANDLERS_DIR+SCHEMAS_DIR
                            path_to_yaml = dir_to_yaml+"/"+handler_name+".yaml"

                            if os.path.isfile(path_to_yaml):
                                return json.dumps('Handler already exists!'), 400, {'ContentType':'application/json'} 
                            try:
                                with io.open(path_to_yaml, 'w+', encoding='utf8') as outfile:
                                    yaml.dump(file, outfile, default_flow_style=False, allow_unicode=True,sort_keys=False)
                            except Exception as e:
                                return (json.dumps('Perhaps there is no such server! message: {0}'.format(str(e))),
                                       400,
                                       {'ContentType':'application/json'})

                except Exception as e:
                    return json.dumps({'Incorrect yaml':True, "message":str(e)}), 400, {'ContentType':'application/json'} 
                return app.response_class(
                            response=json.dumps("OK"),
                            status=200,
                            mimetype='application/json'
                        )
        return json.dumps("There is no request for the path"), 400, {'ContentType':'application/json'} 

    @update_handler_router
    def update_handler():
        if request.method == 'POST':
                try:
                        name = request.form["name"]
                        handler_name = request.form["handler_name"]

                        try:
                            check_name(handler_name)
                        except Exception as e:
                            return (json.dumps("Handler name error: {0}".format(str(e))),
                                    400, 
                                    {'ContentType':'application/json'})

                        files = list(request.files.items())
                        if(len(list(files)) == 0):
                            files = [request.form["file"]]

                        if(not files):
                            return (json.dumps("There are no files!"),
                                        400, {'ContentType':'application/json'})
                        print(files)
                        for file in files:
                            file = yaml.safe_load(file)
                            
                            service_dir = SERVICES_DIR+'/'+name
                        
                            dir_to_yaml = service_dir+HANDLERS_DIR+SCHEMAS_DIR
                            path_to_yaml = dir_to_yaml+"/"+handler_name+".yaml"

                            if not os.path.isfile(path_to_yaml):
                                return json.dumps('Handler does not exist!'), 400, {'ContentType':'application/json'} 
                            try:
                                with io.open(path_to_yaml, 'w+', encoding='utf8') as outfile:
                                    yaml.dump(file, outfile, default_flow_style=False, allow_unicode=True,sort_keys=False)
                            except Exception as e:
                                return (json.dumps('Perhaps there is no such server! message: {0}'.format(str(e))),
                                       400,
                                       {'ContentType':'application/json'})

                except Exception as e:
                    return json.dumps({'Incorrect yaml':True, "message":str(e)}), 400, {'ContentType':'application/json'} 
                return app.response_class(
                            response=json.dumps("OK"),
                            status=200,
                            mimetype='application/json'
                        )
        return json.dumps("There is no request for the path"), 400, {'ContentType':'application/json'} 



    @create_client_router
    def create_client():
        if request.method == 'POST':
                try:
                        name = request.form["name"]
                        client_name = request.form["client_name"]
                        description = request.form["description"]

                        try:
                            check_name(client_name)
                        except Exception as e:
                            return (json.dumps("Client name error: {0}".format(str(e))),
                                    400, 
                                    {'ContentType':'application/json'})

                        files = list(request.files.items())
                       
                        if(len(list(files)) == 0):
                            files = [request.form["file"]]

                        if(not files):
                            return (json.dumps("There are no files!"),
                                        400, {'ContentType':'application/json'})
                        for file in files:
                            file = yaml.safe_load(file)
                            file["description"] = description
                            service_dir = SERVICES_DIR +'/' + name

                            dir_to_yaml = service_dir+CLIENTS_DIR+SCHEMAS_DIR
                            path_to_yaml = dir_to_yaml+"/"+client_name+".yaml"
                            if os.path.isfile(path_to_yaml):
                                return json.dumps('Client already exists!'), 400, {'ContentType':'application/json'} 
                            
                            try:
                                with io.open(path_to_yaml, 'w+', encoding='utf8') as outfile:
                                    yaml.dump(file, outfile, default_flow_style=False, allow_unicode=True,sort_keys=False)
                            except Exception as e:
                                return (json.dumps('Perhaps there is no such server! message: {0}'.format(str(e))),
                                       400,
                                       {'ContentType':'application/json'})
                except Exception as e:
                    return json.dumps({'Incorrect yaml':True, "message":str(e)}), 400, {'ContentType':'application/json'} 
                return app.response_class(
                            response=json.dumps("OK"),
                            status=200,
                            mimetype='application/json'
                        )
    
        return json.dumps("There is no request for the path"), 400, {'ContentType':'application/json'} 

    @update_client_router
    def update_client():
        if request.method == 'POST':
                try:
                        name = request.form["name"]
                        client_name = request.form["client_name"]

                        try:
                            check_name(client_name)
                        except Exception as e:
                            return (json.dumps("Client name error: {0}".format(str(e))),
                                    400, 
                                    {'ContentType':'application/json'})

                        files = list(request.files.items())
                       
                        if(len(list(files)) == 0):
                            files = [request.form["file"]]

                        if(not files):
                            return (json.dumps("There are no files!"),
                                        400, {'ContentType':'application/json'})
                        for file in files:
                            file = yaml.safe_load(file)
                            service_dir = SERVICES_DIR +'/' + name

                            dir_to_yaml = service_dir+CLIENTS_DIR+SCHEMAS_DIR
                            path_to_yaml = dir_to_yaml+"/"+client_name+".yaml"
                            if not os.path.isfile(path_to_yaml):
                                return json.dumps('Client does not exist!'), 400, {'ContentType':'application/json'} 
                            
                            try:
                                with io.open(path_to_yaml, 'w+', encoding='utf8') as outfile:
                                    yaml.dump(file, outfile, default_flow_style=False, allow_unicode=True,sort_keys=False)
                            except Exception as e:
                                return (json.dumps('Perhaps there is no such server! message: {0}'.format(str(e))),
                                       400,
                                       {'ContentType':'application/json'})
                except Exception as e:
                    return json.dumps({'Incorrect yaml':True, "message":str(e)}), 400, {'ContentType':'application/json'} 
                return app.response_class(
                            response=json.dumps("OK"),
                            status=200,
                            mimetype='application/json'
                        )
    
        return json.dumps("There is no request for the path"), 400, {'ContentType':'application/json'} 


    @create_config_router
    def create_config():
        if request.method == 'POST':
                try:
                        name = request.form["name"]
                        config_name = request.form["config_name"]
                        description = request.form["description"]
    
                        try:
                            check_name(config_name)
                        except Exception as e:
                            return (json.dumps("Config name error: {0}".format(str(e))),
                                    400, 
                                    {'ContentType':'application/json'})

                        files = list(request.files.items())
                       
                        if(len(list(files)) == 0):
                            files = [request.form["file"]]

                        if(not files):
                            return (json.dumps("There are no files!"),
                                        400, {'ContentType':'application/json'})
                        for file in files:
                            file = yaml.safe_load(file)
                            file["description"] = description
                            service_dir = SERVICES_DIR + '/' + name

                            dir_to_yaml = service_dir+CONFIGS_DIR+SCHEMAS_DIR
                            path_to_yaml = dir_to_yaml+"/"+config_name+".yaml"
                            if os.path.isfile(path_to_yaml):
                                return json.dumps('Config already exists!'), 400, {'ContentType':'application/json'} 
                            
                            try:
                                with io.open(path_to_yaml, 'w+', encoding='utf8') as outfile:
                                    yaml.dump(file, outfile, default_flow_style=False, allow_unicode=True,sort_keys=False)
                            except Exception as e:
                                return (json.dumps('Perhaps there is no such server! message: {0}'.format(str(e))),
                                       400,
                                       {'ContentType':'application/json'})
                except Exception as e:
                    return json.dumps({'Incorrect yaml':True, "message":str(e)}), 400, {'ContentType':'application/json'} 
                return app.response_class(
                            response=json.dumps("OK"),
                            status=200,
                            mimetype='application/json'
                        )

        return json.dumps("There is no request for the path"), 400, {'ContentType':'application/json'} 

    @update_config_router
    def update_config():
        if request.method == 'POST':
                try:
                        print("AAAA")
                        name = request.form["name"]
                        config_name = request.form["config_name"]
                        print("NAME",name, config_name)
                        try:
                            check_name(config_name)
                        except Exception as e:
                            return (json.dumps("Config name error: {0}".format(str(e))),
                                    400, 
                                    {'ContentType':'application/json'})

                        files = list(request.files.items())
                       
                        if(len(list(files)) == 0):
                            files = [request.form["file"]]

                        if(not files):
                            return (json.dumps("There are no files!"),
                                        400, {'ContentType':'application/json'})
                        for file in files:
                            file = yaml.safe_load(file)
                            service_dir = SERVICES_DIR + '/' + name

                            dir_to_yaml = service_dir+CONFIGS_DIR+SCHEMAS_DIR
                            path_to_yaml = dir_to_yaml+"/"+config_name+".yaml"
                            if not os.path.isfile(path_to_yaml):
                                return json.dumps('Config does not exist!'), 400, {'ContentType':'application/json'} 
                            
                            try:
                                with io.open(path_to_yaml, 'w+', encoding='utf8') as outfile:
                                    yaml.dump(file, outfile, default_flow_style=False, allow_unicode=True,sort_keys=False)
                            except Exception as e:
                                return (json.dumps('Perhaps there is no such server! message: {0}'.format(str(e))),
                                       400,
                                       {'ContentType':'application/json'})
                except Exception as e:
                    return json.dumps({'Incorrect yaml':True, "message":str(e)}), 400, {'ContentType':'application/json'} 
                return app.response_class(
                            response=json.dumps("OK"),
                            status=200,
                            mimetype='application/json'
                        )

        return json.dumps("There is no request for the path"), 400, {'ContentType':'application/json'} 




    @get_services_router
    def get_services():
        if not os.path.isdir(SERVICES_DIR):
            return   app.response_class(
                                    response=json.dumps("There are no services!"),
                                    status=400,
                                    mimetype='application/json'
                                )

        if request.method == 'GET':
                services_list_names = [service for service in os.listdir(SERVICES_DIR) 
                                               if os.path.isdir(SERVICES_DIR+"/"+service)]
                configs_list_names = [os.listdir(SERVICES_DIR+"/"+service+CONFIGS_DIR+SCHEMAS_DIR) for service in services_list_names 
                                               if os.path.isdir(SERVICES_DIR+"/"+service+CONFIGS_DIR+SCHEMAS_DIR)]
                handlers_list_names = [os.listdir(SERVICES_DIR+"/"+service+HANDLERS_DIR+SCHEMAS_DIR) for service in services_list_names 
                                               if os.path.isdir(SERVICES_DIR+"/"+service+HANDLERS_DIR+SCHEMAS_DIR)]
                clients_list_names = [os.listdir(SERVICES_DIR+"/"+service+CLIENTS_DIR+SCHEMAS_DIR) for service in services_list_names 
                                               if os.path.isdir(SERVICES_DIR+"/"+service+CLIENTS_DIR+SCHEMAS_DIR)]

                for handlers_names in handlers_list_names:
                    for i in range(len(handlers_names)):
                        handlers_names[i] = handlers_names[i].replace(".yaml","")
                for configs_names in configs_list_names:
                    for i in range(len(configs_names)):
                        configs_names[i] = configs_names[i].replace(".yaml","")
                for clients_names in clients_list_names:
                    for i in range(len(clients_names)):
                        clients_names[i] = clients_names[i].replace(".yaml","")

                services_list = []
                for service_name, configs_names,clients_names, handlers_names in zip(services_list_names,
                                                                       configs_list_names,
                                                                       clients_list_names,
                                                                       handlers_list_names):
                    services_list += [{"name":service_name,
                                       "handlers":handlers_names,
                                       "clients": clients_names,
                                       "configs":configs_names}]

                response = app.response_class(
                                    response=json.dumps(services_list),
                                    status=200,
                                    mimetype='application/json'
                                )
                return response

        return app.response_class(
                                    response=json.dumps("OK"),
                                    status=200,
                                    mimetype='application/json'
                                )    

    @get_handler_router
    def get_handler(name,handler_name):
        if not os.path.isdir(SERVICES_DIR):
            return   app.response_class(
                                    response=json.dumps("There are no services!"),
                                    status=400,
                                    mimetype='application/json'
                                )
        if request.method == 'GET':
            try:
                return  send_from_directory(SERVICES_DIR+"/"+name+HANDLERS_DIR+SCHEMAS_DIR, handler_name+".yaml",
                cache_timeout=0)
            except Exception as e:
                return json.dumps("Perhaps there is no such handler, message:"+str(e)), 400, {'ContentType':'application/json'} 
        return json.dumps("Invalid request"), 400, {'ContentType':'application/json'}  

    @delete_handler_router
    def delete_handler(name,handler_name):
        if not os.path.isdir(SERVICES_DIR):
            return   app.response_class(
                                    response=json.dumps("There are no services!"),
                                    status=400,
                                    mimetype='application/json'
                                )
        if request.method == 'POST':
            try:
                os.remove(SERVICES_DIR+"/"+name+HANDLERS_DIR+SCHEMAS_DIR+'/'+handler_name+".yaml")
                return  json.dumps("Handler was deleted!"), 200, {'ContentType':'application/json'}
            except Exception as e:
                return json.dumps("Perhaps there is no such handler, message:"+str(e)), 400, {'ContentType':'application/json'} 
        return json.dumps("Invalid request"), 400, {'ContentType':'application/json'}  

    @get_config_router
    def get_config(name, config_name):
        if not os.path.isdir(SERVICES_DIR):
            return   app.response_class(
                                    response=json.dumps("There are no services!"),
                                    status=400,
                                    mimetype='application/json'
                                )
        if request.method == 'GET':
            try:
                return  send_from_directory(SERVICES_DIR+"/"+name+CONFIGS_DIR+SCHEMAS_DIR, config_name+".yaml",
                cache_timeout=0)
            except Exception as e:
                return json.dumps("Perhaps there is no such config, message:"+str(e)), 400, {'ContentType':'application/json'} 
        return json.dumps("Invalid request"), 400, {'ContentType':'application/json'}  

    @delete_config_router
    def delete_config(name, config_name):
        if not os.path.isdir(SERVICES_DIR):
            return   app.response_class(
                                    response=json.dumps("There are no services!"),
                                    status=400,
                                    mimetype='application/json'
                                )
        if request.method == 'POST':
            try:
                os.remove(SERVICES_DIR+"/"+name+CONFIGS_DIR+SCHEMAS_DIR+'/'+config_name+".yaml")
                return  json.dumps("Config was deleted!"), 200, {'ContentType':'application/json'}
            except Exception as e:
                return json.dumps("Perhaps there is no such config, message:"+str(e)), 400, {'ContentType':'application/json'} 
        return json.dumps("Invalid request"), 400, {'ContentType':'application/json'}  

    @get_client_router
    def get_client(name, client_name):
        if not os.path.isdir(SERVICES_DIR):
            return   app.response_class(
                                    response=json.dumps("There are no services!"),
                                    status=400,
                                    mimetype='application/json'
                                )
        if request.method == 'GET':
            try:
                return  send_from_directory(SERVICES_DIR+"/"+name+CLIENTS_DIR+SCHEMAS_DIR, client_name+".yaml",
                cache_timeout=0)
            except Exception as e:
                return json.dumps("Perhaps there is no such config, message:"+str(e)), 400, {'ContentType':'application/json'} 
        return json.dumps("Invalid request"), 400, {'ContentType':'application/json'}  

    @delete_client_router
    def delete_client(name, client_name):
        if not os.path.isdir(SERVICES_DIR):
            return   app.response_class(
                                    response=json.dumps("There are no services!"),
                                    status=400,
                                    mimetype='application/json'
                                )
        if request.method == 'POST':
            try:
                os.remove(SERVICES_DIR+"/"+name+CLIENTS_DIR+SCHEMAS_DIR+'/'+client_name+".yaml")
                return  json.dumps("Client was deleted!"), 200, {'ContentType':'application/json'}
            except Exception as e:
                return json.dumps("Perhaps there is no such config, message:"+str(e)), 400, {'ContentType':'application/json'} 
        return json.dumps("Invalid request"), 400, {'ContentType':'application/json'}  

    @get_service_router
    def get_service(name):
        if not os.path.isdir(SERVICES_DIR):
            return   app.response_class(
                                    response=json.dumps("There are no services!"),
                                    status=400,
                                    mimetype='application/json'
                                )
        if request.method == 'GET':
            try:
                return  send_from_directory(SERVICES_DIR+"/"+name,"service.yaml",
                cache_timeout=0)
            except Exception as e:
                return json.dumps("Perhaps there is no such service, message:"+str(e)), 400, {'ContentType':'application/json'} 
        return json.dumps("Invalid request"), 400, {'ContentType':'application/json'}  
    
    app.run(port=port,threaded=False) 



start(port=3010)
