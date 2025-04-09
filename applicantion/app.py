from flask import Flask, jsonify, request, render_template
from flask_cors import CORS, cross_origin
from DataBaseServer import DataBaseServer  # Importando o caminho correto

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})
app.config['CORS_HEADERS'] = 'Content-Type'

# Instanciando a classe DataBaseServer
db = DataBaseServer()

@app.route('/')
def index():
    # Exibe o histórico de veículos na página inicial
    history = db.get_vehicle_history()
    return render_template('index.html', rows=history)

@app.route('/api/register_vehicle', methods=['POST'])
@cross_origin()
def register_vehicle():
    # Rota para registrar um novo veículo
    data = request.json
    result = db.register_vehicle(
        plate=data['plate'],
        owner=data['owner'],
        model=data['model'],
        color=data['color'],
        entry_time=data['entry_time']
    )
    
    if result == 'registered':
        return jsonify({'message': 'Veículo registrado com sucesso.'}), 201
    else:
        return jsonify({'message': 'Erro ao registrar veículo.'}), 500

@app.route('/api/exit_vehicle', methods=['POST'])
@cross_origin()
def exit_vehicle():
    # Rota para registrar a saída de um veículo
    data = request.json
    result = db.exit_vehicle(
        plate=data['plate'],
        exit_time=data['exit_time'],
        payment_status=data['paid']
    )
    
    if result == 'exit_recorded':
        return jsonify({'message': 'Saída do veículo registrada.'}), 200
    else:
        return jsonify({'message': 'Erro ao registrar saída do veículo.'}), 500

@app.route('/api/vehicle_history', methods=['GET'])
@cross_origin()
def get_vehicle_history():
    # Rota para obter o histórico de veículos
    history = db.get_vehicle_history()
    if history != 'error':
        return jsonify({'history': history}), 200
    else:
        return jsonify({'message': 'Erro ao obter histórico de veículos.'}), 500

@app.route('/api/vehicle_status/<string:plate>', methods=['GET'])
@cross_origin()
def get_vehicle_status(plate):
    # Rota para verificar o status de um veículo
    status_message = db.check_vehicle_status(plate)
    return jsonify({'message': status_message}), 200

@app.route('/api/check_vehicle/<plate>', methods=['GET'])
def check_vehicle(plate):
    exists = db.vehicle_exists(plate)
    return jsonify({"exists": exists})

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5001, debug=True)
