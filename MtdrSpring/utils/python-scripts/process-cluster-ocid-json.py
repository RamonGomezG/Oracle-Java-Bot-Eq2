import json
import sys

# This simple python file reads JSON and tries to access the lab_oke_cluster_id value
# and prints the OCID for processing. The JSON is expected


system_input = json.load(sys.stdin)

try:
    OCID = system_input["lab_oke_cluster_id"]["value"]
    print(OCID)
except KeyError:
    print("Error: Failed to access expected JSON key lab_oke_cluster_id or value")
except json.decoder.JSONDecodeError:
    print("Error: Failed to decode JSON")
except Exception:
    print("Error: Encountered unexpected error")
