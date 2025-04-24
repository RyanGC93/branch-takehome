from flask import Flask, request, jsonify
import json
from flask_cors import CORS


def load_json_from_file(file_path):
    try:
        with open(file_path, 'r') as f:
            data = json.load(f)
            return data
    except FileNotFoundError:
        print(f"Error: File not found at '{file_path}'")
        return None
    except json.JSONDecodeError:
        print(f"Error: Invalid JSON format in '{file_path}'")
        return None
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        return None


file_path = 'drugs.json'
json_data = load_json_from_file(file_path)

if json_data:
    print("JSON data loaded successfully:")
    print(json_data)


app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})


@app.route("/api/drug")
def get_drug_by_ndc():
    ndc = request.args.get('NDc')
    if not ndc:
        return jsonify({"error": "NDc parameter is required"}), 400

    if json_data:
        for drug in json_data:
            if drug.get('NDC') == ndc:
                return jsonify(drug)

        return jsonify({"error": f"Drug with NDC '{ndc}' not found"}), 404
    else:
        return jsonify({"error": "Drug data not loaded"}), 500


if __name__ == "__main__":
    app.run(debug=True)